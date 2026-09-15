import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";

const COOKIE_NAME = "festradar_session";
const MAX_AGE = 60 * 60 * 12;

function secret() {
  return process.env.SESSION_SECRET || "";
}

function adminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

function b64url(input) {
  return Buffer.from(input).toString("base64url");
}

function sign(payload) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function authConfigured() {
  return secret().length >= 32 && adminPassword().length >= 8;
}

export function passwordMatches(candidate = "") {
  const a = Buffer.from(String(candidate));
  const b = Buffer.from(adminPassword());
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function createSessionCookie() {
  const payload = b64url(JSON.stringify({
    exp: Math.floor(Date.now() / 1000) + MAX_AGE,
    nonce: randomBytes(8).toString("hex"),
  }));
  const token = `${payload}.${sign(payload)}`;
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

function readCookie(event) {
  const raw = event.headers?.cookie || event.headers?.Cookie || "";
  const part = raw.split(";").map(v => v.trim()).find(v => v.startsWith(`${COOKIE_NAME}=`));
  return part ? decodeURIComponent(part.slice(COOKIE_NAME.length + 1)) : null;
}

export function isAdmin(event) {
  if (!authConfigured()) return false;
  const token = readCookie(event);
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return Number(data.exp) > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function internalScrapeToken() {
  if (!secret()) return "";
  return createHmac("sha256", secret()).update("festradar:scrape-background:v1").digest("hex");
}

export function validInternalScrapeToken(event) {
  const provided = event.headers?.["x-festradar-internal"] || event.headers?.["X-Festradar-Internal"] || "";
  const expected = internalScrapeToken();
  if (!provided || !expected) return false;
  const a = Buffer.from(String(provided));
  const b = Buffer.from(String(expected));
  return a.length === b.length && timingSafeEqual(a, b);
}
