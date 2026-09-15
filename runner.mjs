import { getSources, setSources, getEvents, setEvents, getScrapeMeta, setScrapeMeta } from "./db.mjs";
import { scrapeSource } from "./scrape.mjs";
import { dedupeEvents } from "./normalize.mjs";

function prunePast(events) {
  const cutoff = Date.now() - 1000 * 60 * 60 * 24 * 45;
  return events.filter(e => e.manual || new Date(e.endDate || e.startDate).getTime() >= cutoff);
}

async function pool(items, limit, worker) {
  const results = [];
  let index = 0;
  async function run() {
    while (index < items.length) {
      const current = index++;
      results[current] = await worker(items[current]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length || 1) }, run));
  return results;
}

export async function runScrape({ mode = "scheduled", batchSize = 8 } = {}) {
  const started = new Date().toISOString();
  const oldMeta = await getScrapeMeta();
  await setScrapeMeta({ ...oldMeta, running: true, lastStartedAt: started, lastError: null, processed: 0, found: 0, mode });

  try {
    const sources = await getSources();
    const enabled = sources.filter(s => s.enabled !== false);
    if (!enabled.length) {
      const done = { ...oldMeta, running: false, lastStartedAt: started, lastFinishedAt: new Date().toISOString(), processed: 0, found: 0, lastError: null };
      await setScrapeMeta(done);
      return done;
    }

    let selected = enabled;
    let nextCursor = oldMeta.cursor || 0;
    if (mode === "scheduled") {
      const size = Math.min(batchSize, enabled.length);
      selected = Array.from({ length: size }, (_, i) => enabled[(nextCursor + i) % enabled.length]);
      nextCursor = (nextCursor + size) % enabled.length;
    }

    const results = await pool(selected, 4, async source => {
      try {
        const { events, parser } = await scrapeSource(source);
        return { source, events, parser, ok: true };
      } catch (error) {
        return { source, events: [], parser: null, ok: false, error: error?.message || String(error) };
      }
    });

    const byId = new Map(sources.map(s => [s.id, s]));
    let discovered = [];
    for (const result of results) {
      const previous = byId.get(result.source.id) || result.source;
      byId.set(result.source.id, {
        ...previous,
        lastRun: new Date().toISOString(),
        lastStatus: result.ok ? "ok" : "error",
        lastCount: result.events.length,
        lastParser: result.parser,
        lastError: result.ok ? null : result.error,
      });
      if (result.ok) discovered.push(...result.events);
    }
    await setSources([...byId.values()]);

    const existing = prunePast(await getEvents());
    const merged = dedupeEvents([...existing, ...discovered]);
    await setEvents(merged);

    const done = {
      running: false,
      lastStartedAt: started,
      lastFinishedAt: new Date().toISOString(),
      lastError: null,
      processed: results.length,
      found: discovered.length,
      cursor: nextCursor,
      mode,
    };
    await setScrapeMeta(done);
    return done;
  } catch (error) {
    const failed = {
      ...oldMeta,
      running: false,
      lastStartedAt: started,
      lastFinishedAt: new Date().toISOString(),
      lastError: error?.message || String(error),
      mode,
    };
    await setScrapeMeta(failed);
    throw error;
  }
}
