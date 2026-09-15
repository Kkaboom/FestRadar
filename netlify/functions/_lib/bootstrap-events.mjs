import { hashId } from "./normalize.mjs";

function e({ title,startDate,endDate,venue,city,country="Switzerland",format="Club night",genres=[],eventUrl,sourceName,description="",tentative=false }) {
  return {
    id: hashId(title.toLowerCase(), startDate.slice(0,10), city.toLowerCase(), country.toLowerCase()),
    title,startDate,endDate:endDate||null,venue,city,region:"",country,category:format,format,genres,
    description,imageUrl:"",eventUrl,sourceUrl:eventUrl,sourceId:`bootstrap-${sourceName.toLowerCase().replace(/\W+/g,"-")}`,
    sourceName,confidence: tentative ? 82 : 99,manual:false,verified:!tentative,
    verificationLevel: tentative ? "official-tentative" : "verified-source",
    evidenceUrls:[eventUrl],discoveredAt:"2026-09-15T01:30:00.000Z",updatedAt:new Date().toISOString(),sourceCount:1
  };
}

export const VERIFIED_BOOTSTRAP_EVENTS = [
  e({ title:"Bella Veranda - EUPHONIC", startDate:"2026-09-18T17:00:00+02:00", endDate:"2026-09-18T22:00:00+02:00", venue:"Bella Veranda", city:"Zürich", genres:["Techno","House"], eventUrl:"https://ra.co/events/2526250", sourceName:"Resident Advisor" }),
  e({ title:"OSEZ ZOÉ: Paloma Colombe · NOXATRA · Braises de Velours", startDate:"2026-09-18T23:59:00+02:00", endDate:"2026-09-19T06:00:00+02:00", venue:"Zoo", city:"Geneva", genres:["Techno","Electronic"], eventUrl:"https://fr.ra.co/events/2528259", sourceName:"Resident Advisor" }),
  e({ title:"Free Form Project", startDate:"2026-09-19T23:00:00+02:00", endDate:"2026-09-20T04:00:00+02:00", venue:"Nest", city:"Basel", genres:["Techno"], eventUrl:"https://ra.co/events/2517553", sourceName:"Resident Advisor" }),
  e({ title:"RAVESTASY", startDate:"2026-09-19T23:00:00+02:00", endDate:"2026-09-20T05:00:00+02:00", venue:"CLUB04", city:"Zürich", format:"Rave / Warehouse", genres:["Hard Techno","Techno"], eventUrl:"https://eventfrog.ch/de/p/partys/house-techno/ravestasy-7500098895713725264.html", sourceName:"Eventfrog" }),
  e({ title:"LIMA", startDate:"2026-09-19T23:00:00+02:00", endDate:"2026-09-20T04:00:00+02:00", venue:"Club Bellevue", city:"Zürich", genres:["House","Techno"], eventUrl:"https://eventfrog.ch/de/p/partys/house-techno/lima-7500200798539761751.html", sourceName:"Eventfrog" }),
  e({ title:"REDZONE", startDate:"2026-09-25T23:00:00+02:00", endDate:"2026-09-26T05:00:00+02:00", venue:"CLUB04", city:"Zürich", format:"Rave / Warehouse", genres:["Hard Techno","Techno"], eventUrl:"https://eventfrog.ch/de/p/partys/house-techno/redzone-7495400335835457024.html", sourceName:"Eventfrog" }),
  e({ title:"FAENIX with TANJA MIJU & Bae Blade", startDate:"2026-09-25T23:00:00+02:00", endDate:"2026-09-26T06:00:00+02:00", venue:"MÄX", city:"Zürich", genres:["Trance","Techno"], eventUrl:"https://fr.ra.co/events/2534156", sourceName:"Resident Advisor" }),
  e({ title:"LESS DRAMA MORE TECHNO invite Jody 6 & Auriga", startDate:"2026-09-25T23:59:00+02:00", endDate:"2026-09-26T06:00:00+02:00", venue:"TBA - INDUSTRIE CAR WASH", city:"Geneva", format:"Rave / Warehouse", genres:["Techno","Psytrance"], eventUrl:"https://fr.ra.co/events/2521265", sourceName:"Resident Advisor" }),
  e({ title:"RAVE CIRCLE - HARDTECHNO // INDUSTRIAL // BOUNCE", startDate:"2026-09-26T23:00:00+02:00", endDate:"2026-09-27T05:00:00+02:00", venue:"Nordportal", city:"Baden", format:"Rave / Warehouse", genres:["Hard Techno","Industrial / Acid","Techno"], eventUrl:"https://eventfrog.ch/fr/p/soirees-fetes/house-techno/rave-circle-hardtechno-industrial-bounce-7487873409990274040.html", sourceName:"Eventfrog" }),
  e({ title:"NEED FOR SPEED", startDate:"2026-09-26T16:00:00+02:00", endDate:"2026-09-26T23:59:00+02:00", venue:"Stellwerk", city:"Bern", format:"Rave / Warehouse", genres:["Hardcore","Electronic"], eventUrl:"https://eventfrog.ch/fr/p/soirees-fetes/hardstyle/need-for-speed-7430983313404222891.html", sourceName:"Eventfrog" }),
  e({ title:"Synesthesia", startDate:"2026-09-26T14:00:00+02:00", endDate:"2026-09-27T02:00:00+02:00", venue:"Gap'z", city:"Zürich", format:"Festival", genres:["Electronic","Techno"], eventUrl:"https://eventfrog.ch/de/p/partys/electro/synesthesia-7500126745858702521.html", sourceName:"Eventfrog" }),
  e({ title:"Technoabteil w/ A.N.I., Dasstudach, Igda & more", startDate:"2026-10-02T23:00:00+02:00", venue:"MÄX", city:"Zürich", genres:["Techno","Industrial / Acid"], eventUrl:"https://www.ticketcorner.ch/en/event/maex-technoabteil-w-a-n-i-dasstudach-igda-more-maex-22111441/", sourceName:"Ticketcorner" }),
  e({ title:"Techno to Trance w/ Alt8 & Kichta", startDate:"2026-10-24T23:00:00+02:00", venue:"MÄX", city:"Zürich", genres:["Techno","Trance"], eventUrl:"https://www.ticketcorner.ch/event/techno-to-trance-w-alt8-kichta-maex-22047364/", sourceName:"Ticketcorner" }),
  e({ title:"Street Parade 2027", startDate:"2027-08-14T13:00:00+02:00", endDate:"2027-08-15T00:00:00+02:00", venue:"Zürich lake basin", city:"Zürich", format:"Open air / Parade", genres:["Techno","House","Trance","Drum & Bass","Electronic"], eventUrl:"https://www.streetparade.com/en/infos", sourceName:"Street Parade · Official" })
];
