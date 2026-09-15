export function json(statusCode, data, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...extraHeaders,
    },
    body: JSON.stringify(data),
  };
}

export function parseJsonBody(event) {
  try {
    return event.body ? JSON.parse(event.body) : {};
  } catch {
    return null;
  }
}

export function methodNotAllowed() {
  return json(405, { error: "Méthode non autorisée" }, { allow: "GET, POST, DELETE" });
}
