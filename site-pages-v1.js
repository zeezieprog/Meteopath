/* METEOPATH page navigation bridge
   Static HTML entrypoints remain deep-linkable on GitHub Pages.
   This file only translates legacy in-page links to the correct route;
   specialization, alumni and planner renderers stay unchanged. */
(() => {
  "use strict";
  const targets = Object.freeze({
    ringkasan:"index.html#ringkasan",
    spesialisasi:"spesialisasi.html#spesialisasi",
    detail:"spesialisasi.html#detail",
    bandingkan:"bandingkan.html#bandingkan",
    alumni:"alumni.html#alumni",
    perusahaan:"perusahaan.html#perusahaan",
    karier:"karier.html#karier",
    proyek:"karier.html#proyek",
    roadmap:"karier.html#roadmap",
    rencana:"rencana.html#rencana",
    tentang:"tentang.html#tentang"
  });
  const pageFile = {
    home:"index.html",
    spesialisasi:"spesialisasi.html",
    bandingkan:"bandingkan.html",
    alumni:"alumni.html",
    perusahaan:"perusahaan.html",
    karier:"karier.html",
    rencana:"rencana.html",
    tentang:"tentang.html"
  };
  const current = document.body.dataset.page || "home";
  function routeForHash(hash) {
    if (!hash || hash === "#top") return null;
    const key = hash.slice(1).split("?")[0];
    const destination = targets[key];
    if (!destination) return null;
    const filename = destination.split("#")[0];
    return filename === pageFile[current] ? null : filename + hash;
  }
  const backToTop = document.querySelector(".footer-bottom a[href='index.html']");
  if (backToTop) backToTop.setAttribute("href", "#top");
  const legacyHash = routeForHash(window.location.hash);
  if (legacyHash) {
    // Keeps existing shared METEOPATH links working after the redesign.
    window.location.replace(legacyHash);
    return;
  }

  // Capture only cross-page anchors. Leave all other click handlers intact.
  document.addEventListener("click", event => {
    if (event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest("a[href]");
    if (!link || link.hasAttribute("download") ||
        (link.target && link.target !== "_self")) return;
    const href = link.getAttribute("href") || "";
    if (!href.startsWith("#")) return;
    const destination = routeForHash(href);
    if (!destination) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign(destination);
  }, true);
})();
