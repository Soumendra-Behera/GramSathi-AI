"use strict";
/* GramSathi AI by SouEra - vanilla JS. No secret keys belong in this file. */

const CONFIG = {
  BACKEND_URL: "",   // Future secure backend endpoint, e.g. "https://your-backend.example.com/chat". Empty = DEMO MODE.
  MAX_LEN: 500,
  TIMEOUT_MS: 15000
};

const I18N = {
  en: { n_ask: "Assistant", n_sch: "Schemes", n_farm: "Farming", n_learn: "Learn", n_health: "Health", n_help: "Help", tag: "Smart Support for Every Village", cta: "Ask a question", send: "Send", ph: "Type your question" },
  hi: { n_ask: "सहायक", n_sch: "योजनाएँ", n_farm: "खेती", n_learn: "सीखें", n_health: "स्वास्थ्य", n_help: "सहायता", tag: "हर गाँव के लिए स्मार्ट सहयोग", cta: "सवाल पूछें", send: "भेजें", ph: "अपना सवाल लिखें" },
  or: { n_ask: "ସହାୟକ", n_sch: "ଯୋଜନା", n_farm: "କୃଷି", n_learn: "ଶିକ୍ଷା", n_health: "ସ୍ୱାସ୍ଥ୍ୟ", n_help: "ସହାୟତା", tag: "ପ୍ରତ୍ୟେକ ଗାଁ ପାଇଁ ସ୍ମାର୍ଟ ସହାୟତା", cta: "ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ", send: "ପଠାନ୍ତୁ", ph: "ଆପଣଙ୍କ ପ୍ରଶ୍ନ ଲେଖନ୍ତୁ" }
};

/* Official portals only. Descriptions are general; no eligibility or benefit rules are stated. */
const DATA = {
  schemes: [
    { t: "myScheme", d: "Government service to search and discover schemes.", u: "https://www.myscheme.gov.in" },
    { t: "PM-KISAN", d: "Official portal for the farmer income-support scheme.", u: "https://pmkisan.gov.in" },
    { t: "Ayushman Bharat PM-JAY", d: "Official portal for the public health coverage scheme.", u: "https://pmjay.gov.in" },
    { t: "Ministry of Tribal Affairs", d: "Official information on programmes for tribal communities.", u: "https://tribal.gov.in" },
    { t: "India.gov.in", d: "National portal for government services and information.", u: "https://www.india.gov.in" }
  ],
  farming: [
    { t: "Soil Health Card", d: "Official portal for soil health information.", u: "https://soilhealth.dac.gov.in" },
    { t: "eNAM", d: "National online market platform for farm produce.", u: "https://enam.gov.in" },
    { t: "PM Fasal Bima Yojana", d: "Official crop insurance portal.", u: "https://pmfby.gov.in" },
    { t: "IMD weather", d: "India Meteorological Department forecasts and warnings.", u: "https://mausam.imd.gov.in" },
    { t: "Ministry of Agriculture", d: "Official ministry website for farmer welfare.", u: "https://agriwelfare.gov.in" }
  ],
  learn: [
    { t: "DIKSHA", d: "Government platform for school learning material.", u: "https://diksha.gov.in" },
    { t: "SWAYAM", d: "Free online courses from the Government of India.", u: "https://swayam.gov.in" },
    { t: "PMGDISHA", d: "Official digital literacy programme for rural India.", u: "https://www.pmgdisha.in" },
    { t: "DigiLocker", d: "Official service to keep documents in digital form.", u: "https://www.digilocker.gov.in" },
    { t: "National Scholarship Portal", d: "Official portal for scholarship applications.", u: "https://scholarships.gov.in" }
  ],
  health: [
    { t: "e-Sanjeevani", d: "Official government teleconsultation service.", u: "https://esanjeevani.mohfw.gov.in" },
    { t: "Ayushman Bharat Digital Mission", d: "Official portal for digital health records and services.", u: "https://abdm.gov.in" },
    { t: "Ministry of Health and Family Welfare", d: "Official health information and public notices.", u: "https://mohfw.gov.in" }
  ]
};

const NAMES = { schemes: "government schemes", farming: "farming", learn: "learning and digital skills", health: "health services" };
const TOPICS = [
  { sec: "schemes", k: ["scheme", "yojana", "subsidy", "योजना", "ଯୋଜନା"] },
  { sec: "farming", k: ["farm", "crop", "kisan", "soil", "खेती", "किसान", "କୃଷି", "ଚାଷ"] },
  { sec: "learn", k: ["learn", "school", "study", "digital", "scholarship", "शिक्षा", "ଶିକ୍ଷା"] },
  { sec: "health", k: ["health", "doctor", "hospital", "medicine", "स्वास्थ्य", "ସ୍ୱାସ୍ଥ୍ୟ"] },
  { sec: "help", k: ["emergency", "police", "ambulance", "fire", "आपात", "ଜରୁରୀ"] }
];
const SUGGESTIONS = ["Which government schemes should I know about?", "Where can I find farming information?", "How can I learn digital skills?", "Where can I find health services?"];

const $ = s => document.querySelector(s);
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;   // textContent keeps all user text safe
  return e;
}
function say(node, msg, isErr) { node.textContent = msg; node.classList.toggle("err", !!isErr); }
function extLink(cls, text, url) {
  const a = el("a", cls);
  a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer";
  return { a, text };
}

/* ---------- Resource cards ---------- */
document.querySelectorAll("[data-list]").forEach(box => {
  const items = DATA[box.dataset.list] || [];
  if (!items.length) { box.append(el("p", "empty", "No resources are available here yet.")); return; }
  items.forEach(i => {
    const x = extLink("card", "", i.u);
    x.a.append(el("h3", "", i.t), el("p", "", i.d), el("span", "tag", "Official link ↗"));
    box.append(x.a);
  });
});

/* ---------- Navigation ---------- */
const menu = $("#menuBtn"), nav = $("#nav");
function closeMenu() { nav.classList.remove("open"); menu.setAttribute("aria-expanded", "false"); }
menu.addEventListener("click", () => menu.setAttribute("aria-expanded", String(nav.classList.toggle("open"))));
nav.addEventListener("click", e => { if (e.target.tagName === "A") closeMenu(); });

/* ---------- Language ---------- */
let lang = "en";
function setLang(l) {
  if (!I18N[l]) l = "en";
  lang = l;
  document.documentElement.lang = l;
  document.querySelectorAll("[data-i18n]").forEach(n => { n.textContent = I18N[l][n.dataset.i18n] || n.textContent; });
  document.querySelectorAll("[data-i18n-ph]").forEach(n => { n.placeholder = I18N[l][n.dataset.i18nPh] || n.placeholder; });
  $("#lang").value = l;
  $("#langnote").hidden = (l === "en");
  try { localStorage.setItem("gs_lang", l); } catch (e) { /* storage may be blocked */ }
}
$("#lang").addEventListener("change", e => setLang(e.target.value));
let saved = "en";
try { saved = localStorage.getItem("gs_lang") || "en"; } catch (e) { /* ignore */ }
setLang(saved);

/* ---------- Chat ---------- */
const log = $("#log"), input = $("#msg"), statusEl = $("#status"), sendBtn = $("#send");
const setStatus = (m, err) => say(statusEl, m, err);
let busy = false;

if (CONFIG.BACKEND_URL) $("#demo").hidden = true;

function addMsg(role, text, links) {
  const empty = $("#empty");
  if (empty) empty.remove();
  const b = el("div", "msg " + role);
  b.append(el("p", "", text));
  (links || []).forEach(l => {
    const x = extLink("", "", l.u);
    x.a.textContent = l.t + " ↗";
    b.append(x.a);
  });
  log.append(b);
  log.scrollTop = log.scrollHeight;
  return b;
}

function demoReply(text) {
  const t = text.toLowerCase();
  const m = TOPICS.find(x => x.k.some(k => t.includes(k)));
  if (!m) return { text: "DEMO MODE: I could not match your question to a topic. Try words like schemes, farming, learn, health or emergency, or browse the sections on this page." };
  if (m.sec === "help") return { text: "DEMO MODE: See the Help section for national emergency numbers. Please confirm numbers for your state. If someone is in danger, call 112." };
  return {
    text: "DEMO MODE: This looks like a question about " + NAMES[m.sec] + ". I cannot give personal eligibility or benefit details here. Please check these official sources, or see that section on this page.",
    links: DATA[m.sec].slice(0, 3)
  };
}

async function callBackend(message) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), CONFIG.TIMEOUT_MS);
  try {
    const r = await fetch(CONFIG.BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message, language: lang }),
      signal: ctl.signal
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const d = await r.json();
    if (typeof d.reply !== "string") throw new Error("Unexpected response");
    return { text: d.reply };
  } finally { clearTimeout(timer); }
}

async function ask(raw) {
  if (busy) return;
  const text = raw.trim();
  if (!text) { setStatus("Please type a question first.", true); return; }
  if (text.length > CONFIG.MAX_LEN) { setStatus("Please keep your question under " + CONFIG.MAX_LEN + " characters.", true); return; }
  setStatus("");
  addMsg("user", text);
  input.value = "";
  busy = true; sendBtn.disabled = true;
  const wait = addMsg("bot", "Thinking...");
  wait.classList.add("loading");
  try {
    let reply;
    if (CONFIG.BACKEND_URL) reply = await callBackend(text);
    else { await new Promise(r => setTimeout(r, 500)); reply = demoReply(text); }
    wait.remove();
    addMsg("bot", reply.text, reply.links);
  } catch (e) {
    wait.remove();
    addMsg("bot", "Sorry, the assistant could not answer right now. Please try again, or use the resource sections on this page.").classList.add("error");
  } finally {
    busy = false; sendBtn.disabled = false; input.focus();
  }
}

$("#form").addEventListener("submit", e => { e.preventDefault(); ask(input.value); });

SUGGESTIONS.forEach(s => {
  const b = el("button", "", s);
  b.type = "button";
  b.addEventListener("click", () => ask(s));
  $("#chips").append(b);
});

document.querySelectorAll("[data-ask]").forEach(b => b.addEventListener("click", () => {
  input.value = b.dataset.ask;
  $("#assistant").scrollIntoView({ behavior: "smooth" });
  input.focus({ preventScroll: true });
}));

/* ---------- Voice input ---------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = $("#mic");
let rec = null, listening = false;
mic.addEventListener("click", () => {
  if (!SR) { setStatus("Voice input is not supported in this browser. Please type your question instead.", true); return; }
  if (listening && rec) { rec.stop(); return; }
  try {
    rec = new SR();
    rec.lang = { en: "en-IN", hi: "hi-IN", or: "or-IN" }[lang] || "en-IN";
    rec.interimResults = false;
    rec.onstart = () => { listening = true; mic.classList.add("on"); setStatus("Listening..."); };
    rec.onresult = e => { input.value = e.results[0][0].transcript.slice(0, CONFIG.MAX_LEN); setStatus("Check your question, then press Send."); };
    rec.onerror = e => setStatus(e.error === "not-allowed" ? "Microphone permission was denied. Please type instead." : "Voice input did not work (" + e.error + "). Please type instead.", true);
    rec.onend = () => { listening = false; mic.classList.remove("on"); if (statusEl.textContent === "Listening...") setStatus(""); };
    rec.start();
  } catch (err) {
    setStatus("Could not start voice input. Please type your question instead.", true);
  }
});

/* ---------- Local contacts (saved on this device only) ---------- */
const KEY = "gs_contacts";
function loadContacts() {
  try { const v = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(v) ? v : []; } catch (e) { return []; }
}
function saveContacts(a) {
  try { localStorage.setItem(KEY, JSON.stringify(a)); return true; } catch (e) { return false; }
}
function renderContacts() {
  const ul = $("#clist");
  ul.replaceChildren();
  const list = loadContacts();
  if (!list.length) { ul.append(el("li", "empty", "No local contacts saved yet. Add one above.")); return; }
  list.forEach((c, i) => {
    const li = el("li");
    const call = el("a", "", c.n + ": " + c.p);
    call.href = "tel:" + String(c.p).replace(/[^0-9+]/g, "");
    const rm = el("button", "link", "Remove");
    rm.type = "button";
    rm.addEventListener("click", () => { const x = loadContacts(); x.splice(i, 1); saveContacts(x); renderContacts(); });
    li.append(call, rm);
    ul.append(li);
  });
}
$("#cform").addEventListener("submit", e => {
  e.preventDefault();
  const n = $("#cn").value.trim(), p = $("#cp").value.trim(), s = $("#cs");
  if (!n || n.length > 40 || !/^[0-9+\-\s]{3,15}$/.test(p)) { say(s, "Enter a name (up to 40 characters) and a valid phone number.", true); return; }
  const list = loadContacts();
  list.push({ n: n, p: p });
  if (!saveContacts(list)) { say(s, "Could not save on this device. Storage may be blocked.", true); return; }
  say(s, "");
  $("#cform").reset();
  renderContacts();
});
renderContacts();
