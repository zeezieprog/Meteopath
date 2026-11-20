/* Shared navigation and presentation helpers for the static atlas. */
(() => {
  "use strict";

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));
  const escapeMap = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  const esc = value => String(value ?? "").replace(/[&<>"']/g, key => escapeMap[key]);
  const norm = value => String(value ?? "").normalize("NFKC").toLocaleLowerCase("id").trim();
  const text = value => esc(String(value ?? "").replace(/\s*;\s*/g, ", "));
  const icon = name => `<svg class="icon" aria-hidden="true" focusable="false"><use href="assets/icons.svg#${esc(name)}"></use></svg>`;
  const list = items => `<ul class="item-list">${items.map(item => `<li>${text(item)}</li>`).join("")}</ul>`;
  const chips = items => `<div class="chips">${items.map(item => `<span>${text(item)}</span>`).join("")}</div>`;
  const tracks = window.METEOPATH_DATA?.specializations ?? [];
  const bySlug = new Map(tracks.map(track => [track.slug, track]));
  const byName = new Map(tracks.map(track => [track.name, track]));
  const symbols = ["cloud", "sun", "water", "globe", "antenna", "radar", "chart", "wind"];
  const trackIcon = t => icon(symbols[tracks.indexOf(t)] || "compass");
  const group = t => ({ "Sains & Iklim": "climate", "Terapan & Industri": "industry", "Teknologi & Data": "technology" }[t.category] || "climate");
  const detailUrl = (slug, tab = "overview") => `spesialisasi.html#detail?track=${encodeURIComponent(slug)}${tab === "overview" ? "" : "&tab=" + encodeURIComponent(tab)}`;
  const trackUrl = (file, slug, anchor) => `${file}.html?track=${encodeURIComponent(slug)}#${anchor}`;
  const selectionFromUrl = () => bySlug.get(new URLSearchParams(location.search).get("track"));
  const empty = (title, description) => `<div class="empty">${icon("search")}<strong>${esc(title)}</strong><p>${esc(description)}</p></div>`;

  function safeLink(value, label, linkedin = false) {
    let url;
    try { url = new URL(value); } catch { return ""; }
    if (!["https:", "http:"].includes(url.protocol)) return "";
    if (linkedin && !/(^|\.)linkedin\.com$/i.test(url.hostname)) return "";
    return `<a class="text-link" href="${esc(url.href)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;
  }

  function fillSelect(select, entries, firstLabel) {
    const options = entries.map(([value, label]) => new Option(label, value));
    if (firstLabel) options.unshift(new Option(firstLabel, "all"));
    select.replaceChildren(...options);
  }
  function trackSelect(select, firstLabel) {
    fillSelect(select, tracks.map(t => [t.slug, t.name]), firstLabel);
  }
  function updateQueryTrack(slug) {
    const url = new URL(location.href);
    if (bySlug.has(slug)) url.searchParams.set("track", slug);
    else url.searchParams.delete("track");
    history.replaceState(null, "", url);
  }

  window.Atlas = Object.freeze({ $, $$, esc, text, norm, icon, list, chips, tracks, bySlug, byName,
    group, trackIcon, detailUrl, trackUrl, selectionFromUrl, empty, safeLink, fillSelect, trackSelect, updateQueryTrack });

  // Old bookmarks used fragments on the homepage before the site had separate routes.
  const routes = { ringkasan: "index", fitur: "index", tentang: "index", detail: "spesialisasi",
    spesialisasi: "spesialisasi", bandingkan: "bandingkan", alumni: "alumni", perusahaan: "perusahaan", karier: "karier", proyek: "karier" };
  function followLegacyFragment() {
    const target = routes[location.hash.slice(1).split("?")[0]];
    if (target && target !== document.body.dataset.page) {
      location.replace(target + ".html" + location.search + location.hash);
    }
  }
  followLegacyFragment();
  window.addEventListener("hashchange", followLegacyFragment);

  document.documentElement.classList.add("js");
  const toggle = $("#menuToggle");
  const nav = $("#navMenu");
  const compact = matchMedia("(max-width: 920px)");
  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    $("use", toggle).setAttribute("href", "assets/icons.svg#" + (open ? "close" : "menu"));
    $("span", toggle).textContent = open ? "Tutup" : "Menu";
    nav.classList.toggle("is-open", open);
  }
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
  });
  document.addEventListener("click", event => {
    if (nav.classList.contains("is-open") && !event.composedPath().includes(toggle)) setMenu(false);
  });
  document.addEventListener("focusin", event => {
    if (nav.classList.contains("is-open") && !nav.contains(event.target) && !toggle.contains(event.target)) setMenu(false);
  });
  compact.addEventListener("change", () => setMenu(false));
  window.addEventListener("pageshow", () => setMenu(false));

  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("arrived");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08 });
    const watch = element => observer.observe(element);
    $$(".feature-card, .feature-lead, .about-layout, .closing, .section-head").forEach(watch);
    const dynamicCards = new MutationObserver(changes => {
      for (const change of changes) {
        for (const added of change.addedNodes) {
          if (added.nodeType === Node.ELEMENT_NODE) watch(added);
        }
        for (const removed of change.removedNodes) {
          if (removed.nodeType === Node.ELEMENT_NODE) observer.unobserve(removed);
        }
      }
    });
    $$("#specGrid, #alumniGrid, #companyGrid, #projectGrid, #careerResult").forEach(grid => {
      dynamicCards.observe(grid, { childList: true });
      Array.from(grid.children).forEach(watch);
    });
  }
})();
