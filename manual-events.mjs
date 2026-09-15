import { connectLambda } from "@netlify/blobs";
import { isAdmin } from "./_lib/auth.mjs";
import { getEvents, setEvents } from "./_lib/db.mjs";
import { json, parseJsonBody } from "./_lib/http.mjs";
import { normalizeManualEvent, dedupeEvents } from "./_lib/normalize.mjs";

export async function handler(event) {
  connectLambda(event);
  if (!isAdmin(event)) return json(401, { error: "Non autorisé" });
  const body = parseJsonBody(event);
  if (!body) return json(400, { error: "JSON invalide" });

  if (event.httpMethod === "POST") {
    const normalized = normalizeManualEvent(body);
    if (!normalized) return json(400, { error: "Titre et date de début valides requis" });
    const events = dedupeEvents([...(await getEvents()), normalized]);
    await setEvents(events);
    return json(201, { event: normalized });
  }

  if (event.httpMethod === "DELETE") {
    const events = await getEvents();
    const existing = events.find(e => e.id === body.id);
    if (!existing) return json(404, { error: "Événement introuvable" });
    if (!existing.manual) return json(400, { error: "La suppression directe est réservée aux événements manuels" });
    await setEvents(events.filter(e => e.id !== body.id));
    return json(200, { ok: true });
  }

  return json(405, { error: "Méthode non autorisée" });
}
