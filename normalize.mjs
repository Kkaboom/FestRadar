import { createHash } from "node:crypto";

export function cleanText(value, max = 500) {
  if (value == null) return "";
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function safeDate(value) {
  if (!value) return null;
  const s = String(value).trim();
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export function hashId(...parts) {
  return createHash("sha256").update(parts.filter(Boolean).join("|")).digest("hex").slice(0, 20);
}

export function normalizeCategory(value = "") {
  const s = cleanText(value, 100).toLowerCase();
  const rules = [
    [/(techno|electro|edm|rave|dance|dj)/, "Électro / Techno"],
    [/(parade|défilé|street)/, "Parade"],
    [/(carnaval|carnival|fasnacht|fasching)/, "Carnaval"],
    [/(pride|lgbt|queer)/, "Pride"],
    [/(festival|music|concert|musique)/, "Festival"],
    [/(fair|fête|fest|party|fiesta|feast)/, "Fête"],
    [/(culture|cultural|tradition|folklore)/, "Culture / Tradition"],
  ];
  for (const [re, name] of rules) if (re.test(s)) return name;
  return cleanText(value, 60) || "Événement";
}

function locationParts(location) {
  if (!location) return {};
  if (typeof location === "string") return { venue: cleanText(location, 150) };
  const address = location.address || {};
  return {
    venue: cleanText(location.name || "", 150),
    city: cleanText(address.addressLocality || location.addressLocality || "", 100),
    region: cleanText(address.addressRegion || location.addressRegion || "", 100),
    country: cleanText(
      typeof address.addressCountry === "object" ? address.addressCountry.name : (address.addressCountry || location.addressCountry || ""),
      100
    ),
  };
}

export function normalizeJsonLdEvent(raw, source) {
  const loc = locationParts(raw.location);
  const title = cleanText(raw.name || raw.headline, 220);
  const startDate = safeDate(raw.startDate);
  if (!title || !startDate) return null;
  const eventUrl = typeof raw.url === "string" ? raw.url : source.url;
  const image = Array.isArray(raw.image) ? raw.image[0] : raw.image;
  const categoryRaw = Array.isArray(raw.eventType) ? raw.eventType.join(" ") : (raw.eventType || raw.genre || raw.keywords || title);
  const confidence = Math.min(100, 90 + (source.trusted ? 8 : 0) + (loc.city ? 2 : 0));
  return {
    id: hashId(title.toLowerCase(), startDate.slice(0, 10), loc.city.toLowerCase(), loc.country.toLowerCase()),
    title,
    startDate,
    endDate: safeDate(raw.endDate),
    venue: loc.venue,
    city: loc.city,
    region: loc.region,
    country: loc.country || source.country || "",
    category: normalizeCategory(categoryRaw),
    description: cleanText(raw.description, 700),
    imageUrl: typeof image === "string" ? image : (image?.url || ""),
    eventUrl,
    sourceId: source.id,
    sourceName: source.name,
    sourceUrl: source.url,
    confidence,
    manual: false,
    discoveredAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function normalizeManualEvent(raw) {
  const title = cleanText(raw.title, 220);
  const startDate = safeDate(raw.startDate);
  if (!title || !startDate) return null;
  const city = cleanText(raw.city, 100);
  const country = cleanText(raw.country, 100);
  return {
    id: raw.id || hashId("manual", title.toLowerCase(), startDate.slice(0, 10), city.toLowerCase(), country.toLowerCase()),
    title,
    startDate,
    endDate: safeDate(raw.endDate),
    venue: cleanText(raw.venue, 150),
    city,
    region: cleanText(raw.region, 100),
    country,
    category: normalizeCategory(raw.category || title),
    description: cleanText(raw.description, 700),
    imageUrl: cleanText(raw.imageUrl, 500),
    eventUrl: cleanText(raw.eventUrl, 500),
    sourceId: "manual",
    sourceName: "Ajout admin",
    sourceUrl: cleanText(raw.eventUrl, 500),
    confidence: 100,
    manual: true,
    discoveredAt: raw.discoveredAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function dedupeEvents(events) {
  const map = new Map();
  for (const event of events) {
    if (!event?.id) continue;
    const existing = map.get(event.id);
    if (!existing) {
      map.set(event.id, { ...event, sourceCount: 1 });
      continue;
    }
    const winner = (event.manual || event.confidence > existing.confidence) ? event : existing;
    map.set(event.id, {
      ...existing,
      ...winner,
      confidence: Math.max(existing.confidence || 0, event.confidence || 0),
      sourceCount: Math.max(existing.sourceCount || 1, 1) + 1,
      updatedAt: new Date().toISOString(),
    });
  }
  return [...map.values()].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
}
