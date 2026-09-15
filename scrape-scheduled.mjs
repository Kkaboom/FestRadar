import { connectLambda } from "@netlify/blobs";
import { runScrape } from "./_lib/runner.mjs";

export async function handler(event) {
  connectLambda(event);
  await runScrape({ mode: "scheduled", batchSize: 8 });
  return { statusCode: 200, body: "ok" };
}
