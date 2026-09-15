import { clearSessionCookie } from "./_lib/auth.mjs";
import { json } from "./_lib/http.mjs";

export async function handler(event) {
  if (event.httpMethod !== "POST") return json(405, { error: "POST uniquement" });
  return json(200, { ok: true }, { "set-cookie": clearSessionCookie() });
}
