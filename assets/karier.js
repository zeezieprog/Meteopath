(() => {
  "use strict";
  const { $, esc, text, norm, icon, list, trackIcon, bySlug, trackSelect, safeLink, empty,
    trackUrl, detailUrl, selectionFromUrl } = window.Atlas;
  const { projects } = window.METEOPATH_DATA;
  const guides = window.METEOPATH_CAREER_GUIDES;
  const details = window.METEOPATH_PROJECT_DETAILS;
  const sources = window.METEOPATH_SOURCE_DIRECTORY;
  const career = $("#careerTrack"), track = $("#projectTrack"), level = $("#projectLevel"), search = $("#projectSearch");
  const reset = $("#projectReset");
  trackSelect(career); trackSelect(track, "Semua spesialisasi");
  const initialTrack = selectionFromUrl();
  if (initialTrack) {
    if (location.hash === "#proyek") track.value = initialTrack.slug;
    career.value = initialTrack.slug;
  }

  function part(title, body, open = false) {
    return `<details class="guide-part" ${open ? "open" : ""}><summary>${esc(title)}${icon("fold")}</summary><div class="part-body">${body}</div></details>`;
  }
  const sectionList = (title, items) => `<section><h4>${esc(title)}</h4>${list(items)}</section>`;
  function drawCareer() {
    const t = bySlug.get(career.value);
    const g = guides[t.slug];
    const roles = g.roles.map(([stage, role, description]) => `<li><small>${text(stage)}</small><strong>${text(role)}</strong><p>${text(description)}</p></li>`).join("");
    const timeline = g.timeline.map(([stage, description]) => `<li><strong>${text(stage)}</strong><p>${text(description)}</p></li>`).join("");
    $("#careerResult").innerHTML = `<div class="guide-layout"><aside class="guide-cover"><span class="detail-emblem">${trackIcon(t)}</span><p class="eyebrow">Bidang pilihan</p><h3>${text(t.name)}</h3><p>${text(g.intro)}</p><div class="guide-focus"><strong>Fokus utama</strong><span>${text(t.tagline)}</span></div></aside>
      <div class="guide-parts">
      ${part("Aktivitas dan hasil kerja", sectionList("Pekerjaan sehari-hari", g.daily) + sectionList("Hasil kerja yang biasa dibuat", g.outputs), true)}
      ${part("Contoh jenjang profesi", '<p>Perkembangan peran dapat berbeda antarorganisasi.</p><ol class="career-stages">' + roles + '</ol>')}
      ${part("Persiapan akademik dan perangkat", sectionList("Dasar teori dan mata kuliah pendukung", g.foundation) + sectionList("Perangkat, data, dan alat", g.tools))}
      ${part("Tahap belajar dan pengalaman", '<p>Sesuaikan tahap ini dengan semester dan pengalamanmu.</p><ol class="career-stages">' + timeline + '</ol>' + sectionList("Pengalaman yang bisa dicari sejak kuliah", g.experience))}
      ${part("Sektor kerja dan kualifikasi", sectionList("Contoh sektor pengguna keahlian", g.sectors) + '<p class="note-inline">' + text(g.caution) + '</p>')}
      <div class="guide-links"><a class="button solid" id="chooseProject" href="${trackUrl("karier",t.slug,"proyek")}">${icon("notes")}Proyek bidang ini</a><a class="text-link" href="${trackUrl("perusahaan",t.slug,"perusahaan")}">Organisasi terkait</a><a class="text-link" href="${detailUrl(t.slug,"courses")}">Lihat mata kuliah</a></div></div></div>
      <p class="source-note">Panduan profesi disusun untuk eksplorasi. Periksa persyaratan pada organisasi terkait dan diskusikan pilihan akademik dengan dosen wali.</p>`;
  }
  function dataSources(keys) {
    return `<ul class="sources-list">${keys.map(k => sources[k]).filter(Boolean).map(s =>
      `<li>${safeLink(s.url, s.name)}<p>${text(s.hint)}</p></li>`).join("")}</ul>`;
  }
  function projectCard(project) {
    const d = details[project.id];
    const t = bySlug.get(project.track);
    return `<article class="project-card" id="project-${esc(project.id)}"><div class="project-meta"><span class="level">${text(project.level)}</span><span>${icon("clock")}${text(d.duration)}</span></div>
      <p class="card-kicker">${text(t.name)}</p><h3>${text(project.title)}</h3><p>${text(project.summary)}</p>
      <dl class="project-facts"><div><dt>Perangkat utama</dt><dd>${text(project.tools)}</dd></div><div><dt>Hasil yang dituju</dt><dd>${text(project.output)}</dd></div></dl>
      <details class="disclosure project-detail"><summary>Panduan lengkap proyek${icon("fold")}</summary><div class="disclosure-body">
      ${sectionList("Persiapan sebelum memulai", d.prereq)}
      <section><h4>Langkah pengerjaan</h4><ol class="numbered">${d.steps.map(s => `<li>${text(s)}</li>`).join("")}</ol></section>
      <section><h4>Dataset dan dokumentasi</h4>${dataSources(d.data)}</section>
      ${sectionList("Cara memeriksa hasil", d.checks)}${sectionList("Luaran portofolio", d.deliverables)}
      <section><h4>Pengembangan lanjutan</h4><p>${text(d.next)}</p></section><aside class="note-inline"><strong>Saat mempresentasikan proyek</strong><p>Jelaskan pertanyaan awal, sumber data, metode, hasil, pemeriksaan kualitas, dan keterbatasan. Sertakan dokumentasi atau tautan kode bila tersedia.</p></aside>
      </div></details></article>`;
  }
  function drawProjects() {
    const q = norm(search.value);
    const filtered = projects.filter(p => {
      if (track.value !== "all" && p.track !== track.value) return false;
      if (level.value !== "all" && p.level !== level.value) return false;
      const d = details[p.id];
      return !q || norm([p.title, p.summary, p.tools, p.output, bySlug.get(p.track).name, ...d.prereq, ...d.steps].join(" ")).includes(q);
    });
    $("#projectCount").textContent = `${filtered.length} dari ${projects.length} proyek`;
    $("#projectGrid").innerHTML = filtered.length ? filtered.map(projectCard).join("") : empty("Proyek tidak ditemukan", "Ubah spesialisasi, tingkat kesulitan, atau kata kunci.");
    reset.hidden = !q && track.value === "all" && level.value === "all";
  }

  career.addEventListener("change", () => { history.replaceState(null, "", trackUrl("karier",career.value,"karier")); drawCareer(); });
  track.addEventListener("change", () => { history.replaceState(null, "", track.value === "all" ? "karier.html#proyek" : trackUrl("karier",track.value,"proyek")); drawProjects(); });
  level.addEventListener("change", drawProjects);
  search.addEventListener("input", drawProjects);
  reset.addEventListener("click", () => {
    track.value = "all"; level.value = "all"; search.value = "";
    history.replaceState(null, "", "karier.html#proyek"); drawProjects(); search.focus();
  });
  $("#careerResult").addEventListener("click", event => {
    const link = event.target.closest("#chooseProject");
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); track.value = career.value; level.value = "all"; search.value = "";
    drawProjects(); history.pushState(null, "", link.href);
    $("#proyek").scrollIntoView({ block: "start" }); track.focus({ preventScroll: true });
  });
  // Restore track-specific links when navigating back through the browser history.
  window.addEventListener("popstate", () => {
    const t = selectionFromUrl();
    if (location.hash === "#proyek") { track.value = t?.slug || "all"; drawProjects(); }
    if (t && location.hash === "#karier") { career.value = t.slug; drawCareer(); }
  });
  drawCareer(); drawProjects();
})();
