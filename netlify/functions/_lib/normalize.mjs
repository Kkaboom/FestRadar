import { createHash } from "node:crypto";

export function cleanText(value, max = 500) {
  if (value == null) return "";
  return String(value).replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/\s+/g, " ").trim().slice(0, max);
}
export function safeDate(value) { if (!value) return null; const d = new Date(String(value).trim()); return Number.isNaN(d.getTime()) ? null : d.toISOString(); }
export function hashId(...parts) { return createHash("sha256").update(parts.filter(Boolean).join("|")).digest("hex").slice(0, 20); }

const GENRES = [
  ["Hard Techno", /\b(hard\s?techno|schranz|hardgroove)\b/i], ["Techno", /\b(techno|tekno|detroit techno|melodic techno)\b/i],
  ["House", /\b(house|tech house|deep house|acid house|progressive house)\b/i], ["Trance", /\b(trance|hard trance|progressive trance)\b/i],
  ["Hardcore", /\b(hardcore|gabber|hardstyle|uptempo|frenchcore|rawstyle)\b/i], ["Drum & Bass", /\b(drum\s*(?:&|and|n)\s*bass|dnb|jungle|neurofunk)\b/i],
  ["Psytrance", /\b(psytrance|psychedelic trance|goa trance)\b/i], ["Industrial / Acid", /\b(industrial|acid techno|acid rave|ebm)\b/i],
  ["Electronic", /\b(electronic|electro|electronica|edm|dance music|dj set|club music)\b/i]
];
const ELECTRONIC_CONTEXT = /\b(rave|warehouse|free party|afterparty|open air|club night|all night long|dj|dancefloor|soundsystem)\b/i;
const EXCLUDED = /\b(hip[ -]?hop|rap|trap music|classical|opera|operetta|theatre|theater|stand[ -]?up|comedy show|symphony|orchestra|ballet)\b/i;
const TRUSTED_ELECTRONIC_DOMAINS = /(^|\.)(ra\.co|residentadvisor\.net)$/i;

export function classifyElectronic(value = "", source = {}) {
  const sourceText = `${source.tags || ""} ${source.name || ""}`;
  const text = cleanText(`${value} ${sourceText}`, 4000);
  const genres = GENRES.filter(([, re]) => re.test(text)).map(([name]) => name);
  const explicitSourceTag = /\b(techno|electronic|electro|rave|house|trance|hardcore|dnb|psytrance)\b/i.test(source.tags || "");
  let trustedDomain = false;
  try { trustedDomain = TRUSTED_ELECTRONIC_DOMAINS.test(new URL(source.url || "https://invalid").hostname); } catch {}
  const positive = genres.length > 0 || ELECTRONIC_CONTEXT.test(text) || explicitSourceTag || trustedDomain;
  const excluded = EXCLUDED.test(text) && genres.length === 0 && !explicitSourceTag && !trustedDomain;
  const score = Math.min(100, (genres.length ? 65 : 0) + (ELECTRONIC_CONTEXT.test(text) ? 20 : 0) + (explicitSourceTag ? 20 : 0) + (trustedDomain ? 25 : 0));
  return { relevant: positive && !excluded, genres: genres.length ? [...new Set(genres)] : (positive ? ["Electronic"] : []), electronicScore: score };
}

export function normalizeFormat(value = "") {
  const s = cleanText(value, 2000).toLowerCase();
  if (/(after\s?party|afterhours|after hours|official after)/.test(s)) return "Afterparty";
  if (/(secret location|invite only|invitation only|private party|location tba|free party)/.test(s)) return "Private / Secret";
  if (/(street parade|parade|open air|open-air|outdoor rave|city parade)/.test(s)) return "Open air / Parade";
  if (/(warehouse|rave|underground party|illegal rave|teknival)/.test(s)) return "Rave / Warehouse";
  if (/(festival|fest\b)/.test(s)) return "Festival";
  if (/(club night|nightclub|club\b|all night long)/.test(s)) return "Club night";
  return "Electronic event";
}
export function normalizeCategory(value = "") { return normalizeFormat(value); }

function locationParts(location) {
  if (!location) return {};
  if (typeof location === "string") return { venue: cleanText(location, 150) };
  const address = location.address || {};
  return { venue: cleanText(location.name || "",150), city: cleanText(address.addressLocality || location.addressLocality || "",100), region: cleanText(address.addressRegion || location.addressRegion || "",100), country: cleanText(typeof address.addressCountry === "object" ? address.addressCountry.name : (address.addressCountry || location.addressCountry || ""),100) };
}

export function normalizeJsonLdEvent(raw, source) {
  const loc = locationParts(raw.location); const title = cleanText(raw.name || raw.headline, 220); const startDate = safeDate(raw.startDate); if (!title || !startDate) return null;
  const rawGenre = Array.isArray(raw.genre) ? raw.genre.join(" ") : (raw.genre || ""); const keywords = Array.isArray(raw.keywords) ? raw.keywords.join(" ") : (raw.keywords || "");
  const context = `${title} ${rawGenre} ${keywords} ${raw.eventType || ""} ${raw.description || ""}`; const cls = classifyElectronic(context, source); if (!cls.relevant) return null;
  const eventUrl = typeof raw.url === "string" ? raw.url : source.url; const image = Array.isArray(raw.image) ? raw.image[0] : raw.image; const format = normalizeFormat(context);
  const confidence = Math.min(100, 88 + (source.trusted ? 8 : 0) + (loc.city ? 2 : 0) + (cls.electronicScore >= 65 ? 2 : 0));
  return { id: hashId(title.toLowerCase(),startDate.slice(0,10),loc.city.toLowerCase(),loc.country.toLowerCase()), title,startDate,endDate:safeDate(raw.endDate),venue:loc.venue,city:loc.city,region:loc.region,country:loc.country || source.country || "",category:format,format,genres:cls.genres,electronicScore:cls.electronicScore,description:cleanText(raw.description,700),imageUrl:typeof image === "string" ? image : (image?.url || ""),eventUrl,sourceId:source.id,sourceName:source.name,sourceUrl:source.url,confidence,manual:false,discoveredAt:new Date().toISOString(),updatedAt:new Date().toISOString() };
}

export function normalizeManualEvent(raw) {
  const title=cleanText(raw.title,220), startDate=safeDate(raw.startDate); if(!title||!startDate)return null; const city=cleanText(raw.city,100), country=cleanText(raw.country,100); const context=`${title} ${raw.category||""} ${raw.description||""}`; const cls=classifyElectronic(context,{tags:"techno electronic"}); const format=normalizeFormat(raw.category||context);
  return { id:raw.id||hashId("manual",title.toLowerCase(),startDate.slice(0,10),city.toLowerCase(),country.toLowerCase()),title,startDate,endDate:safeDate(raw.endDate),venue:cleanText(raw.venue,150),city,region:cleanText(raw.region,100),country,category:format,format,genres:cls.genres,description:cleanText(raw.description,700),imageUrl:cleanText(raw.imageUrl,500),eventUrl:cleanText(raw.eventUrl,500),sourceId:"manual",sourceName:"Ajout admin",sourceUrl:cleanText(raw.eventUrl,500),confidence:100,manual:true,discoveredAt:raw.discoveredAt||new Date().toISOString(),updatedAt:new Date().toISOString() };
}

export function dedupeEvents(events) {
  const map=new Map(); for(const event of events){ if(!event?.id)continue; const existing=map.get(event.id); if(!existing){map.set(event.id,{...event,sourceCount:1});continue;} const winner=(event.manual||event.confidence>existing.confidence)?event:existing; map.set(event.id,{...existing,...winner,genres:[...new Set([...(existing.genres||[]),...(event.genres||[])])],confidence:Math.max(existing.confidence||0,event.confidence||0),sourceCount:(existing.sourceCount||1)+1,updatedAt:new Date().toISOString()}); } return [...map.values()].sort((a,b)=>new Date(a.startDate)-new Date(b.startDate));
}
