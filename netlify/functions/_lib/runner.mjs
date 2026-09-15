import { getSources,setSources,getEvents,setEvents,getScrapeMeta,setScrapeMeta } from "./db.mjs";
import { scrapeSource } from "./scrape.mjs";
import { dedupeEvents } from "./normalize.mjs";
import { collectBuiltInEvents } from "./discovery.mjs";
import { BUILTIN_SOURCES } from "./source-catalog.mjs";
import { VERIFIED_BOOTSTRAP_EVENTS } from "./bootstrap-events.mjs";

function prunePast(events){const cutoff=Date.now()-1000*60*60*24*45;return events.filter(e=>e.manual||new Date(e.endDate||e.startDate).getTime()>=cutoff)}
async function pool(items,limit,worker){const results=[];let index=0;async function run(){while(index<items.length){const current=index++;results[current]=await worker(items[current])}}await Promise.all(Array.from({length:Math.min(limit,items.length||1)},run));return results}
function uniqueSources(items){const map=new Map();for(const s of items){if(s?.id&&!map.has(s.id))map.set(s.id,s)}return [...map.values()]}

export async function runScrape({mode="scheduled",batchSize=12}={}){
  const started=new Date().toISOString(),oldMeta=await getScrapeMeta();
  await setScrapeMeta({...oldMeta,running:true,lastStartedAt:started,lastError:null,processed:0,found:0,mode});
  try{
    const userSources=await getSources();
    const builtins=BUILTIN_SOURCES.map(s=>({...s,builtIn:true,enabled:true}));
    const users=userSources.filter(s=>s.enabled!==false).map(s=>({...s,builtIn:false}));
    const hot=builtins.filter(s=>s.alwaysScan).slice(0,14);
    const rotating=uniqueSources([...builtins.filter(s=>!s.alwaysScan),...users]);
    let nextCursor=Number(oldMeta.catalogCursor||0), rotation=[];
    if(rotating.length){
      const size=mode==="manual"?Math.min(34,rotating.length):Math.min(batchSize,rotating.length);
      rotation=Array.from({length:size},(_,i)=>rotating[(nextCursor+i)%rotating.length]);
      nextCursor=(nextCursor+size)%rotating.length;
    }
    // Switzerland's high-value sources are scanned every run; the rest rotates.
    const selected=uniqueSources([...hot,...rotation]);

    const [results,apiBuiltins]=await Promise.all([
      pool(selected,5,async source=>{try{const{events,parser}=await scrapeSource(source);return{source,events,parser,ok:true}}catch(error){return{source,events:[],parser:null,ok:false,error:error?.message||String(error)}}}),
      collectBuiltInEvents().catch(()=>({events:[],stats:{}}))
    ]);

    const byId=new Map(userSources.map(s=>[s.id,s]));
    let discovered=[...VERIFIED_BOOTSTRAP_EVENTS,...(apiBuiltins.events||[])];
    const sourceStats={};
    for(const result of results){
      sourceStats[result.source.id]={name:result.source.name,ok:result.ok,count:result.events.length,parser:result.parser,error:result.error||null,builtIn:Boolean(result.source.builtIn),alwaysScan:Boolean(result.source.alwaysScan)};
      if(!result.source.builtIn){
        const previous=byId.get(result.source.id)||result.source;
        byId.set(result.source.id,{...previous,lastRun:new Date().toISOString(),lastStatus:result.ok?"ok":"error",lastCount:result.events.length,lastParser:result.parser,lastError:result.ok?null:result.error});
      }
      if(result.ok)discovered.push(...result.events);
    }
    await setSources([...byId.values()]);
    const existing=prunePast(await getEvents());
    const merged=dedupeEvents([...existing,...discovered]);
    await setEvents(merged);

    const done={running:false,lastStartedAt:started,lastFinishedAt:new Date().toISOString(),lastError:null,processed:results.length,found:discovered.length,builtins:apiBuiltins.stats||{},sourceStats,catalogCursor:nextCursor,mode,totalCatalogSources:BUILTIN_SOURCES.length,hotSources:hot.length,userSources:userSources.length,totalEvents:merged.length};
    await setScrapeMeta(done);return done;
  }catch(error){
    const failed={...oldMeta,running:false,lastStartedAt:started,lastFinishedAt:new Date().toISOString(),lastError:error?.message||String(error),mode};await setScrapeMeta(failed);throw error;
  }
}
