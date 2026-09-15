import { authConfigured, passwordMatches, createSessionCookie } from "./_lib/auth.mjs";
import { json, parseJsonBody } from "./_lib/http.mjs";

export async function handler(event) {
  if (event.httpMethod !== "POST") return json(405, { error: "POST uniquement" });
  if (!authConfigured()) return json(500, { error: "ADMIN_PASSWORD ou SESSION_SECRET non configuré correctement." });
  const body = parseJsonBody(event);
  if (!body) return json(400, { error: "JSON invalide" });
  if (!passwordMatches(body.password)) return json(401, { error: "Mot de passe incorrect" });
  return json(200, { ok: true }, { "set-cookie": createSessionCookie() });
}
