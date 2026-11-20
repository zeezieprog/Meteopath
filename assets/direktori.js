(() => {
  "use strict";
  const { $, esc, text, norm, bySlug, trackSelect, fillSelect, safeLink, icon, chips, empty,
    selectionFromUrl, updateQueryTrack } = window.Atlas;
  const data = window.METEOPATH_DATA;
  const people = document.body.dataset.page === "alumni";
  const scope = people ? "alumni" : "company";
  const search = $("#" + scope + "Search");
  const track = $("#" + scope + "Filter");
  const grid = $("#" + scope + "Grid");
  const count = $("#" + scope + "Count");
  const reset = $("#" + scope + "Reset");
  const degree = $("#alumniDegreeFilter");
  const type = $("#companyTypeFilter");
  const region = $("#companyRegionFilter");
  const evidence = $("#companyEvidenceFilter");
  const documented = r => r.evidenceType === "Lowongan terdokumentasi";
  const publicDegree = a => a.degreeStatus === "S1 Meteorologi ITB tercantum";
  const initials = s => String(s).replace(/[()]/g, "").split(/[\s/–—-]+/).filter(Boolean).slice(0,2).map(word => word[0]).join("").toUpperCase();
  const fields = people ? [track, degree] : [track, type, region, evidence];
  trackSelect(track, "Semua spesialisasi");
  if (selectionFromUrl()) track.value = selectionFromUrl().slug;
  function distinct(key) {
    return [...new Set(data.companies.map(o => o[key]))].sort((a,b) => a.localeCompare(b, "id")).map(value => [value,value]);
  }
  if (!people) {
    fillSelect(type, distinct("type"), "Semua jenis");
    fillSelect(region, distinct("region"), "Semua wilayah");
  }

  function personCard(a) {
    const secondary = a["Kelompok Pendukung"];
    const verified = a.verifiedAt ? "Tanggal yang tercatat: " + a.verifiedAt : "Tanggal verifikasi profil belum tercatat.";
    return `<article class="directory-card person-card">
      <div class="directory-card-head"><span class="avatar" aria-hidden="true">${esc(a.initials || initials(a["Nama Alumni"]))}</span><div><span class="card-kicker">${text(a["Kelompok Utama"])}</span><h2>${text(a["Nama Alumni"])}</h2></div></div>
      <p class="role-line">${text(a["Peran / Jejak Profesional"])}</p><p class="institution">${icon("office")}<span>${text(a["Institusi / Sektor"])}</span></p>
      <div class="qualification${publicDegree(a) ? "" : " pending"}">${icon(publicDegree(a) ? "book" : "info")}<span>${text(a.degreeStatus)}</span></div>
      <details class="disclosure"><summary>Dasar klasifikasi${icon("fold")}</summary><div class="disclosure-body"><p>${text(a["Alasan Klasifikasi"])}</p><dl class="stack-facts">
      <div><dt>Pendidikan yang tercantum</dt><dd>${text(a["Pendidikan ITB"])}</dd></div><div><dt>Status karier</dt><dd>${text(a["Status Karier"])}</dd></div>
      ${secondary ? `<div><dt>Bidang pendukung</dt><dd>${text(secondary)}</dd></div>` : ""}
      <div><dt>Paket Kurikulum 2024</dt><dd>${text(a["Paket Kurikulum 2024"])}</dd></div>
      <div><dt>Kekuatan bukti dalam data</dt><dd>${text(a["Kekuatan Bukti"])}. ${text(verified)}</dd></div></dl></div></details>
      <div class="directory-links">${safeLink(a["URL LinkedIn"], "Lihat profil LinkedIn", true) || "<span>Profil LinkedIn belum tercantum.</span>"}</div></article>`;
  }
  function findPeople(q, name) {
    return data.alumni.filter(a => {
      if (name && a["Kelompok Utama"] !== name && a["Kelompok Pendukung"] !== name) return false;
      if (degree.value !== "all" && publicDegree(a) !== (degree.value === "s1")) return false;
      return !q || norm([a["Nama Alumni"], a["Peran / Jejak Profesional"], a["Institusi / Sektor"], a["Kelompok Utama"], a["Kelompok Pendukung"]].join(" ")).includes(q);
    });
  }
  function orgCard({ org, refs }) {
    const lead = refs[0];
    const specialties = [...new Set(refs.map(r => r.specialization))];
    const details = refs.map(r => `<section class="ref-block"><h3>${text(r.specialization)}</h3><p><strong>${text(r.role)}</strong></p><p>${text(r.reason)}</p>
      ${chips(r.skills.split(";").map(v => v.trim()).filter(Boolean))}
      <dl class="stack-facts"><div><dt>Jenis bukti</dt><dd>${text(r.evidenceType)}</dd></div><div><dt>Kualifikasi</dt><dd>${text(r.qualification)}</dd></div></dl>
      ${safeLink(r.source, "Buka sumber relevansi")}</section>`).join("");
    return `<article class="directory-card org-card"><div class="directory-card-head"><span class="avatar org-avatar" aria-hidden="true">${esc(initials(org.name))}</span><div><span class="card-kicker">${text(org.type)}</span><h2>${text(org.name)}</h2></div></div>
      <p class="institution">${icon("pin")}<span>${text(org.region)}</span></p><p class="role-line">${text(lead.role)}</p><p>${text(lead.reason)}</p>${chips(specialties)}
      <details class="disclosure"><summary>Peran dan sumber (${refs.length})${icon("fold")}</summary><div class="disclosure-body">${details}</div></details>
      <div class="directory-links">${safeLink(org.site,"Situs organisasi")}${safeLink(lead.source,"Sumber relevansi")}</div></article>`;
  }
  function findOrgs(q, name) {
    const items = [];
    for (const org of data.companies) {
      if (type.value !== "all" && type.value !== org.type) continue;
      if (region.value !== "all" && region.value !== org.region) continue;
      const orgMatches = norm([org.name, org.type, org.region].join(" ")).includes(q);
      // All reference-level predicates must match the same relationship.
      const refs = org.references.filter(r =>
        (!name || r.specialization === name) &&
        (evidence.value === "all" || documented(r) === (evidence.value === "lowongan")) &&
        (orgMatches || norm([r.role, r.skills, r.reason, r.specialization, r.evidenceType].join(" ")).includes(q))
      );
      if (refs.length) items.push({ org, refs });
    }
    return items;
  }
  function draw() {
    const q = norm(search.value);
    const name = bySlug.get(track.value)?.name;
    const items = people ? findPeople(q, name) : findOrgs(q, name);
    const label = people ? "profil" : "organisasi";
    const total = people ? data.alumni.length : data.companies.length;
    count.textContent = `${items.length} dari ${total} ${label}`;
    reset.hidden = !q && fields.every(field => field.value === "all");
    grid.innerHTML = items.length ? items.map(people ? personCard : orgCard).join("") : empty("Hasil tidak ditemukan", "Coba kata kunci lain atau hapus filter untuk menampilkan semua " + label + ".");
  }
  search.addEventListener("input", draw);
  fields.forEach(el => el.addEventListener("change", () => { if (el === track) updateQueryTrack(track.value); draw(); }));
  reset.addEventListener("click", () => {
    search.value = "";
    fields.forEach(el => { el.value = "all"; });
    updateQueryTrack("all"); draw(); search.focus();
  });
  draw();
})();
