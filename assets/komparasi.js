(() => {
  "use strict";
  const { $, $$, tracks, bySlug, text, detailUrl, esc, trackIcon, icon, group } = window.Atlas;
  const curriculum = window.METEOPATH_CURRICULUM;
  const selections = new Set();
  const options = $("#compareOptions");
  const result = $("#compareResult");
  const reset = $("#compareReset");
  const rows = [
    ["Fokus keilmuan", t => text(t.summary)],
    ["Mata kuliah pilihan wajib", t => curriculum[t.name].filter(c => c.mandatory).map(c => `<p><span class="code">${esc(c.code)}</span> ${text(c.name)}</p>`).join("")],
    ["Keterampilan", t => text(t.skills.join(", "))],
    ["Aktivitas profesional", t => text(t.work)],
    ["Contoh jalur karier", t => `<ol class="compact-list">${t.careerPath.split("→").map(s => `<li>${text(s.trim())}</li>`).join("")}</ol>`],
    ["Contoh proyek", t => text(t.project)],
    ["Detail bidang", t => `<a class="text-link" href="${detailUrl(t.slug)}" aria-label="Buka detail ${esc(t.name)}">Buka spesialisasi</a>`]
  ];

  options.innerHTML = tracks.map(t => `<label class="compare-choice ${group(t)}"><span class="tile-icon">${trackIcon(t)}</span><span>${esc(t.name)}</span><input type="checkbox" value="${esc(t.slug)}"></label>`).join("");

  function draw() {
    const selected = Array.from(selections, slug => bySlug.get(slug));
    const n = selected.length;
    for (const input of $$("input", options)) {
      input.checked = selections.has(input.value);
      input.disabled = n >= 3 && !input.checked;
    }
    reset.hidden = !n;
    $("#compareStatus").textContent = `${n} dari 3 spesialisasi dipilih` + (n === 3 ? ". Lepaskan satu pilihan untuk menggantinya." : "");
    if (n < 2) {
      result.innerHTML = `<div class="compare-empty">${icon("compare")}<h2>${n ? "Pilih satu spesialisasi lagi" : "Bidang mana yang ingin kamu bandingkan?"}</h2><p>Perbandingan akan tampil setelah dua spesialisasi dipilih.</p></div>`;
      return;
    }
    const headers = selected.map(t => `<th scope="col">${text(t.name)}</th>`).join("");
    const body = rows.map(([name, value]) => `<tr><th scope="row">${esc(name)}</th>${selected.map(t => `<td><span class="cell-track" aria-hidden="true">${text(t.name)}</span>${value(t)}</td>`).join("")}</tr>`).join("");
    result.innerHTML = `<h2 class="table-heading">Perbandingan bidang</h2><div class="table-frame"><table class="comparison-table"><caption class="sr">Perbandingan ${esc(selected.map(t => t.name).join(", "))}</caption><thead><tr><th scope="col">Aspek</th>${headers}</tr></thead><tbody>${body}</tbody></table></div><p class="source-note">Gunakan perbandingan ini untuk eksplorasi awal. Diskusikan pilihan mata kuliah dengan dosen wali.</p>`;
  }

  options.addEventListener("change", event => {
    const input = event.target.closest("input");
    if (!input) return;
    if (input.checked && selections.size < 3) selections.add(input.value);
    else selections.delete(input.value);
    draw();
  });
  reset.addEventListener("click", () => { selections.clear(); draw(); $("input", options).focus(); });
  draw();
})();
