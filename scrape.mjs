import dns from "node:dns/promises";
import net from "node:net";
import { normalizeJsonLdEvent, cleanText, safeDate, hashId, normalizeCategory } from "./normalize.mjs";

function isPrivateIp(ip) {
  if (net.isIPv4(ip)) {
    const p = ip.split(".").map(Number);
    return p[0] === 10 || p[0] === 127 || p[0] === 0 ||
      (p[0] === 169 && p[1] === 254) ||
      (p[0] === 172 && p[1] >= 16 && p[1] <= 31) ||
      (p[0] === 192 && p[1] === 168) ||
      (p[0] === 100 && p[1] >= 64 && p[1] <= 127);
  }
  if (net.isIPv6(ip)) {
    const s = ip.toLowerCase();
    return s === "::1" || s.startsWith("fc") || s.startsWith("fd") || s.startsWith("fe80:");
  }
  return true;
}

async function assertPublicUrl(input) {
  const u = new URL(input);
  if (!["http:", "https:"].includes(u.protocol)) throw new Error("URL non HTTP(S)");
  const hostname = u.hostname.toLowerCase();
  if (hostname === "localhost" || hostname.endsWith(".local") || hostname.endsWith(".internal")) {
    throw new Error("Hôte local refusé");
  }
  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) throw new Error("Adresse IP privée refusée");
  } else {
    const resolved = await dns.lookup(hostname, { all: true });
    if (!resolved.length || resolved.some(r => isPrivateIp(r.address))) throw new Error("Résolution privée refusée");
  }
  return u;
}

async function safeFetch(url, timeoutMs = 7000, redirects = 0) {
  const u = await assertPublicUrl(url);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(u, {
      signal: controller.signal,
      redirect: "manual",
      headers: {
        "user-agent": "FestRadar/0.1 (+personal event aggregator)",
        "accept": "text/html,application/ld+json,application/xml,text/xml,text/calendar,*/*;q=0.5",
      },
    });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      if (redirects >= 3) throw new Error("Trop de redirections");
      const location = response.headers.get("location");
      if (!location) throw new Error("Redirection sans destination");
      return safeFetch(new URL(location, u).href, timeoutMs, redirects + 1);
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response;
  } finally {
    clearTimeout(timer);
  }
}

function flattenJsonLd(node, out = []) {
  if (!node) return out;
  if (Array.isArray(node)) {
    node.forEach(v => flattenJsonLd(v, out));
    return out;
  }
  if (typeof node !== "object") return out;
  const type = node["@type"];
  const types = Array.isArray(type) ? type : [type];
  if (types.some(t => String(t || "").toLowerCase().endsWith("event"))) out.push(node);
  if (node["@graph"]) flattenJsonLd(node["@graph"], out);
  for (const value of Object.values(node)) {
    if (value && typeof value === "object" && value !== node["@graph"]) flattenJsonLd(value, out);
  }
  return out;
}

function extractJsonLd(html) {
  const events = [];
  const regex = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html))) {
    let raw = match[1].trim();
    if (!raw) continue;
    raw = raw.replace(/^\s*<!--|-->\s*$/g, "");
    try {
      flattenJsonLd(JSON.parse(raw), events);
    } catch {
      // Ignore malformed blocks. Many sites ship invalid JSON-LD next to valid blocks.
    }
  }
  return events;
}

function unfoldIcs(text) {
  return text.replace(/\r?\n[ \t]/g, "");
}

function icsValue(block, key) {
  const re = new RegExp(`^${key}(?:;[^:]*)?:(.*)$`, "mi");
  return block.match(re)?.[1]?.trim() || "";
}

function parseIcsDate(value) {
  if (!value) return null;
  if (/^\d{8}T\d{6}Z$/.test(value)) {
    return safeDate(`${value.slice(0,4)}-${value.slice(4,6)}-${value.slice(6,8)}T${value.slice(9,11)}:${value.slice(11,13)}:${value.slice(13,15)}Z`);
  }
  if (/^\d{8}T\d{6}$/.test(value)) {
    return safeDate(`${value.slice(0,4)}-${value.slice(4,6)}-${value.slice(6,8)}T${value.slice(9,11)}:${value.slice(11,13)}:${value.slice(13,15)}`);
  }
  if (/^\d{8}$/.test(value)) return safeDate(`${value.slice(0,4)}-${value.slice(4,6)}-${value.slice(6,8)}T00:00:00`);
  return safeDate(value);
}

function unescapeIcs(value) {
  return cleanText(value.replace(/\\n/gi, " ").replace(/\\,/g, ",").replace(/\\;/g, ";").replace(/\\\\/g, "\\"), 700);
}

function parseIcs(text, source) {
  const blocks = unfoldIcs(text).match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/gi) || [];
  return blocks.map(block => {
    const title = unescapeIcs(icsValue(block, "SUMMARY"));
    const startDate = parseIcsDate(icsValue(block, "DTSTART"));
    if (!title || !startDate) return null;
    const location = unescapeIcs(icsValue(block, "LOCATION"));
    const url = icsValue(block, "URL") || source.url;
    return {
      id: hashId(title.toLowerCase(), startDate.slice(0, 10), location.toLowerCase()),
      title,
      startDate,
      endDate: parseIcsDate(icsValue(block, "DTEND")),
      venue: location,
      city: "",
      region: "",
      country: source.country || "",
      category: normalizeCategory(`${title} ${unescapeIcs(icsValue(block, "CATEGORIES"))}`),
      description: unescapeIcs(icsValue(block, "DESCRIPTION")),
      imageUrl: "",
      eventUrl: url,
      sourceId: source.id,
      sourceName: source.name,
      sourceUrl: source.url,
      confidence: source.trusted ? 98 : 92,
      manual: false,
      discoveredAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }).filter(Boolean);
}

function xmlTag(block, tag) {
  const re = new RegExp(`<${tag}\\b[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, "i");
  return cleanText(block.match(re)?.[1] || "", 700);
}

function parseRss(text, source) {
  const blocks = text.match(/<item\b[\s\S]*?<\/item>/gi) || text.match(/<entry\b[\s\S]*?<\/entry>/gi) || [];
  const now = Date.now();
  return blocks.map(block => {
    const title = xmlTag(block, "title");
    const dateRaw = xmlTag(block, "startDate") || xmlTag(block, "event:startDate") || xmlTag(block, "pubDate") || xmlTag(block, "updated") || xmlTag(block, "published");
    const startDate = safeDate(dateRaw);
    if (!title || !startDate) return null;
    // RSS is weak: reject ancient feed items as event candidates.
    if (new Date(startDate).getTime() < now - 1000 * 60 * 60 * 24 * 60) return null;
    const href = block.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*\/?\s*>/i)?.[1] || xmlTag(block, "link") || source.url;
    return {
      id: hashId(title.toLowerCase(), startDate.slice(0, 10), source.id),
      title,
      startDate,
      endDate: null,
      venue: "",
      city: "",
      region: "",
      country: source.country || "",
      category: normalizeCategory(title),
      description: xmlTag(block, "description") || xmlTag(block, "summary") || xmlTag(block, "content"),
      imageUrl: "",
      eventUrl: href,
      sourceId: source.id,
      sourceName: source.name,
      sourceUrl: source.url,
      confidence: source.trusted ? 72 : 62,
      manual: false,
      discoveredAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }).filter(Boolean);
}

export async function scrapeSource(source) {
  const response = await safeFetch(source.url);
  const contentType = (response.headers.get("content-type") || "").toLowerCase();
  const text = await response.text();
  if (text.length > 6_000_000) throw new Error("Source trop volumineuse");

  const kind = source.kind || "auto";
  let events = [];
  let parser = "jsonld";

  if (kind === "ics" || contentType.includes("text/calendar") || /BEGIN:VCALENDAR/i.test(text.slice(0, 1000))) {
    events = parseIcs(text, source);
    parser = "ics";
  } else if (kind === "rss" || contentType.includes("rss") || contentType.includes("atom") || /^\s*<\?xml/i.test(text) && /<(rss|feed)\b/i.test(text.slice(0, 3000))) {
    events = parseRss(text, source);
    parser = "rss";
  } else {
    events = extractJsonLd(text).map(raw => normalizeJsonLdEvent(raw, source)).filter(Boolean);
    parser = "jsonld";
  }

  return { events, parser };
}
