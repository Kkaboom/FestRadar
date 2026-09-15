import { createHash } from "node:crypto";

export function cleanText(value, max = 500) {
  if (value == null) return "";
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function safeDate(value) {
  if (!value) return null;
  const d = new Date(String(value).trim());
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export function hashId(...parts) {
  return createHash("sha256").update(parts.filter(Boolean).join("|")).digest("hex").slice(0, 20);
}

const GENRES = [
  ["Hard Techno", /\b(hard\s?techno|schranz|hardgroove|hard groove|hard bounce)\b/i],
  ["Techno", /\b(techno|tekno|detroit techno|melodic techno|minimal techno|hypnotic techno|peak time)\b/i],
  ["House", /\b(house|tech house|deep house|acid house|progressive house|afro house|tribal house|minimal house)\b/i],
  ["Trance", /\b(trance|hard trance|progressive trance|hardtrance)\b/i],
  ["Hardcore", /\b(hardcore|gabber|hardstyle|uptempo|frenchcore|rawstyle|raw hardstyle)\b/i],
  ["Drum & Bass", /\b(drum\s*(?:&|and|n)\s*bass|dnb|d&b|jungle|neurofunk|liquid dnb)\b/i],
  ["Psytrance", /\b(psytrance|psychedelic trance|goa(?:trance)?|fullon|darkpsy|psycore|hi-tech)\b/i],
  ["Industrial / Acid", /\b(industrial|acid techno|acid rave|ebm|acid core)\b/i],
  ["Electronic", /\b(electronic|electronica|electro|edm|dance music|dj set|club music|rave)\b/i]
];
const ELECTRONIC_CONTEXT = /\b(rave|warehouse|free party|afterparty|after party|afterhours|open air|club night|all night long|dj|dancefloor|soundsystem|teknival|daydance)\b/i;
const EXCLUDED = /\b(hip[ -]?hop|rap|trap(?: music)?|classical|opera|operetta|theatre|theater|stand[ -]?up|comedy show|symphony|orchestra|ballet|musical theatre|spoken word)\b/i;

export function classifyElectronic(value = "", source = {}) {
  const eventText = cleanText(value, 5000);
  const sourceText = cleanText(`${source.tags || ""} ${source.name || ""}`, 1000);
  const eventGenres = GENRES.filter(([, re]) => re.test(eventText)).map(([name]) => name);
  const sourceGenres = GENRES.filter(([, re]) => re.test(sourceText)).map(([name]) => name);
  const strongEventGenre = eventGenres.some(g => g !== "Electronic");
  const eventContext = ELECTRONIC_CONTEXT.test(eventText);
  const sourceContext = sourceGenres.length > 0 || ELECTRONIC_CONTEXT.test(sourceText);
  const excluded = EXCLUDED.test(eventText) && !strongEventGenre;
  const relevant = !excluded && (eventGenres.length > 0 || eventContext || (sourceContext && !EXCLUDED.test(eventText)));
  const genres = [...new Set(eventGenres.length ? eventGenres : (relevant ? sourceGenres : []))];
  return {
    relevant,
    genres: genres.length ? genres : (relevant ? ["Electronic"] : []),
    electronicScore: Math.min(100, (strongEventGenre ? 70 : 0) + (eventGenres.includes("Electronic") ? 15 : 0) + (eventContext ? 20 : 0) + (sourceContext ? 10 : 0))
  };
}

export function normalizeFormat(value = "") {
  const s = cleanText(value, 3000).toLowerCase();
  if (/(after\s?party|afterhours|after hours|official after)/.test(s)) return "Afterparty";
  if (/(secret location|invite only|invitation only|private party|location tba|free party|secret rave)/.test(s)) return "Private / Secret";
  if (/(street parade|parade|open air|open-air|outdoor rave|city parade|daydance)/.test(s)) return "Open air / Parade";
  if (/(warehouse|rave|underground party|illegal rave|teknival|industrial underground)/.test(s)) return "Rave / Warehouse";
  if (/(festival|fest\b)/.test(s)) return "Festival";
  if (/(club night|nightclub|club\b|all night long)/.test(s)) return "Club night";
  return "Electronic event";
}
export function normalizeCategory(value = "") { return normalizeFormat(value); }

function locationParts(location) {
  if (!location) return {};
  if (typeof location === "string") return { venue: cleanText(location, 150) };
  const address = location.address || {};
  return {
    venue: cleanText(location.name || "", 150),
    city: cleanText(address.addressLocality || location.addressLocality || "", 100),
    region: cleanText(address.addressRegion || location.addressRegion || "", 100),
    country: cleanText(typeof address.addressCountry === "object" ? address.addressCountry.name : (address.addressCountry || location.addressCountry || ""), 100)
  };
}

function verificationForSource(source, hasLocation) {
  const tier = source.sourceTier || (source.trusted ? "trusted-web" : "web-discovered");
  if (tier === "official") return { verified:true, verificationLevel:"official", base:99 };
  if (tier === "primary-ticketing") return { verified:true, verificationLevel:"primary-ticketing", base:96 };
  if (tier === "specialist-calendar") return { verified:true, verificationLevel:"specialist-calendar", base:94 };
  if (source.trusted) return { verified:true, verificationLevel:"trusted-source", base:91 };
  return { verified:Boolean(hasLocation), verificationLevel:hasLocation ? "structured-source" : "community-discovered", base:hasLocation ? 82 : 74 };
}

export function normalizeJsonLdEvent(raw, source) {
  const loc = locationParts(raw.location);
  const title = cleanText(raw.name || raw.headline, 220);
  const startDate = safeDate(raw.startDate);
  if (!title || !startDate) return null;
  const rawGenre = Array.isArray(raw.genre) ? raw.genre.join(" ") : (raw.genre || "");
  const keywords = Array.isArray(raw.keywords) ? raw.keywords.join(" ") : (raw.keywords || "");
  const context = `${title} ${rawGenre} ${keywords} ${raw.eventType || ""} ${raw.description || ""}`;
  const cls = classifyElectronic(context, source);
  if (!cls.relevant) return null;
  const eventUrl = typeof raw.url === "string" ? raw.url : source.url;
  const image = Array.isArray(raw.image) ? raw.image[0] : raw.image;
  const format = normalizeFormat(context);
  const verify = verificationForSource(source, Boolean(loc.city || loc.venue));
  const confidence = Math.min(100, verify.base + (loc.city ? 2 : 0) + (cls.electronicScore >= 65 ? 1 : 0));
  return {
    id: hashId(title.toLowerCase(), startDate.slice(0, 10), loc.city.toLowerCase(), loc.country.toLowerCase()),
    title,startDate,endDate:safeDate(raw.endDate),venue:loc.venue,city:loc.city,region:loc.region,country:loc.country || source.country || "",
    category:format,format,genres:cls.genres,electronicScore:cls.electronicScore,description:cleanText(raw.description,700),
    imageUrl:typeof image === "string" ? image : (image?.url || ""),eventUrl,sourceId:source.id,sourceName:source.name,sourceUrl:source.url,
    confidence,verified:verify.verified,verificationLevel:verify.verificationLevel,evidenceUrls:[eventUrl,source.url].filter(Boolean),manual:false,
    discoveredAt:new Date().toISOString(),updatedAt:new Date().toISOString()
  };
}

export function normalizeManualEvent(raw) {
  const title=cleanText(raw.title,220), startDate=safeDate(raw.startDate);
  if(!title||!startDate)return null;
  const city=cleanText(raw.city,100), country=cleanText(raw.country,100);
  const context=`${title} ${raw.category||""} ${raw.description||""}`;
  const cls=classifyElectronic(context,{tags:"techno electronic"});
  const format=normalizeFormat(raw.category||context);
  return {
    id:raw.id||hashId("manual",title.toLowerCase(),startDate.slice(0,10),city.toLowerCase(),country.toLowerCase()),title,startDate,endDate:safeDate(raw.endDate),
    venue:cleanText(raw.venue,150),city,region:cleanText(raw.region,100),country,category:format,format,genres:cls.genres,description:cleanText(raw.description,700),
    imageUrl:cleanText(raw.imageUrl,500),eventUrl:cleanText(raw.eventUrl,500),sourceId:"manual",sourceName:"Ajout admin",sourceUrl:cleanText(raw.eventUrl,500),
    confidence:100,verified:true,verificationLevel:"admin-verified",evidenceUrls:[cleanText(raw.eventUrl,500)].filter(Boolean),manual:true,
    discoveredAt:raw.discoveredAt||new Date().toISOString(),updatedAt:new Date().toISOString()
  };
}

export function dedupeEvents(events) {
  const map=new Map();
  for(const event of events){
    if(!event?.id)continue;
    const existing=map.get(event.id);
    if(!existing){ map.set(event.id,{...event,sourceCount:event.sourceCount||1}); continue; }
    const winner=(event.manual || (event.confidence||0)>(existing.confidence||0)) ? event : existing;
    map.set(event.id,{
      ...existing,...winner,
      genres:[...new Set([...(existing.genres||[]),...(event.genres||[])])],
      evidenceUrls:[...new Set([...(existing.evidenceUrls||[]),...(event.evidenceUrls||[]),existing.eventUrl,event.eventUrl].filter(Boolean))].slice(0,8),
      verified:Boolean(existing.verified||event.verified),
      confidence:Math.max(existing.confidence||0,event.confidence||0),
      sourceCount:(existing.sourceCount||1)+1,
      updatedAt:new Date().toISOString()
    });
  }
  return [...map.values()].sort((a,b)=>new Date(a.startDate)-new Date(b.startDate));
}
