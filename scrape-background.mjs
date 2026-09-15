import { connectLambda } from "@netlify/blobs";
import { validInternalScrapeToken } from "./_lib/auth.mjs";
import { runScrape } from "./_lib/runner.mjs";
import { json } from "./_lib/http.mjs";

export async function handler(event) {
  connectLambda(event);
  if (event.httpMethod !== "POST") return json(405, { error: "POST uniquement" });
  if (!validInternalScrapeToken(event)) return json(401, { error: "Non autorisé" });
  await runScrape({ mode: "manual" });
  return { statusCode: 204, body: "" };
}
