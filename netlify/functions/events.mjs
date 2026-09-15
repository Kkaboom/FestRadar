import { connectLambda } from "@netlify/blobs";
import { getEvents, getScrapeMeta } from "./_lib/db.mjs";
import { VERIFIED_BOOTSTRAP_EVENTS } from "./_lib/bootstrap-events.mjs";
import { dedupeEvents } from "./_lib/normalize.mjs";
import { json } from "./_lib/http.mjs";

export async function handler(event) {
  connectLambda(event);
  if (event.httpMethod !== "GET") return json(405, { error: "GET uniquement" });
  const [stored, meta] = await Promise.all([getEvents(), getScrapeMeta()]);
  const now = Date.now() - 6 * 3600000;
  const bootstrap = VERIFIED_BOOTSTRAP_EVENTS.filter(e => new Date(e.endDate || e.startDate).getTime() >= now);
  const events = dedupeEvents([...(stored || []), ...bootstrap]);
  return json(200, {
    events,
    updatedAt: meta.lastFinishedAt,
    running: meta.running,
    catalogSources: meta.totalCatalogSources || null,
  }, { "cache-control": "public, max-age=60, stale-while-revalidate=300" });
}
