import { connectLambda } from "@netlify/blobs";
import { getEvents, getScrapeMeta } from "./_lib/db.mjs";
import { json } from "./_lib/http.mjs";

export async function handler(event) {
  connectLambda(event);
  if (event.httpMethod !== "GET") return json(405, { error: "GET uniquement" });
  const [events, meta] = await Promise.all([getEvents(), getScrapeMeta()]);
  return json(200, {
    events,
    updatedAt: meta.lastFinishedAt,
    running: meta.running,
  }, { "cache-control": "public, max-age=60, stale-while-revalidate=300" });
}
