import { connectLambda } from "@netlify/blobs";
import { randomUUID } from "node:crypto";
import { isAdmin } from "./_lib/auth.mjs";
import { getSources, setSources } from "./_lib/db.mjs";
import { json, parseJsonBody } from "./_lib/http.mjs";
import { cleanText } from "./_lib/normalize.mjs";

function validHttpUrl(value) {
  try {
    const u = new URL(value);
    return ["http:", "https:"].includes(u.protocol);
  } catch { return false; }
}

export async function handler(event) {
  connectLambda(event);
  if (!isAdmin(event)) return json(401, { error: "Non autorisé" });

  if (event.httpMethod === "GET") {
    return json(200, { sources: await getSources() });
  }

  const body = parseJsonBody(event);
  if (!body) return json(400, { error: "JSON invalide" });

  if (event.httpMethod === "POST") {
    if (!validHttpUrl(body.url)) return json(400, { error: "URL HTTP(S) invalide" });
    const sources = await getSources();
    const normalizedUrl = new URL(body.url).href;
    if (sources.some(s => s.url === normalizedUrl)) return json(409, { error: "Cette source existe déjà" });
    const source = {
      id: randomUUID(),
      name: cleanText(body.name || new URL(normalizedUrl).hostname, 120),
      url: normalizedUrl,
      kind: ["auto", "jsonld", "ics", "rss"].includes(body.kind) ? body.kind : "auto",
      country: cleanText(body.country, 100),
      tags: cleanText(body.tags, 200),
      trusted: Boolean(body.trusted),
      enabled: true,
      createdAt: new Date().toISOString(),
      lastRun: null,
      lastStatus: "never",
      lastCount: 0,
      lastError: null,
    };
    sources.push(source);
    await setSources(sources);
    return json(201, { source });
  }

  if (event.httpMethod === "DELETE") {
    const sources = await getSources();
    const next = sources.filter(s => s.id !== body.id);
    if (next.length === sources.length) return json(404, { error: "Source introuvable" });
    await setSources(next);
    return json(200, { ok: true });
  }

  return json(405, { error: "Méthode non autorisée" });
}
