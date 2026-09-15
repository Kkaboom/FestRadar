export const BUILTIN_SOURCES = [
  // Switzerland — high-value structured/ticketing sources
  { id:"builtin-eventfrog-house-techno", name:"Eventfrog · House & Techno CH", url:"https://eventfrog.ch/de/events/ch/house-techno-partys/de/tanz.html", kind:"auto", country:"Switzerland", tags:"techno house electronic club rave", trusted:true, sourceTier:"primary-ticketing", maxLinks:32 },
  { id:"builtin-eventfrog-electro", name:"Eventfrog · Electro CH", url:"https://eventfrog.ch/de/events/ch/electro-partys.html", kind:"auto", country:"Switzerland", tags:"electro electronic techno club rave", trusted:true, sourceTier:"primary-ticketing", maxLinks:30 },
  { id:"builtin-eventfrog-festivals", name:"Eventfrog · Electronic Festivals CH", url:"https://eventfrog.ch/en/events/ch/electronic-festivals.html", kind:"auto", country:"Switzerland", tags:"electronic festival techno rave open air", trusted:true, sourceTier:"primary-ticketing", maxLinks:30 },
  { id:"builtin-eventfrog-hardstyle", name:"Eventfrog · Hardstyle CH", url:"https://eventfrog.ch/de/events/ch/hardstyle-partys.html", kind:"auto", country:"Switzerland", tags:"hardstyle hardcore rave", trusted:true, sourceTier:"primary-ticketing", maxLinks:24 },
  { id:"builtin-eventfrog-trance", name:"Eventfrog · Trance & Ambient CH", url:"https://eventfrog.ch/de/events/ch/trance-ambient-partys.html", kind:"auto", country:"Switzerland", tags:"trance electronic rave", trusted:true, sourceTier:"primary-ticketing", maxLinks:28 },
  { id:"builtin-eventfrog-goa", name:"Eventfrog · Goa CH", url:"https://eventfrog.ch/de/events/ch/goa-partys.html", kind:"auto", country:"Switzerland", tags:"goa psytrance psychedelic trance rave", trusted:true, sourceTier:"primary-ticketing", maxLinks:28 },
  { id:"builtin-eventfrog-dnb", name:"Eventfrog · DnB CH", url:"https://eventfrog.ch/fr/events/ch/fetes-dubstep-dnb.html", kind:"auto", country:"Switzerland", tags:"drum bass dnb jungle dubstep rave", trusted:true, sourceTier:"primary-ticketing", maxLinks:24 },
  { id:"builtin-ticketcorner-party", name:"Ticketcorner · Party CH", url:"https://www.ticketcorner.ch/en/events/musik-32/party-948/", kind:"auto", country:"Switzerland", tags:"techno trance house dnb hardstyle electronic party", trusted:true, sourceTier:"primary-ticketing", maxLinks:30 },
  { id:"builtin-ra-switzerland", name:"Resident Advisor · Switzerland", url:"https://ra.co/events/ch/switzerland", kind:"auto", country:"Switzerland", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:36 },
  { id:"builtin-streetparade", name:"Street Parade · Official", url:"https://www.streetparade.com/en/infos", kind:"auto", country:"Switzerland", tags:"techno parade electronic open air", trusted:true, sourceTier:"official", maxLinks:10 },

  // Specialist electronic calendars / ticketing — Europe
  { id:"builtin-ra-berlin", name:"Resident Advisor · Berlin", url:"https://ra.co/events/de/berlin", kind:"auto", country:"Germany", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:28 },
  { id:"builtin-ra-amsterdam", name:"Resident Advisor · Amsterdam", url:"https://ra.co/events/nl/amsterdam", kind:"auto", country:"Netherlands", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:28 },
  { id:"builtin-ra-paris", name:"Resident Advisor · Paris", url:"https://ra.co/events/fr/paris", kind:"auto", country:"France", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:28 },
  { id:"builtin-ra-london", name:"Resident Advisor · London", url:"https://ra.co/events/uk/london", kind:"auto", country:"United Kingdom", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:28 },
  { id:"builtin-ra-barcelona", name:"Resident Advisor · Barcelona", url:"https://ra.co/events/es/barcelona", kind:"auto", country:"Spain", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:24 },
  { id:"builtin-ra-lisbon", name:"Resident Advisor · Lisbon", url:"https://ra.co/events/pt/lisbon", kind:"auto", country:"Portugal", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:24 },
  { id:"builtin-ra-vienna", name:"Resident Advisor · Vienna", url:"https://ra.co/events/at/vienna", kind:"auto", country:"Austria", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:24 },
  { id:"builtin-ra-prague", name:"Resident Advisor · Prague", url:"https://ra.co/events/cz/prague", kind:"auto", country:"Czechia", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:24 },
  { id:"builtin-ra-warsaw", name:"Resident Advisor · Warsaw", url:"https://ra.co/events/pl/warsaw", kind:"auto", country:"Poland", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:24 },
  { id:"builtin-ra-brussels", name:"Resident Advisor · Brussels", url:"https://ra.co/events/be/brussels", kind:"auto", country:"Belgium", tags:"techno house electronic rave club", trusted:true, sourceTier:"specialist-calendar", maxLinks:24 },
  { id:"builtin-shotgun-paris", name:"Shotgun · Paris", url:"https://shotgun.live/fr/cities/paris", kind:"auto", country:"France", tags:"techno house electronic rave club hard techno", trusted:true, sourceTier:"primary-ticketing", maxLinks:30 },
  { id:"builtin-shotgun-berlin", name:"Shotgun · Berlin", url:"https://shotgun.live/en/cities/berlin", kind:"auto", country:"Germany", tags:"techno house electronic rave club hard techno", trusted:true, sourceTier:"primary-ticketing", maxLinks:24 },
  { id:"builtin-goabase", name:"Goabase · Global Psytrance", url:"https://www.goabase.net/en/fr/", kind:"auto", country:"", tags:"psytrance goa techno tekno festival open air club", trusted:true, sourceTier:"specialist-calendar", maxLinks:30 },
  { id:"builtin-partyflock", name:"Partyflock · Agenda", url:"https://partyflock.nl/agenda", kind:"auto", country:"Netherlands", tags:"techno hardstyle hardcore rave festival", trusted:true, sourceTier:"specialist-calendar", maxLinks:26 },
  { id:"builtin-skiddle-techno", name:"Skiddle · Techno UK", url:"https://www.skiddle.com/whats-on/techno-events/", kind:"auto", country:"United Kingdom", tags:"techno rave club festival", trusted:true, sourceTier:"primary-ticketing", maxLinks:24 },
  { id:"builtin-skiddle-house-techno", name:"Skiddle · House & Techno UK", url:"https://www.skiddle.com/clubs/house-techno.html", kind:"auto", country:"United Kingdom", tags:"house techno electronic rave club festival", trusted:true, sourceTier:"primary-ticketing", maxLinks:24 },
  { id:"builtin-ravetheplanet", name:"Rave The Planet · Official", url:"https://www.ravetheplanet.com/en/", kind:"auto", country:"Germany", tags:"techno parade electronic berlin", trusted:true, sourceTier:"official", maxLinks:14 },

  // Reddit is discovery-only: posts never become events by themselves.
  { id:"builtin-reddit-aves", name:"Reddit · r/aves", url:"https://www.reddit.com/r/aves/new/.rss", kind:"reddit-discovery", country:"", tags:"rave techno electronic", trusted:false, sourceTier:"community-discovery", maxLinks:18 },
  { id:"builtin-reddit-techno", name:"Reddit · r/Techno", url:"https://www.reddit.com/r/Techno/new/.rss", kind:"reddit-discovery", country:"", tags:"techno electronic club", trusted:false, sourceTier:"community-discovery", maxLinks:18 },
  { id:"builtin-reddit-psytrance", name:"Reddit · r/psytrance", url:"https://www.reddit.com/r/psytrance/new/.rss", kind:"reddit-discovery", country:"", tags:"psytrance goa festival rave", trusted:false, sourceTier:"community-discovery", maxLinks:18 },
  { id:"builtin-reddit-dnb", name:"Reddit · r/DnB", url:"https://www.reddit.com/r/DnB/new/.rss", kind:"reddit-discovery", country:"", tags:"drum bass dnb jungle rave", trusted:false, sourceTier:"community-discovery", maxLinks:16 },
  { id:"builtin-reddit-hardstyle", name:"Reddit · r/hardstyle", url:"https://www.reddit.com/r/hardstyle/new/.rss", kind:"reddit-discovery", country:"", tags:"hardstyle hardcore festival rave", trusted:false, sourceTier:"community-discovery", maxLinks:16 },
  { id:"builtin-reddit-trance", name:"Reddit · r/trance", url:"https://www.reddit.com/r/trance/new/.rss", kind:"reddit-discovery", country:"", tags:"trance electronic rave", trusted:false, sourceTier:"community-discovery", maxLinks:14 }
];

export function getBuiltinSource(id) {
  return BUILTIN_SOURCES.find(s => s.id === id) || null;
}

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
  [/(^|\.)weticket\.io$/i,{name:"WeTicket",trusted:true,sourceTier:"primary-ticketing"}],
  [/(^|\.)eventix\.shop$/i,{name:"Eventix",trusted:true,sourceTier:"primary-ticketing"}],
  [/(^|\.)ticket\.io$/i,{name:"ticket.io",trusted:true,sourceTier:"primary-ticketing"}]
];

export function profileForUrl(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    const hit = DOMAIN_PROFILES.find(([re]) => re.test(host));
    return hit ? hit[1] : { name: host.replace(/^www\./,""), trusted:false, sourceTier:"web-discovered" };
  } catch {
    return { name:"Web discovery", trusted:false, sourceTier:"web-discovered" };
  }
}
