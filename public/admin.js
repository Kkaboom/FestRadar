const $ = s => document.querySelector(s);

async function api(path, options = {}) {
  const res = await fetch(`/.netlify/functions/${path}`, {
    credentials: "same-origin",
    headers: { "content-type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  let data = {};
  try { data = await res.json(); } catch {}
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

function showAdmin(authenticated) {
  $("#loginPanel").classList.toggle("hidden", authenticated);
  $("#adminPanel").classList.toggle("hidden", !authenticated);
  $("#logoutBtn").classList.toggle("hidden", !authenticated);
}

function fmt(iso) {
  if (!iso) return "jamais";
  return new Intl.DateTimeFormat("fr-CH", { dateStyle: "short", timeStyle: "short" }).format(new Date(iso));
}

function esc(value = "") {
  return String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
}

async function loadStatus() {
  const data = await api("admin-status");
  $("#aSources").textContent = data.stats.sources;
  $("#aEvents").textContent = data.stats.events;
  $("#aManual").textContent = data.stats.manualEvents;
  $("#aState").textContent = data.scrape.running ? "actif" : "repos";
  $("#lastRun").textContent = data.scrape.running ? "Collecte en cours…" : `Dernière collecte : ${fmt(data.scrape.lastFinishedAt)}`;
  renderSources(data.sources);
}

function renderSources(sources) {
  const host = $("#sourceList");
  if (!sources.length) {
    host.innerHTML = '<div class="muted">Aucune source. Ajoute ton premier site au-dessus.</div>';
    return;
  }
  host.innerHTML = sources.map(s => `
    <div class="source-row">
      <div>
        <h3>${esc(s.name)} ${s.trusted ? '<span class="badge">officielle</span>' : ""}</h3>
        <div class="source-url">${esc(s.url)}</div>
        <div class="source-meta">
          <span>type: ${esc(s.kind)}</span>
          <span>dernier passage: ${esc(fmt(s.lastRun))}</span>
          <span>trouvés: ${Number(s.lastCount || 0)}</span>
          <span class="${s.lastStatus === "error" ? "status-error" : s.lastStatus === "ok" ? "status-ok" : ""}">${esc(s.lastStatus || "never")}</span>
          ${s.lastError ? `<span class="status-error">${esc(s.lastError)}</span>` : ""}
        </div>
      </div>
      <div class="source-actions"><button class="danger-button" data-delete-source="${esc(s.id)}">Supprimer</button></div>
    </div>`).join("");

  host.querySelectorAll("[data-delete-source]").forEach(btn => btn.addEventListener("click", async () => {
    if (!confirm("Supprimer cette source ?")) return;
    try {
      await api("sources", { method: "DELETE", body: JSON.stringify({ id: btn.dataset.deleteSource }) });
      await loadStatus();
    } catch (e) { alert(e.message); }
  }));
}

$("#loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  $("#loginError").textContent = "";
  const fd = new FormData(e.currentTarget);
  try {
    await api("auth-login", { method: "POST", body: JSON.stringify({ password: fd.get("password") }) });
    showAdmin(true);
    e.currentTarget.reset();
    await loadStatus();
  } catch (err) { $("#loginError").textContent = err.message; }
});

$("#logoutBtn").addEventListener("click", async () => {
  try { await api("auth-logout", { method: "POST", body: "{}" }); } catch {}
  showAdmin(false);
});

$("#sourceForm").addEventListener("submit", async e => {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const body = Object.fromEntries(fd.entries());
  body.trusted = fd.get("trusted") === "on";
  try {
    await api("sources", { method: "POST", body: JSON.stringify(body) });
    $("#sourceMsg").textContent = "Source ajoutée.";
    e.currentTarget.reset();
    await loadStatus();
  } catch (err) { $("#sourceMsg").textContent = err.message; }
});

$("#eventForm").addEventListener("submit", async e => {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const body = Object.fromEntries(fd.entries());
  try {
    await api("manual-events", { method: "POST", body: JSON.stringify(body) });
    $("#eventMsg").textContent = "Événement ajouté.";
    e.currentTarget.reset();
    await loadStatus();
  } catch (err) { $("#eventMsg").textContent = err.message; }
});

$("#refreshBtn").addEventListener("click", async () => {
  const btn = $("#refreshBtn");
  btn.disabled = true;
  btn.textContent = "Collecte lancée…";
  try {
    const res = await fetch("/.netlify/functions/scrape-trigger", { method: "POST", credentials: "same-origin" });
    if (!res.ok && res.status !== 202) throw new Error(`HTTP ${res.status}`);
    setTimeout(loadStatus, 1800);
  } catch (e) { alert(`Impossible de lancer : ${e.message}`); }
  finally { setTimeout(() => { btn.disabled = false; btn.textContent = "↻ Rechercher maintenant"; }, 2500); }
});

(async function init() {
  try {
    const me = await api("auth-me");
    showAdmin(me.authenticated);
    if (!me.configured) $("#loginError").textContent = "Configure ADMIN_PASSWORD et SESSION_SECRET dans Netlify avant de te connecter.";
    if (me.authenticated) await loadStatus();
  } catch {
    showAdmin(false);
    $("#loginError").textContent = "API non disponible ici. Déploie le projet sur Netlify.";
  }
})();
