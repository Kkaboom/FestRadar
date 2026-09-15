import dns from "node:dns/promises";
import net from "node:net";
import { normalizeJsonLdEvent, cleanText, safeDate, hashId, normalizeFormat, classifyElectronic } from "./normalize.mjs";
import { profileForUrl } from "./source-catalog.mjs";

const SOCIAL_BLOCKED = /(^|\.)(instagram\.com|tiktok\.com|facebook\.com|fb\.com|x\.com|twitter\.com)$/i;
const LINK_HUB = /(^|\.)(linktr\.ee|beacons\.ai|bio\.site|hoo\.be|solo\.to|allmylinks\.com|lnk\.bio|msha\.ke)$/i;
const MEDIA_NOISE = /(^|\.)(youtube\.com|youtu\.be|spotify\.com|soundcloud\.com|redditmedia\.com|redd\.it|imgur\.com)$/i;

function isPrivateIp(ip){
  if(net.isIPv4(ip)){const p=ip.split(".").map(Number);return p[0]===10||p[0]===127||p[0]===0||(p[0]===169&&p[1]===254)||(p[0]===172&&p[1]>=16&&p[1]<=31)||(p[0]===192&&p[1]===168)||(p[0]===100&&p[1]>=64&&p[1]<=127)}
  if(net.isIPv6(ip)){const s=ip.toLowerCase();return s==="::1"||s.startsWith("fc")||s.startsWith("fd")||s.startsWith("fe80:")}
  return true;
}
async function assertPublicUrl(input){
  const u=new URL(input); if(!["http:","https:"].includes(u.protocol)) throw new Error("URL non HTTP(S)");
  const h=u.hostname.toLowerCase(); if(h==="localhost"||h.endsWith(".local")||h.endsWith(".internal")) throw new Error("Hôte local refusé");
  if(net.isIP(h)){ if(isPrivateIp(h)) throw new Error("Adresse IP privée refusée"); }
  else { const r=await dns.lookup(h,{all:true}); if(!r.length||r.some(x=>isPrivateIp(x.address))) throw new Error("Résolution privée refusée"); }
  return u;
}
async function safeFetch(url,timeoutMs=7000,redirects=0){
  const u=await assertPublicUrl(url), c=new AbortController(), timer=setTimeout(()=>c.abort(),timeoutMs);
  try{
    const response=await fetch(u,{signal:c.signal,redirect:"manual",headers:{"user-agent":"EventTrack/0.3 (+personal electronic-event aggregator; respectful crawler)",accept:"text/html,application/ld+json,application/xml,text/xml,text/calendar,*/*;q=0.5"}});
    if([301,302,303,307,308].includes(response.status)){
      if(redirects>=4) throw new Error("Trop de redirections");
      const location=response.headers.get("location"); if(!location) throw new Error("Redirection sans destination");
      return safeFetch(new URL(location,u).href,timeoutMs,redirects+1);
    }
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    return response;
  } finally { clearTimeout(timer); }
}

function decodeEntities(s=""){return s.replace(/&amp;/gi,"&").replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&lt;/gi,"<").replace(/&gt;/gi,">")}
function flattenJsonLd(node,out=[]){
  if(!node)return out; if(Array.isArray(node)){node.forEach(v=>flattenJsonLd(v,out));return out} if(typeof node!=="object")return out;
  const type=node["@type"],types=Array.isArray(type)?type:[type]; if(types.some(t=>String(t||"").toLowerCase().endsWith("event")))out.push(node);
  if(node["@graph"])flattenJsonLd(node["@graph"],out); for(const value of Object.values(node)){if(value&&typeof value==="object"&&value!==node["@graph"])flattenJsonLd(value,out)} return out;
}
function extractJsonLd(html){
  const events=[], re=/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi; let m;
  while((m=re.exec(html))){let raw=m[1].trim().replace(/^\s*<!--|-->\s*$/g,""); if(!raw)continue; try{flattenJsonLd(JSON.parse(raw),events)}catch{}}
  return events;
}
function meta(html,key){
  const escaped=key.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  const a=new RegExp(`<meta\\b[^>]*(?:property|name|itemprop)=["']${escaped}["'][^>]*content=["']([^"']+)["'][^>]*>`,`i`).exec(html)?.[1];
  const b=new RegExp(`<meta\\b[^>]*content=["']([^"']+)["'][^>]*(?:property|name|itemprop)=["']${escaped}["'][^>]*>`,`i`).exec(html)?.[1];
  return decodeEntities(a||b||"");
}
function firstHref(html,base){const href=html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=[#']([^#']+)[#']/i)?.[1];try{return href?new URL(decodeEntities(href),base).href:base}catch{return base}}
function genericStructuredEvent(html,source,url){
  const title=cleanText(meta(html,"og:title")||meta(html,"twitter:title")||html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]||"",220);
  const description=cleanText(meta(html,"og:description")||meta(html,"description")||"",700);
  const startRaw=meta(html,"startDate")||html.match(/itemprop=["']startDate["'][^>]*(?:content|datetime)=["']([^"']+)["']/i)?.[1]||html.match(/<time\b[^>]*datetime=["']([^"']+)["']/i)?.[1]||html.match(/["']startDate["']\s*:\s*[#']([^#']+)[#']/i)?.[1];
  const startDate=safeDate(startRaw); if(!title||!startDate)return null;
  const context=`${title} ${description}`; const cls=classifyElectronic(context,source); if(!cls.relevant)return null;
  const venue=cleanText(meta(html,"location")||meta(html,"venue")||html.match(/itemprop=[#']name["'][^>]*content=["']([^"']+)["']/i)?.[1]||"",150);
  const city=cleanText(meta(html,"addressLocality")||html.match(/itemprop=["']addressLocality["'][^>]*content=["']([^"']+)["']/i)?.[1]||"",100);
  const country=cleanText(meta(html,"addressCountry")||source.country||"",100); const format=normalizeFormat(context); const profile=profileForUrl(url);
  return {id:hashId(title.toLowerCase(),startDate.slice(0,10),city.toLowerCase(),country.toLowerCase()),title,startDate,endDate:safeDate(meta(html,"endDate")),venue,city,region:"",country,category:format,format,genres:cls.genres,description,imageUrl:meta(html,"og:image"),eventUrl:firstHref(html,url),sourceId:source.id,sourceName:profile.name||source.name,sourceUrl:url,confidence:profile.trusted?88:76,verified:Boolean(profile.trusted&&city),verificationLevel:profile.trusted?profile.sourceTier:"structured-web",evidenceUrls:[url],manual:false,discoveredAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
}

function unfoldIcs(text){return text.replace(/\r?\n[ \t]/g,"")}
function icsValue(block,key){return block.match(new RegExp(`^${key}(?:;[^:]*)?:(.*)$`,"mi"))?.[1]?.trim()||""}
function parseIcsDate(v){if(!v)return null;if(/^\d{8}T\d{6}Z$/.test(v))return safeDate(`${v.slice(0,4)}-${v.slice(4,6)}-${v.slice(6,8)}T${v.slice(9,11)}:${v.slice(11,13)}:${v.slice(13,15)}Z`);if(/^\d{8}T\d{6}$/.test(v))return safeDate(`${v.slice(0,4)}-${v.slice(4,6)}-${v.slice(6,8)}T${v.slice(9,11)}:${v.slice(11,13)}:${v.slice(13,15)}`);if(/^\d{8}$/.test(v))return safeDate(`${v.slice(0,4)}-${v.slice(4,6)}-${v.slice(6,8)}T00:00:00`);return safeDate(v)}
function unescapeIcs(v){return cleanText(v.replace(/\\n/gi," ").replace(/\\,/g,",").replace(/\\;/g,";").replace(/\\\\/g,"\\"),700)}
function parseIcs(text,source){
  const blocks=unfoldIcs(text).match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/gi)||[];
  return blocks.map(block=>{const title=unescapeIcs(icsValue(block,"SUMMARY")),startDate=parseIcsDate(icsValue(block,"DTSTART"));if(!title||!startDate)return null;const description=unescapeIcs(icsValue(block,"DESCRIPTION")),cats=unescapeIcs(icsValue(block,"CATEGORIES")),cls=classifyElectronic(`${title} ${cats} ${description}`,source);if(!cls.relevant)return null;const location=unescapeIcs(icsValue(block,"LOCATION")),url=icsValue(block,"URL")||source.url,format=normalizeFormat(`${title} ${cats}`);return{id:hashId(title.toLowerCase(),startDate.slice(0,10),location.toLowerCase()),title,startDate,endDate:parseIcsDate(icsValue(block,"DTEND")),venue:location,city:"",region:"",country:source.country||"",category:format,format,genres:cls.genres,description,imageUrl:"",eventUrl:url,sourceId:source.id,sourceName:source.name,sourceUrl:source.url,confidence:source.trusted?95:84,verified:Boolean(source.trusted),verificationLevel:source.sourceTier||"calendar-feed",evidenceUrls:[url,source.url].filter(Boolean),manual:false,discoveredAt:new Date().toISOString(),updatedAt:new Date().toISOString()}}).filter(Boolean);
}
function xmlTag(block,tag){const re=new RegExp(`<${tag}\\b[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`,"i");return cleanText(block.match(re)?.[1]||"",700)}
function parseRss(text,source){
  const blocks=text.match(/<item\b[\s\S]*?<\/item>/gi)||text.match(/<entry\b[\s\S]*?<\/entry>/gi)||[],now=Date.now();
  return blocks.map(block=>{const title=xmlTag(block,"title"),dateRaw=xmlTag(block,"startDate")||xmlTag(block,"event:startDate"),startDate=safeDate(dateRaw);if(!title||!startDate||new Date(startDate).getTime()<now-5184000000)return null;const description=xmlTag(block,"description")||xmlTag(block,"summary")||xmlTag(block,"content"),cls=classifyElectronic(`${title} ${description}`,source);if(!cls.relevant)return null;const href=block.match(/<link\b[^>]*href=[#']([^#']+)[#']/i)?.[1]||xmlTag(block,"link")||source.url,format=normalizeFormat(`${title} ${description}`);return{id:hashId(title.toLowerCase(),startDate.slice(0,10),source.id),title,startDate,endDate:null,venue:"",city:"",region:"",country:source.country||"",category:format,format,genres:cls.genres,description,imageUrl:"",eventUrl:href,sourceId:source.id,sourceName:source.name,sourceUrl:source.url,confidence:source.trusted?80:68,verified:false,verificationLevel:"feed-candidate",evidenceUrls:[href,source.url].filter(Boolean),manual:false,discoveredAt:new Date().toISOString(),updatedAt:new Date().toISOString()}}).filter(Boolean);
}

function extractCandidateLinks(html,base,max=24){
  const out=new Set(); let origin; try{origin=new URL(base)}catch{return[]}
  const re=/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi; let m;
  while((m=re.exec(html))&&out.size<max){try{const u=new URL(decodeEntities(m[1]),origin);if(u.hostname!==origin.hostname||!["http:","https:"].includes(u.protocol))continue;const hint=`${u.pathname} ${cleanText(m[2],120)}`;if(!/(event|events|agenda|party|partys|rave|festival|club|night|parade|open.?air|calendar|programm|ticket|veranstaltung|soiree|fete)/i.test(hint))continue;if(/(login|signup|account|privacy|terms|contact|about|artist|venue|checkout|cart)/i.test(u.pathname))continue;u.hash="";out.add(u.href)}catch{}}
  return [...out];
}
function extractExternalUrls(raw,base,max=40){
  const urls=new Set(); const candidates=[...(raw.match(/https?:\/\/[^\s<>"']+/gi)||[])];
  const hrefRe=/href=(?:&quot;|["'])(https?:\/\/.*?)(?:&quot;|["'])/gi; let m; while((m=hrefRe.exec(raw)))candidates.push(m[1]);
  for(let value of candidates){if(urls.size>=max)break;value=decodeEntities(value).replace(/[),.;]+$/g,"");try{const u=new URL(value,base),h=u.hostname.toLowerCase();if(!["http:","https:"].includes(u.protocol)||/(^|\.)reddit\.com$/i.test(h)||MEDIA_NOISE.test(h))continue;u.hash="";urls.add(u.href)}catch{}}
  return [...urls];
}
async function parseHtmlPage(html,source,url){
  const childSource={...source,...profileForUrl(url),url};
  let events=extractJsonLd(html).map(raw=>normalizeJsonLdEvent(raw,childSource)).filter(Boolean);
  if(!events.length){const generic=genericStructuredEvent(html,childSource,url);if(generic)events=[generic]}
  return events;
}
async function crawlChildPages(html,source){
  const links=extractCandidateLinks(html,source.url,source.maxLinks||24); if(!links.length)return[]; const found=[];
  for(let i=0;i<links.length;i+=5){const batch=await Promise.allSettled(links.slice(i,i+5).map(async url=>{const r=await safeFetch(url,5500);const t=await r.text();if(t.length>3500000)return[];return parseHtmlPage(t,{...source,url},url)}));for(const r of batch)if(r.status==="fulfilled")found.push(...r.value)}
  return found;
}
async function scrapeDiscoveredUrl(url,originSource){
  let u; try{u=new URL(url)}catch{return[]}; const host=u.hostname.toLowerCase(); if(SOCIAL_BLOCKED.test(host)||MEDIA_NOISE.test(host))return[];
  let targets=[url];
  if(LINK_HUB.test(host)){
    try{const r=await safeFetch(url,5000),html=await r.text();targets=extractExternalUrls(html,url,16).filter(x=>{try{const h=new URL(x).hostname.toLowerCase();return !SOCIAL_BLOCKED.test(h)&&!MEDIA_NOISE.test(h)}catch{return false}})}catch{return[]}
  }
  const found=[];
  for(const target of targets.slice(0,12)){
    try{const profile=profileForUrl(target),source={...originSource,id:`discover-${hashId(target)}`,name:profile.name,url:target,trusted:profile.trusted,sourceTier:profile.sourceTier,maxLinks:8};const r=await safeFetch(target,5500),type=(r.headers.get("content-type")||"").toLowerCase(),text=await r.text();if(text.length>3500000)continue;if(type.includes("html")||/<html/i.test(text.slice(0,1000))){let events=await parseHtmlPage(text,source,target);if(!events.length){const child=await crawlChildPages(text,{...source,maxLinks:8});events.push(...child)}for(const e of events){e.discoveryOrigin=originSource.name;e.discoveryUrl=originSource.url;e.evidenceUrls=[...new Set([...(e.evidenceUrls||[]),originSource.url])];found.push(e)}}}catch{}
  }
  return found;
}
async function scrapeRedditDiscovery(source){
  const r=await safeFetch(source.url,6000),text=await r.text(),links=extractExternalUrls(text,source.url,source.maxLinks||18),found=[];
  for(let i=0;i<links.length;i+=4){const batch=await Promise.allSettled(links.slice(i,i+4).map(url=>scrapeDiscoveredUrl(url,source)));for(const x of batch)if(x.status==="fulfilled")found.push(...x.value)}
  return {events:found,parser:"reddit-link-discovery"};
}

export async function scrapeSource(source){
  if(source.kind==="reddit-discovery")return scrapeRedditDiscovery(source);
  const response=await safeFetch(source.url),contentType=(response.headers.get("content-type")||"").toLowerCase(),text=await response.text();if(text.length>6000000)throw new Error("Source trop volumineuse");
  const kind=source.kind||"auto";let events=[],parser="jsonld";
  if(kind==="ics"||contentType.includes("text/calendar")||/BEGIN:VCALENDAR/i.test(text.slice(0,1000))){events=parseIcs(text,source);parser="ics"}
  else if(kind==="rss"||contentType.includes("rss")||contentType.includes("atom")||(/^\s*<\?xml/i.test(text)&&/<(rss|feed)\b/i.test(text.slice(0,3000)))){events=parseRss(text,source);parser="rss"}
  else{events=await parseHtmlPage(text,source,source.url);parser="structured-html";if(kind==="auto"){const child=await crawlChildPages(text,source);if(child.length){events.push(...child);parser="structured-html+crawl"}}}
  return {events,parser};
}
