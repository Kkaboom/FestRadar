import { isAdmin, authConfigured } from "./_lib/auth.mjs";
import { json } from "./_lib/http.mjs";

export async function handler(event) {
  if (event.httpMethod !== "GET") return json(405, { error: "GET uniquement" });
  return json(200, { authenticated: isAdmin(event), configured: authConfigured() });
}
