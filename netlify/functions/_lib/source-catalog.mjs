export const BUILTIN_SOURCES = [
  // Switzerland — hot sources scanned every cycle
  { id:"builtin-eventfrog-house-techno", name:"Eventfrog · House & Techno CH", url:"https://eventfrog.ch/de/events/ch/house-techno-partys/de/tanz.html", kind:"auto", country:"Switzerland", tags:"techno house electronic club rave", trusted:true, sourceTier:"primary-ticketing", maxLinks:36, alwaysScan:true },
  { id:"builtin-eventfrog-electro", name:"Eventfrog · Electro CH", url:"https://eventfrog.ch/de/events/ch/electro-partys.html", kind:"auto", country:"Switzerland", tags:"electro electronic techno club rave", trusted:true, sourceTier:"primary-ticketing", maxLinks:32, alwaysScan:true },
  { id:"builtin-eventfrog-festivals", name:"Eventfrog · Electronic Festivals CH", url:"https://eventfrog.ch/en/events/ch/electronic-festivals.html", kind:"auto", country:"Switzerland", tags:"electronic festival techno rave open air", trusted:true, sourceTier:"primary-ticketing", maxLinks:30, alwaysScan:true },
  { id:"builtin-ticketcorner-party", name:"Ticketcorner · Party CH", url:"https://www.ticketcorner.ch/en/events/musik-32/party-948/", kind:"auto", country:"Switzerland", tags:"techno trance house dnb hardstyle electronic party", trusted:true, sourceTier:"primary-ticketing", maxLinks:34, alwaysScan:true },
  { id:"builtin-ticketcorner-maex", name:"Ticketcorner · MÄX Zürich", url:"https://www.ticketcorner.ch/en/artist/maex/", kind:"auto", country:"Switzerland", tags:"techno trance dnb electronic club zurich", trusted:true, sourceTier:"primary-ticketing", maxLinks:34, alwaysScan:true },
  { id:"builtin-ra-switzerland", name:"Resident Advisor · Switzerland", url:"https://ra.co/events/ch/switzerland", kind:"auto", country:"Switzerland", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:40, alwaysScan:true },
  { id:"builtin-ra-zurich", name:"Resident Advisor · Zürich", url:"https://ra.co/events/ch/zurich", kind:"auto", country:"Switzerland", tags:"techno house electronic rave club zurich", trusted:true, sourceTier:"specialist-calendar", maxLinks:36, alwaysScan:true },
  { id:"builtin-ra-geneva", name:"Resident Advisor · Geneva", url:"https://ra.co/events/ch/geneva", kind:"auto", country:"Switzerland", tags:"techno house electronic rave club geneva", trusted:true, sourceTier:"specialist-calendar", maxLinks:34, alwaysScan:true },
  { id:"builtin-ra-basel", name:"Resident Advisor · Basel", url:"https://ra.co/events/ch/basel", kind:"auto", country:"Switzerland", tags:"techno house electronic rave club basel", trusted:true, sourceTier:"specialist-calendar", maxLinks:34, alwaysScan:true },
  { id:"builtin-ra-lausanne", name:"Resident Advisor · Lausanne", url:"https://ra.co/events/ch/lausanne", kind:"auto", country:"Switzerland", tags:"techno house electronic rave club lausanne", trusted:true, sourceTier:"specialist-calendar", maxLinks:32, alwaysScan:true },
  { id:"builtin-hive-zurich", name:"Hive Club · Zürich", url:"https://www.hiveclub.ch/programm/", kind:"auto", country:"Switzerland", tags:"techno house club zurich", trusted:true, sourceTier:"official-club", maxLinks:28, alwaysScan:true },
  { id:"builtin-audio-geneva", name:"Audio Club · Geneva", url:"https://www.audio-club.ch/", kind:"auto", country:"Switzerland", tags:"techno house club geneva electronic", trusted:true, sourceTier:"official-club", maxLinks:26, alwaysScan:true },
  { id:"builtin-streetparade", name:"Street Parade · Official", url:"https://www.streetparade.com/en/infos", kind:"auto", country:"Switzerland", tags:"techno parade electronic open air", trusted:true, sourceTier:"official", maxLinks:12, alwaysScan:true },

  // Switzerland — genre and club depth
  { id:"builtin-eventfrog-hardstyle", name:"Eventfrog · Hardstyle CH", url:"https://eventfrog.ch/de/events/ch/hardstyle-partys.html", kind:"auto", country:"Switzerland", tags:"hardstyle hardcore rave", trusted:true, sourceTier:"primary-ticketing", maxLinks:28 },
  { id:"builtin-eventfrog-trance", name:"Eventfrog · Trance & Ambient CH", url:"https://eventfrog.ch/de/events/ch/trance-ambient-partys.html", kind:"auto", country:"Switzerland", tags:"trance electronic rave", trusted:true, sourceTier:"primary-ticketing", maxLinks:28 },
  { id:"builtin-eventfrog-goa", name:"Eventfrog · Goa CH", url:"https://eventfrog.ch/de/events/ch/goa-partys.html", kind:"auto", country:"Switzerland", tags:"goa psytrance psychedelic trance rave", trusted:true, sourceTier:"primary-ticketing", maxLinks:28 },
  { id:"builtin-eventfrog-dnb", name:"Eventfrog · DnB CH", url:"https://eventfrog.ch/fr/events/ch/fetes-dubstep-dnb.html", kind:"auto", country:"Switzerland", tags:"drum bass dnb jungle dubstep rave", trusted:true, sourceTier:"primary-ticketing", maxLinks:26 },
  { id:"builtin-elysia-basel", name:"Elysia · Basel", url:"https://elysia.ch/", kind:"auto", country:"Switzerland", tags:"techno club basel electronic", trusted:true, sourceTier:"official-club", maxLinks:22 },
  { id:"builtin-kaschemme-basel", name:"Kaschemme · Basel", url:"https://www.kaschemme.ch/", kind:"auto", country:"Switzerland", tags:"techno electronic club basel", trusted:true, sourceTier:"official-club", maxLinks:22 },
  { id:"builtin-borderline-basel", name:"Borderline Club · Basel", url:"https://www.borderlineclub.ch/", kind:"auto", country:"Switzerland", tags:"techno rave club basel", trusted:true, sourceTier:"official-club", maxLinks:22 },
  { id:"builtin-kinker-basel", name:"Kinker · Basel", url:"https://www.kinker.ch/", kind:"auto", country:"Switzerland", tags:"techno electronic club basel", trusted:true, sourceTier:"official-club", maxLinks:22 },
  { id:"builtin-nordstern-basel", name:"Nordstern · Basel", url:"https://www.nordstern.com/", kind:"auto", country:"Switzerland", tags:"techno house electronic club basel", trusted:true, sourceTier:"official-club", maxLinks:26 },
  { id:"builtin-heimat-basel", name:"Heimat · Basel", url:"https://www.heimatbasel.com/", kind:"auto", country:"Switzerland", tags:"techno house club basel", trusted:true, sourceTier:"official-club", maxLinks:20 },
  { id:"builtin-kuppel-nest", name:"Kuppel / Nest · Basel", url:"https://www.kuppel-basel.ch/programm?filter=nest", kind:"auto", country:"Switzerland", tags:"techno electronic club basel nest", trusted:true, sourceTier:"official-club", maxLinks:24 },
  { id:"builtin-basso-basel", name:"Basso · Basel", url:"https://www.bassoverse.space/beats", kind:"auto", country:"Switzerland", tags:"electronic techno house basel", trusted:true, sourceTier:"official-club", maxLinks:20 },
  { id:"builtin-viertel-basel", name:"Das Viertel · Basel", url:"https://www.dasviertel.ch/", kind:"auto", country:"Switzerland", tags:"techno house electronic basel", trusted:true, sourceTier:"official-club", maxLinks:24 },
  { id:"builtin-singer-basel", name:"Singer Klub · Basel", url:"https://www.singerklub.ch/programm", kind:"auto", country:"Switzerland", tags:"electronic techno house basel club", trusted:true, sourceTier:"official-club", maxLinks:22 },
  { id:"builtin-humbug-basel", name:"Humbug · Basel", url:"https://www.humbug.club/", kind:"auto", country:"Switzerland", tags:"electronic techno club basel", trusted:true, sourceTier:"official-club", maxLinks:20 },
  { id:"builtin-hafenkran-basel", name:"Hafenkran · Basel", url:"https://www.hafenkran.ch/", kind:"auto", country:"Switzerland", tags:"techno electronic open air basel", trusted:true, sourceTier:"official-club", maxLinks:20 },
  { id:"builtin-friedas-zurich", name:"Frieda's Büxe · Zürich", url:"https://friedasbuexe.ch/", kind:"auto", country:"Switzerland", tags:"techno house club zurich", trusted:true, sourceTier:"official-club", maxLinks:24 },
  { id:"builtin-le-zoo-linkhub", name:"Le Zoo / Usine · public links", url:"https://linktr.ee/lezoo_usine", kind:"reddit-discovery", country:"Switzerland", tags:"techno acid electronic club geneva", trusted:false, sourceTier:"public-link-hub", maxLinks:18 },

  // Specialist electronic calendars / ticketing — Europe
  { id:"builtin-ra-berlin", name:"Resident Advisor · Berlin", url:"https://ra.co/events/de/berlin", kind:"auto", country:"Germany", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:30 },
  { id:"builtin-ra-amsterdam", name:"Resident Advisor · Amsterdam", url:"https://ra.co/events/nl/amsterdam", kind:"auto", country:"Netherlands", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:30 },
  { id:"builtin-ra-paris", name:"Resident Advisor · Paris", url:"https://ra.co/events/fr/paris", kind:"auto", country:"France", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:30 },
  { id:"builtin-ra-london", name:"Resident Advisor · London", url:"https://ra.co/events/uk/london", kind:"auto", country:"United Kingdom", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:30 },
  { id:"builtin-ra-barcelona", name:"Resident Advisor · Barcelona", url:"https://ra.co/events/es/barcelona", kind:"auto", country:"Spain", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:26 },
  { id:"builtin-ra-madrid", name:"Resident Advisor · Madrid", url:"https://ra.co/events/es/madrid", kind:"auto", country:"Spain", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:24 },
  { id:"builtin-ra-lisbon", name:"Resident Advisor · Lisbon", url:"https://ra.co/events/pt/lisbon", kind:"auto", country:"Portugal", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:24 },
  { id:"builtin-ra-vienna", name:"Resident Advisor · Vienna", url:"https://ra.co/events/at/vienna", kind:"auto", country:"Austria", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:24 },
  { id:"builtin-ra-prague", name:"Resident Advisor · Prague", url:"https://ra.co/events/cz/prague", kind:"auto", country:"Czechia", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:24 },
  { id:"builtin-ra-warsaw", name:"Resident Advisor · Warsaw", url:"https://ra.co/events/pl/warsaw", kind:"auto", country:"Poland", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:24 },
  { id:"builtin-ra-krakow", name:"Resident Advisor · Kraków", url:"https://ra.co/events/pl/krakow", kind:"auto", country:"Poland", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:22 },
  { id:"builtin-ra-brussels", name:"Resident Advisor · Brussels", url:"https://ra.co/events/be/brussels", kind:"auto", country:"Belgium", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:24 },
  { id:"builtin-ra-milan", name:"Resident Advisor · Milan", url:"https://ra.co/events/it/milan", kind:"auto", country:"Italy", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:24 },
  { id:"builtin-ra-budapest", name:"Resident Advisor · Budapest", url:"https://ra.co/events/hu/budapest", kind:"auto", country:"Hungary", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:22 },
  { id:"builtin-ra-copenhagen", name:"Resident Advisor · Copenhagen", url:"https://ra.co/events/dk/copenhagen", kind:"auto", country:"Denmark", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:22 },
  { id:"builtin-shotgun-paris", name:"Shotgun · Paris", url:"https://shotgun.live/fr/cities/paris", kind:"auto", country:"France", tags:"techno house electronic rave club hard techno", trusted:true, sourceTier:"primary-ticketing", maxLinks:30 },
  { id:"builtin-shotgun-berlin", name:"Shotgun · Berlin", url:"https://shotgun.live/en/cities/berlin", kind:"auto", country:"Germany", tags:"techno house electronic rave club hard techno", trusted:true, sourceTier:"primary-ticketing", maxLinks:24 },
  { id:"builtin-goabase", name:"Goabase · Global Psytrance", url:"https://www.goabase.net/en/fr/", kind:"auto", country:"", tags:"psytrance goa techno tekno festival open air club", trusted:true, sourceTier:"specialist-calendar", maxLinks:30 },
  { id:"builtin-partyflock", name:"Partyflock · Agenda", url:"https://partyflock.nl/agenda", kind:"auto", country:"Netherlands", tags:"techno hardstyle hardcore rave festival", trusted:true, sourceTier:"specialist-calendar", maxLinks:28 },
  { id:"builtin-skiddle-techno", name:"Skiddle · Techno UK", url:"https://www.skiddle.com/whats-on/techno-events/", kind:"auto", country:"United Kingdom", tags:"techno rave club festival", trusted:true, sourceTier:"primary-ticketing", maxLinks:26 },
  { id:"builtin-skiddle-house-techno", name:"Skiddle · House & Techno UK", url:"https://www.skiddle.com/clubs/house-techno.html", kind:"auto", country:"United Kingdom", tags:"house techno electronic rave club festival", trusted:true, sourceTier:"primary-ticketing", maxLinks:26 },
  { id:"builtin-ravetheplanet", name:"Rave The Planet · Official", url:"https://www.ravetheplanet.com/en/", kind:"auto", country:"Germany", tags:"techno parade electronic berlin", trusted:true, sourceTier:"official", maxLinks:16 },

  // Reddit is discovery-only. We follow public external URLs, then verify against the destination source.
  { id:"builtin-reddit-aves", name:"Reddit · r/aves", url:"https://www.reddit.com/r/aves/new/.rss", kind:"reddit-discovery", country:"", tags:"rave techno electronic", trusted:false, sourceTier:"community-discovery", maxLinks:22 },
  { id:"builtin-reddit-techno", name:"Reddit · r/Techno", url:"https://www.reddit.com/r/Techno/new/.rss", kind:"reddit-discovery", country:"", tags:"techno electronic club", trusted:false, sourceTier:"community-discovery", maxLinks:22 },
  { id:"builtin-reddit-psytrance", name:"Reddit · r/psytrance", url:"https://www.reddit.com/r/psytrance/new/.rss", kind:"reddit-discovery", country:"", tags:"psytrance goa festival rave", trusted:false, sourceTier:"community-discovery", maxLinks:20 },
  { id:"builtin-reddit-dnb", name:"Reddit · r/DnB", url:"https://www.reddit.com/r/DnB/new/.rss", kind:"reddit-discovery", country:"", tags:"drum bass dnb jungle rave", trusted:false, sourceTier:"community-discovery", maxLinks:18 },
  { id:"builtin-reddit-hardstyle", name:"Reddit · r/hardstyle", url:"https://www.reddit.com/r/hardstyle/new/.rss", kind:"reddit-discovery", country:"", tags:"hardstyle hardcore festival rave", trusted:false, sourceTier:"community-discovery", maxLinks:18 },
  { id:"builtin-reddit-trance", name:"Reddit · r/trance", url:"https://www.reddit.com/r/trance/new/.rss", kind:"reddit-discovery", country:"", tags:"trance electronic rave", trusted:false, sourceTier:"community-discovery", maxLinks:16 },
  { id:"builtin-reddit-switzerland", name:"Reddit · r/Switzerland", url:"https://www.reddit.com/r/Switzerland/new/.rss", kind:"reddit-discovery", country:"Switzerland", tags:"switzerland techno rave club festival electronic", trusted:false, sourceTier:"community-discovery", maxLinks:22 },
  { id:"builtin-reddit-zurich", name:"Reddit · r/zurich", url:"https://www.reddit.com/r/zurich/new/.rss", kind:"reddit-discovery", country:"Switzerland", tags:"zurich techno rave club electronic", trusted:false, sourceTier:"community-discovery", maxLinks:20 },
  { id:"builtin-reddit-geneva", name:"Reddit · r/geneva", url:"https://www.reddit.com/r/geneva/new/.rss", kind:"reddit-discovery", country:"Switzerland", tags:"geneva techno rave club electronic", trusted:false, sourceTier:"community-discovery", maxLinks:18 }
];

export function getBuiltinSource(id) { return BUILTIN_SOURCES.find(s => s.id === id) || null; }

const DOMAIN_PROFILES = [
  [/^(www\.)?eventfrog\.ch$/i,{name:"Eventfrog",trusted:true,sourceTier:"primary-ticketing"}],
  [/^(www\.)?ticketcorner\.ch$/i,{name:"Ticketcorner",trusted:true,sourceTier:"primary-ticketing"}],
  [/(^|\.)ra\.co$/i,{name:"Resident Advisor",trusted:true,sourceTier:"specialist-calendar"}],
  [/(^|\.)shotgun\.live$/i,{name:"Shotgun",trusted:true,sourceTier:"primary-ticketing"}],
  [/(^|\.)dice\.fm$/i,{name:"DICE",trusted:true,sourceTier:"primary-ticketing"}],
  [/(^|\.)goabase\.net$/i,{name:"Goabase",trusted:true,sourceTier:"specialist-calendar"}],
  [/(^|\.)partyflock\.nl$/i,{name:"Partyflock",trusted:true,sourceTier:"specialist-calendar"}],
  [/(^|\.)skiddle\.com$/i,{name:"Skiddle",trusted:true,sourceTier:"primary-ticketing"}],
  [/(^|\.)streetparade\.com$/i,{name:"Street Parade · Official",trusted:true,sourceTier:"official"}],
  [/(^|\.)ravetheplanet\.com$/i,{name:"Rave The Planet · Official",trusted:true,sourceTier:"official"}],
  [/(^|\.)hiveclub\.ch$/i,{name:"Hive Club",trusted:true,sourceTier:"official-club"}],
  [/(^|\.)audio-club\.ch$/i,{name:"Audio Club",trusted:true,sourceTier:"official-club"}],
  [/(^|\.)elysia\.ch$/i,{name:"Elysia",trusted:true,sourceTier:"official-club"}],
  [/(^|\.)nordstern\.com$/i,{name:"Nordstern",trusted:true,sourceTier:"official-club"}],
  [/(^|\.)friedasbuexe\.ch$/i,{name:"Frieda's Büxe",trusted:true,sourceTier:"official-club"}],
  [/(^|\.)weticket\.io$/i,{name:"WeTicket",trusted:true,sourceTier:"primary-ticketing"}],
  [/(^|\.)eventix\.shop$/i,{name:"Eventix",trusted:true,sourceTier:"primary-ticketing"}],
  [/(^|\.)ticket\.io$/i,{name:"ticket.io",trusted:true,sourceTier:"primary-ticketing"}]
];

export function profileForUrl(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    const hit = DOMAIN_PROFILES.find(([re]) => re.test(host));
    return hit ? hit[1] : { name: host.replace(/^www\./,""), trusted:false, sourceTier:"web-discovered" };
  } catch { return { name:"Web discovery", trusted:false, sourceTier:"web-discovered" }; }
}
