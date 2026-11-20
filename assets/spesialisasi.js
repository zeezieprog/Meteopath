(() => {
  "use strict";
  const { $, $$, tracks, bySlug, esc, text, norm, group, icon, trackIcon, list, chips, empty,
    detailUrl, trackUrl, safeLink, trackSelect } = window.Atlas;
  const { alumni, companies, metadata } = window.METEOPATH_DATA;
  const curriculum = window.METEOPATH_CURRICULUM;
  const picker = $("#detailPicker");
  const body = $("#detailBody");
  const tabs = $$("#detailTabs [role=tab]");
  const filter = $("#categoryFilters");
  const categories = ["Semua", ...new Set(tracks.map(t => t.category))];
  let category = "Semua";
  let current = tracks[0];
  let tab = "overview";
  let courseFilter = "all";
  let courseQuery = "";
  const courseLimit = 12;
  const storageKey = "meteopath-courses";

  function peopleFor(t, secondary = false) {
    return alumni.filter(a => secondary
      ? a["Kelompok Pendukung"] === t.name && a["Kelompok Utama"] !== t.name
      : a["Kelompok Utama"] === t.name);
  }
  const orgsFor = t => companies.filter(o => o.specializations.includes(t.name));

  filter.innerHTML = categories.map((category, i) =>
    `<button class="pill" type="button" data-category="${esc(category)}" aria-pressed="${i === 0}">${esc(category)}</button>`).join("");
  function catalog() {
    const q = norm($("#specSearch").value);
    const active = category;
    const items = tracks.filter(t => {
      if (active !== "Semua" && t.category !== active) return false;
      return !q || norm([t.name, t.tagline, t.summary, t.fit, ...t.skills, ...t.prepare,
        ...curriculum[t.name].map(c => c.code + " " + c.name)].join(" ")).includes(q);
    });
    $$("button", filter).forEach(b => b.setAttribute("aria-pressed", String(b.dataset.category === active)));
    $("#specCount").textContent = `${items.length} dari ${tracks.length} spesialisasi`;
    $("#specReset").hidden = !q && active === "Semua";
    $("#specGrid").innerHTML = items.length ? items.map(t => `<a class="spec-card ${group(t)}" href="${detailUrl(t.slug)}">
      <div class="card-meta"><span class="tile-icon">${trackIcon(t)}</span><span class="category">${text(t.category)}</span></div>
      <h3>${esc(t.name)}</h3><p>${text(t.tagline)}</p>
      <div class="card-foot"><span>${curriculum[t.name].length} mata kuliah</span><span>${peopleFor(t).length} profil utama</span></div></a>`).join("")
      : empty("Spesialisasi tidak ditemukan", "Coba kata kunci lain atau hapus filter.");
  }
  filter.addEventListener("click", e => {
    const button = e.target.closest("[data-category]");
    if (button) { category = button.dataset.category; catalog(); }
  });
  $("#specSearch").addEventListener("input", catalog);
  $("#specReset").addEventListener("click", () => {
    category = "Semua"; $("#specSearch").value = ""; catalog(); $("#specSearch").focus();
  });

  function overview(t) {
    return `<span class="panel-kicker">Gambaran bidang</span><h3>${text(t.tagline)}</h3><p class="panel-intro">${text(t.summary)}</p>
      <div class="info-section"><h4>Aktivitas kerja</h4><p>${text(t.work)}</p></div>
      <div class="two-block"><div><h4>Minat yang sesuai</h4><p>${text(t.fit)}</p></div><div><h4>Contoh proyek portofolio</h4><p>${text(t.project)}</p></div></div>
      <p class="note-inline">Paket ini memuat ${curriculum[t.name].length} mata kuliah, termasuk ${curriculum[t.name].filter(c => c.mandatory).length} pilihan wajib.</p>
      <div class="panel-links"><a class="text-link" href="bandingkan.html">Bandingkan bidang</a><a class="text-link" href="${trackUrl("karier", t.slug, "proyek")}">Proyek bidang ini</a></div>`;
  }

  function skills(t) {
    return `<span class="panel-kicker">Persiapan profesi</span><h3>Keterampilan dan arah karier</h3><p class="panel-intro">Berikut rekomendasi pengembangan kompetensi untuk bidang ${text(t.name)}.</p>
      ${chips(t.skills)}<div class="info-section"><h4>Yang bisa mulai kamu pelajari</h4>${list(t.prepare)}</div>
      <div class="info-section"><h4>Contoh perkembangan karier</h4><ol class="path-list">${t.careerPath.split("→").map(s => `<li>${text(s.trim())}</li>`).join("")}</ol></div>
      <div class="info-section"><h4>Proyek yang bisa dikerjakan</h4><p>${text(t.project)}</p></div>
      <p class="source-note">Perkembangan peran dapat berbeda antarorganisasi.</p><a class="text-link" href="${trackUrl("karier", t.slug, "karier")}">Baca panduan profesi</a>`;
  }
  function relatedPeople(t) {
    function groupList(title, people) {
      if (!people.length) return "";
      return `<h4 class="group-title">${title} (${people.length})</h4><div class="relation-list">${people.map(a => `<article><strong>${text(a["Nama Alumni"])}</strong><p>${text(a["Peran / Jejak Profesional"])}</p><small>${text(a["Institusi / Sektor"])} · ${text(a.degreeStatus)}</small>${safeLink(a["URL LinkedIn"], "Profil LinkedIn", true)}</article>`).join("")}</div>`;
    }
    return `<span class="panel-kicker">Jejak profesional</span><h3>Profil terkait ${text(t.name)}</h3><p class="panel-intro">Pengelompokan mengacu pada pengalaman studi dan kerja yang tercantum di profil publik. Riwayat paket spesialisasi memerlukan konfirmasi tersendiri.</p>${groupList("Kelompok utama", peopleFor(t))}${groupList("Kelompok pendukung", peopleFor(t, true))}<a class="text-link" href="${trackUrl("alumni",t.slug,"alumni")}">Lihat direktori profil bidang ini</a>`;
  }
  function relatedOrgs(t) {
    const orgs = orgsFor(t);
    return `<span class="panel-kicker">Keterkaitan industri</span><h3>${orgs.length} organisasi terkait</h3><p class="panel-intro">Lihat contoh posisi, dasar keterkaitan, dan persyaratan pada sumber organisasi.</p>
      <div class="relation-list">${orgs.map(o => {
        const ref = o.references.find(r => r.specialization === t.name);
        return `<article><strong>${text(o.name)}</strong><p>${text(ref.role)}</p><small>${text(ref.evidenceType)} · ${text(ref.qualification)}</small><div class="panel-links">${safeLink(o.site, "Situs organisasi")}${safeLink(ref.source, "Sumber relevansi")}</div></article>`;
      }).join("")}</div><a class="text-link" href="${trackUrl("perusahaan", t.slug, "perusahaan")}">Lihat direktori organisasi bidang ini</a>`;
  }

  function loadChoices() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
      return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
    } catch { return {}; }
  }
  let saved = loadChoices();
  function chosen() {
    const courses = curriculum[current.name];
    const selected = new Set(courses.filter(c => c.mandatory).map(c => c.code));
    const previous = saved[current.slug];
    let total = courses.filter(c => selected.has(c.code)).reduce((sum, c) => sum + c.credits, 0);
    for (const code of Array.isArray(previous) ? previous : []) {
      const course = courses.find(c => c.code === code);
      if (course && !selected.has(code) && total + course.credits <= courseLimit) {
        selected.add(code); total += course.credits;
      }
    }
    return { selected, total };
  }
  function saveChoices(selected) {
    const codes = Array.from(selected);
    try {
      const latest = { ...loadChoices(), [current.slug]: codes };
      localStorage.setItem(storageKey, JSON.stringify(latest)); saved = latest;
    } catch { saved = { ...saved, [current.slug]: codes }; }
  }
  function courses(t) {
    const all = curriculum[t.name];
    const required = all.filter(c => c.mandatory).length;
    const options = [["all","Semua",all.length],["mandatory","Pilihan wajib",required],["optional","Opsi paket",all.length-required]];
    return `<span class="panel-kicker">Kurikulum 2024</span><h3>Mata kuliah dan simulasi SKS</h3><p class="panel-intro">${all.length} mata kuliah tersedia dalam paket ${text(t.name)}. Pilihan wajib sudah ditandai. Lengkapi simulasi hingga ${courseLimit} SKS.</p>
      <div class="course-status"><div><strong id="courseTotal" role="status"></strong><span>Paket spesialisasi</span></div><progress id="courseProgress" max="${courseLimit}" value="0" aria-label="SKS terpilih"></progress></div>
      <div class="pills course-pills" role="group" aria-label="Jenis mata kuliah">${options.map(([v,l,n]) => `<button type="button" class="pill" data-course-filter="${v}" aria-pressed="${v === courseFilter}">${l} (${n})</button>`).join("")}</div>
      <label class="field search-field"><span>Cari mata kuliah</span><span class="search-input">${icon("search")}<input id="courseSearch" type="search" placeholder="Kode atau nama mata kuliah" value="${esc(courseQuery)}"></span></label>
      <div class="course-list" id="courseRows"></div><div class="copy-controls"><button type="button" class="button outlined" id="copyCourse">${icon("copy")}Salin pilihan mata kuliah</button><span id="copyStatus" role="status"></span></div>
      <div id="copyManual" hidden><label class="field">Teks pilihan untuk disalin<textarea readonly rows="5" id="copyText"></textarea></label></div>
      <p class="source-note">Simulasi ini untuk eksplorasi awal. Konfirmasikan pengisian IRS dan pemenuhan paket dengan dosen wali. ${safeLink(metadata.officialCurriculum, "Lihat kurikulum resmi ITB")}</p>`;
  }
  function drawCourseRows() {
    const { selected, total } = chosen();
    const query = norm(courseQuery);
    const filtered = curriculum[current.name].filter(c => {
      return (courseFilter === "all" || (courseFilter === "mandatory" ? c.mandatory : !c.mandatory)) && norm(c.code + " " + c.name).includes(query);
    });
    $("#courseTotal").textContent = `${total} dari ${courseLimit} SKS terpilih`;
    $("#courseProgress").value = total;
    $("#courseRows").innerHTML = filtered.length ? filtered.map(c => {
      const checked = selected.has(c.code);
      const disabled = c.mandatory || (!checked && total + c.credits > courseLimit);
      return `<label class="course-row"><input type="checkbox" data-course="${esc(c.code)}" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""}><span><small class="code">${esc(c.code)}</small><strong>${text(c.name)}</strong>${c.mandatory ? '<small class="required-label">Pilihan wajib</small>' : ""}</span><b>${c.credits} SKS</b></label>`;
    }).join("") : empty("Mata kuliah tidak ditemukan", "Ubah kata kunci atau jenis mata kuliah.");
    if (total === courseLimit) $("#courseRows").insertAdjacentHTML("beforeend", '<p class="source-note">Paket sudah mencapai 12 SKS. Lepaskan satu mata kuliah pilihan untuk menggantinya.</p>');
  }

  const panels = { overview, courses, skills, alumni: relatedPeople, companies: relatedOrgs };
  function renderPanel() {
    tabs.forEach(button => {
      const active = button.dataset.tab === tab;
      button.setAttribute("aria-selected", String(active)); button.tabIndex = active ? 0 : -1;
    });
    body.setAttribute("aria-labelledby", "tab-" + tab);
    body.innerHTML = panels[tab](current);
    if (tab === "courses") drawCourseRows();
  }
  function renderTrack() {
    picker.value = current.slug;
    $("#detailSide").innerHTML = `<div class="detail-emblem">${trackIcon(current)}</div><h3 tabindex="-1">${text(current.name)}</h3><p>${text(current.summary)}</p><dl class="side-facts"><div><dt>Paket spesialisasi</dt><dd>12 SKS</dd></div><div><dt>Profil utama</dt><dd>${peopleFor(current).length}</dd></div><div><dt>Organisasi terkait</dt><dd>${orgsFor(current).length}</dd></div></dl>`;
    renderPanel();
  }
  function applyRoute(scroll) {
    const [id, args] = location.hash.slice(1).split("?");
    const params = new URLSearchParams(args);
    if (id === "detail") {
      current = bySlug.get(params.get("track")) || current;
      tab = tabs.some(button => button.dataset.tab === params.get("tab")) ? params.get("tab") : "overview";
      courseFilter = "all"; courseQuery = "";
    }
    renderTrack();
    if (scroll && id === "detail") {
      requestAnimationFrame(() => {
        $("#detail").scrollIntoView({ block: "start" });
        $("#detailSide h3").focus({ preventScroll: true });
      });
    }
  }
  function updateDetailAddress() {
    history.replaceState(null, "", detailUrl(current.slug, tab));
  }
  trackSelect(picker);
  picker.addEventListener("change", () => {
    current = bySlug.get(picker.value); tab = "overview"; courseFilter = "all"; courseQuery = "";
    updateDetailAddress(); renderTrack();
  });
  $("#detailTabs").addEventListener("click", event => {
    const button = event.target.closest("[data-tab]");
    if (button) { tab = button.dataset.tab; updateDetailAddress(); renderPanel(); }
  });
  $("#detailTabs").addEventListener("keydown", event => {
    const index = tabs.indexOf(event.target);
    if (index < 0) return;
    const positions = { ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1 };
    if (!Object.hasOwn(positions, event.key)) return;
    event.preventDefault();
    const target = tabs[positions[event.key]];
    target.focus(); target.click();
  });
  body.addEventListener("input", event => {
    if (event.target.id === "courseSearch") { courseQuery = event.target.value; drawCourseRows(); }
  });
  body.addEventListener("change", event => {
    const input = event.target.closest("input[data-course]");
    if (!input || input.disabled) return;
    const { selected, total } = chosen();
    const course = curriculum[current.name].find(c => c.code === input.dataset.course);
    if (!course || course.mandatory) return;
    if (input.checked && total + course.credits <= courseLimit) selected.add(course.code);
    else selected.delete(course.code);
    saveChoices(selected);
    $("#copyStatus").textContent = ""; $("#copyManual").hidden = true;
    drawCourseRows(); $(`[data-course="${course.code}"]`, body)?.focus({ preventScroll: true });
  });
  body.addEventListener("click", async event => {
    const target = event.target.closest("button");
    if (!target) return;
    if (target.dataset.courseFilter) {
      courseFilter = target.dataset.courseFilter;
      $$("[data-course-filter]", body).forEach(b => b.setAttribute("aria-pressed", String(b === target)));
      drawCourseRows();
    }
    if (target.id !== "copyCourse") return;
    const { selected, total } = chosen();
    const lines = curriculum[current.name].filter(c => selected.has(c.code)).map(c => c.code + " " + c.name + " (" + c.credits + " SKS)");
    const selection = ["Simulasi " + current.name + " · " + total + "/12 SKS", ...lines, "Konsultasikan pilihan dengan dosen wali."].join("\n");
    const area = $("#copyText");
    area.value = selection; $("#copyManual").hidden = false;
    $("#copyStatus").textContent = "Teks pilihan tersedia untuk disalin.";
    try {
      await navigator.clipboard.writeText(selection);
      if (target.isConnected && area.value === selection) {
        $("#copyManual").hidden = true; $("#copyStatus").textContent = "Pilihan berhasil disalin.";
      }
    } catch {
      if (!target.isConnected) return;
      $("#copyManual").hidden = false;
      area.focus(); area.select();
      $("#copyStatus").textContent = "Teks siap disalin melalui menu perangkat.";
    }
  });
  window.addEventListener("storage", event => {
    if (event.key !== storageKey && event.key !== null) return;
    saved = loadChoices(); if (tab === "courses") drawCourseRows();
  });
  $("#specGrid").addEventListener("click", event => {
    const link = event.target.closest("a");
    if (link?.href === location.href && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      event.preventDefault(); applyRoute(true);
    }
  });
  window.addEventListener("hashchange", () => applyRoute(true));
  catalog(); applyRoute(true);
})();
