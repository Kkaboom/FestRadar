import { isAdmin, internalScrapeToken } from "./_lib/auth.mjs";
import { json } from "./_lib/http.mjs";

export async function handler(event) {
  if (event.httpMethod !== "POST") return json(405, { error: "POST uniquement" });
  if (!isAdmin(event)) return json(401, { error: "Non autorisé" });

  const origin = process.env.URL || (() => {
    try { return new URL(event.rawUrl).origin; } catch { return null; }
  })();
  if (!origin) return json(500, { error: "URL du site introuvable" });

  const response = await fetch(`${origin}/.netlify/functions/scrape-background`, {
    method: "POST",
    headers: { "x-festradar-internal": internalScrapeToken() },
  });
  if (!response.ok && response.status !== 202) {
    return json(502, { error: `Impossible de lancer la tâche (${response.status})` });
  }
  return json(202, { ok: true, message: "Collecte lancée" });
}
