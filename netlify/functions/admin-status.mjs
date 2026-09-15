import { connectLambda } from "@netlify/blobs";
import { isAdmin } from "./_lib/auth.mjs";
import { getSources, getEvents, getScrapeMeta } from "./_lib/db.mjs";
import { BUILTIN_SOURCES } from "./_lib/source-catalog.mjs";
import { json } from "./_lib/http.mjs";

export async function handler(event) {
  connectLambda(event);
  if (!isAdmin(event)) return json(401, { error: "Non autorisé" });
  if (event.httpMethod !== "GET") return json(405, { error: "GET uniquement" });
  const [sources, events, scrape] = await Promise.all([getSources(), getEvents(), getScrapeMeta()]);
  return json(200, {
    sources,
    scrape,
    stats: {
      sources: sources.length,
      enabledSources: sources.filter(s => s.enabled !== false).length,
      builtInSources: BUILTIN_SOURCES.length,
      events: events.length,
      verifiedEvents: events.filter(e => e.verified).length,
      manualEvents: events.filter(e => e.manual).length,
    },
  });
}
