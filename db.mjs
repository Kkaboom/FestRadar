import { getStore } from "@netlify/blobs";

const STORE_NAME = "festradar";
const store = () => getStore(STORE_NAME);

export async function getJSON(key, fallback) {
  const value = await store().get(key, { type: "json", consistency: "strong" });
  return value ?? fallback;
}

export async function setJSON(key, value) {
  await store().setJSON(key, value);
  return value;
}

export async function getSources() {
  return getJSON("config/sources", []);
}

export async function setSources(sources) {
  return setJSON("config/sources", sources);
}

export async function getEvents() {
  return getJSON("data/events", []);
}

export async function setEvents(events) {
  return setJSON("data/events", events);
}

export async function getScrapeMeta() {
  return getJSON("meta/scrape", {
    running: false,
    lastStartedAt: null,
    lastFinishedAt: null,
    lastError: null,
    processed: 0,
    found: 0,
    cursor: 0,
  });
}

export async function setScrapeMeta(meta) {
  return setJSON("meta/scrape", meta);
}
