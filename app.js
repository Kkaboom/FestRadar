const $ = s => document.querySelector(s);
const state = { events: [], filtered: [] };

function esc(value = "") {
  return String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
}

function formatDate(iso) {
  if (!iso) return { day: "?", mon: "?", full: "Date inconnue" };
  const d = new Date(iso);
  return {
    day: new Intl.DateTimeFormat("fr-CH", { day: "2-digit" }).format(d),
    mon: new Intl.DateTimeFormat("fr-CH", { month: "short" }).format(d).replace(".", "").toUpperCase(),
    full: new Intl.DateTimeFormat("fr-CH", { dateStyle: "full", timeStyle: "short" }).format(d),
  };
}

function cleanUrl(url) {
  try { const u = new URL(url); return ["http:", "https:"].includes(u.protocol) ? u.href : ""; } catch { return ""; }
}

function render() {
  const grid = $("#eventGrid");
  const empty = $("#empty");
  $("#resultCount").textContent = state.filtered.length;
  grid.innerHTML = "";
  empty.classList.toggle("hidden", state.filtered.length > 0);

  for (const e of state.filtered) {
    const date = formatDate(e.startDate);
    const imageUrl = cleanUrl(e.imageUrl);
    const eventUrl = cleanUrl(e.eventUrl || e.sourceUrl);
    const location = [e.venue, e.city, e.country].filter(Boolean).join(" · ") || "Lieu à confirmer";
    const card = document.createElement("article");
    card.className = "event-card";
    card.innerHTML = `
      <div class="event-image ${imageUrl ? "" : "no-image"}">
        ${imageUrl ? `<img src="${esc(imageUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer" />` : ""}
        <div class="event-shade"></div>
        <div class="event-date"><span>${esc(date.day)}</span><span>${esc(date.mon)}</span></div>
      </div>
      <div class="event-body">
        <div class="badges">
          <span class="badge">${esc(e.category || "Événement")}</span>
          <span class="badge confidence">${Number(e.confidence || 0)}% confiance</span>
          ${e.manual ? '<span class="badge">manuel</span>' : ""}
        </div>
        <h2>${esc(e.title)}</h2>
        <div class="location">${esc(location)}</div>
        <div class="description">${esc(e.description || date.full)}</div>
      </div>
      <div class="card-footer">
        <span>${esc(e.sourceName || "Source")}</span>
        ${eventUrl ? `<a href="${esc(eventUrl)}" target="_blank" rel="noopener noreferrer">Source ↗</a>` : ""}
      </div>`;
    grid.appendChild(card);
  }
}

function applyFilters() {
  const q = $("#search").value.trim().toLowerCase();
  const country = $("#country").value;
  const category = $("#category").value;
  const period = $("#period").value;
  const now = Date.now();
  const limit = period === "all" ? Infinity : now + Number(period) * 86400000;

  state.filtered = state.events.filter(e => {
    const hay = [e.title, e.city, e.country, e.category, e.venue, e.description].filter(Boolean).join(" ").toLowerCase();
    const t = new Date(e.startDate).getTime();
    return (!q || hay.includes(q)) && (!country || e.country === country) && (!category || e.category === category) && t >= now - 86400000 && t <= limit;
  }).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  render();
}

function fillSelect(selector, values) {
  const el = $(selector);
  for (const value of [...new Set(values.filter(Boolean))].sort((a,b) => a.localeCompare(b, "fr"))) {
    const opt = document.createElement("option");
    opt.value = value; opt.textContent = value; el.appendChild(opt);
  }
}

async function load() {
  try {
    const res = await fetch("/.netlify/functions/events");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    state.events = data.events || [];
    fillSelect("#country", state.events.map(e => e.country));
    fillSelect("#category", state.events.map(e => e.category));
    $("#statEvents").textContent = state.events.length;
    $("#statCountries").textContent = new Set(state.events.map(e => e.country).filter(Boolean)).size;
    const now = Date.now(), soon = now + 30 * 86400000;
    $("#statSoon").textContent = state.events.filter(e => { const t = new Date(e.startDate).getTime(); return t >= now && t <= soon; }).length;
    $("#updatedAt").textContent = data.updatedAt ? `Mis à jour ${new Intl.DateTimeFormat("fr-CH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(data.updatedAt))}` : "Pas encore actualisé";
    applyFilters();
  } catch (error) {
    $("#updatedAt").textContent = "API indisponible — déploie le projet sur Netlify pour activer le collecteur.";
    $("#empty").classList.remove("hidden");
  }
}

["#search", "#country", "#category", "#period"].forEach(s => $(s).addEventListener("input", applyFilters));
load();
