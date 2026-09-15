import { internalScrapeToken } from "./_lib/auth.mjs";

export async function handler(event) {
  const origin = process.env.URL || (() => { try { return new URL(event.rawUrl).origin; } catch { return null; } })();
  if (!origin) return { statusCode: 500, body: "site url unavailable" };
  const response = await fetch(`${origin}/.netlify/functions/scrape-background`, {
    method: "POST",
    headers: { "x-festradar-internal": internalScrapeToken() },
  });
  return { statusCode: response.ok || response.status === 202 ? 200 : 502, body: response.ok || response.status === 202 ? "queued" : `background ${response.status}` };
}
