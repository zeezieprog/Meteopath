/* Meteopath v6 interactions */
(function(){
"use strict";
const orgs=dataset.companies;
const skillChoices=["Python","QGIS dan GIS","Statistika","Linux dan Git","Remote sensing","Visualisasi data","Riset ilmiah","Komunikasi"];
function safeGet(k,d){try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}}
function safeSet(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function uniq(v){return [...new Set(v.filter(Boolean))]}
function options(el,all){el.innerHTML=(all?'<option value="all">Semua spesialisasi</option>':'')+tracks.map(function(t){return '<option value="'+esc(t.slug)+'">'+esc(t.name)+'</option>'}).join('')}
function norm(x){return String(x||"").toLocaleLowerCase("id").trim()}
function refFor(o,track){return (o.references.find(function(r){return r.specialization===track&&/lowongan/i.test(r.evidenceType)})||o.references.find(function(r){return r.specialization===track})||o.references[0])}
const baseNav=navSetup;
navSetup=function(){baseNav();const toggle=$("#mobileToggle"),nav=$("#navMenu");function close(){nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");toggle.setAttribute("aria-label","Buka menu navigasi")}
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&nav.classList.contains("open")){close();toggle.focus()}});
document.addEventListener("click",function(e){if(nav.classList.contains("open")&&!nav.contains(e.target)&&!toggle.contains(e.target))close()});
toggle.addEventListener("click",function(){toggle.setAttribute("aria-label",nav.classList.contains("open")?"Tutup menu navigasi":"Buka menu navigasi")})};
renderStats=function(){const items=[
[tracks.length,"Spesialisasi","Kurikulum 2024"],
[dataset.stats.totalUniqueCourses,"Mata kuliah unik","75 entri pada 8 paket"],
[dataset.alumni.length,"Profil karier","Riwayat publik, status pendidikan ditandai"],
[orgs.length,"Organisasi unik","50 relasi lintas spesialisasi"]];
$("#statsGrid").innerHTML=items.map(function(a){return '<div class="metric reveal"><div class="metric-number">'+a[0]+'</div><div><div class="metric-label">'+esc(a[1])+'</div><div class="metric-hint">'+esc(a[2])+'</div></div></div>'}).join('')};
renderDetailSidebar=function(t){$("#detailName").textContent=t.name;$("#detailShort").textContent=t.summary;$("#detailHeroMini").textContent=String(tracks.indexOf(t)+1).padStart(2,"0");$("#detailHeroMini").style.setProperty("--track-accent",t.accent||"#82bfd7");
const n=dataset.alumni.filter(function(a){return a["Kelompok Utama"]===t.name}).length,m=orgs.filter(function(o){return o.specializations.includes(t.name)}).length;
$("#detailFacts").innerHTML='<div class="detail-fact"><span>Paket spesialisasi</span><strong>12 SKS</strong></div><div class="detail-fact"><span>Profil utama</span><strong>'+n+'</strong></div><div class="detail-fact"><span>Organisasi terkait</span><strong>'+m+'</strong></div>';$("#detailPicker").value=t.slug;$("#courseCountBadge").textContent=curriculum[t.name].length};
const baseSelect=selectTrack;
selectTrack=function(slug,scroll){if(!trackBySlug[slug])return;baseSelect(slug,scroll);if(!window.__meteopathRouteLoading)history.replaceState(null,"","#detail?track="+slug)};
renderTabs=function(){$$("#detailTabs [role=tab]").forEach(function(b){const active=b.dataset.tab===state.tab;b.classList.toggle("active",active);b.setAttribute("aria-selected",String(active));b.setAttribute("tabindex",active?"0":"-1");b.setAttribute("aria-controls","detailBody");b.id="tab-"+b.dataset.tab});$("#detailBody").setAttribute("aria-labelledby","tab-"+state.tab)};
companyFor=function(t){return orgs.filter(function(o){return o.specializations.includes(t.name)})};
filteredCompanies=function(){const track=labelFilter(state.companyFilter),q=norm(state.companySearch);return orgs.filter(function(o){return (state.companyFilter==="all"||o.specializations.includes(track))&&(!q||norm([o.name,o.type,o.region,o.specializations.join(" "),o.references.map(function(r){return r.role+" "+r.skills+" "+r.reason}).join(" ")].join(" ")).includes(q))})};
function links(o,r){return linkTo(o.site,"Situs karier")+linkTo(r.source,"Sumber relevansi")}
const baseCompanyFilter=filteredCompanies;
filteredCompanies=function(){const type=$("#companyTypeFilter")?.value||"all",region=$("#companyRegionFilter")?.value||"all",evidence=$("#companyEvidenceFilter")?.value||"all";
 return baseCompanyFilter().filter(function(o){
  if(type!=="all"&&o.type!==type)return false;
  if(region!=="all"&&o.region!==region)return false;
  const related=state.companyFilter==="all"?o.references:o.references.filter(function(r){return r.specialization===labelFilter(state.companyFilter)});const hasJob=related.some(function(r){return /lowongan/i.test(r.evidenceType||"")});
  return evidence==="all"||(evidence==="lowongan"&&hasJob)||(evidence==="sektor"&&!hasJob)
 })
};
companyCard=function(o,i){const r=refFor(o,state.companyFilter==="all"?null:labelFilter(state.companyFilter)),skills=uniq((r.skills||"").split(";").map(function(x){return x.trim()})).slice(0,3);
return '<article class="company-card reveal" style="--delay:'+Math.min(i%3*60,120)+'ms"><div class="company-top"><span class="company-monogram">'+esc(initials(o.name))+'</span><div><h3>'+esc(o.name)+'</h3><div class="company-kind">'+esc(o.type)+', '+esc(o.region)+'</div></div></div><div class="company-role">'+esc(r.role)+'</div><p>'+esc(r.reason)+'</p><div class="company-specialties">'+o.specializations.map(function(s){return '<span>'+esc(s)+'</span>'}).join('')+'</div><div class="company-tags">'+skills.map(function(s){return '<span class="company-tag">'+esc(s)+'</span>'}).join('')+'</div><div class="evidence-label '+(/lowongan/i.test(r.evidenceType)?"strong":"")+'">'+esc(r.evidenceType)+'</div><p class="company-note">Kualifikasi: '+esc(r.qualification)+'</p><div class="company-links">'+links(o,r)+'</div></article>'};
renderCompanies=function(){const a=filteredCompanies();$("#companyResults").textContent=a.length+" ORGANISASI UNIK";$("#companyGrid").innerHTML=a.length?a.map(companyCard).join(''):'<div class="no-results" style="grid-column:1/-1">Tidak ada organisasi yang cocok.</div>';reveal()};
companyEntry=function(o){const r=refFor(o,trackBySlug[state.active].name);return '<div class="tab-item"><span class="tab-avatar">'+esc(initials(o.name))+'</span><span class="tab-item-body"><strong>'+esc(o.name)+'</strong><small>'+esc(r.role)+'</small><span class="tab-item-note">'+esc(r.evidenceType)+', '+esc(r.qualification)+'</span><span class="tab-item-note">'+links(o,r)+'</span></span></div>'};
companiesTab=function(t){const a=companyFor(t);return '<p class="detail-eyebrow">KETERKAITAN INDUSTRI</p><h3 class="section-mini-title">'+a.length+' organisasi terkait '+esc(t.name)+'</h3><p class="detail-intro-copy">Katalog organisasi relevan, bukan daftar lowongan aktif. Lihat persyaratan pada situs resmi.</p><div class="tab-list">'+a.map(companyEntry).join('')+'</div>'};
alumniCard=function(a,i){const url=trustedUrl(a["URL LinkedIn"],true),unknown=a.degreeStatus!=="S1 Meteorologi ITB tercantum";
return '<article class="person-card reveal" style="--delay:'+Math.min(i%3*60,120)+'ms"><div class="person-top"><div class="person-avatar">'+esc(a.initials||initials(a["Nama Alumni"]))+'</div><div><h3>'+esc(a["Nama Alumni"])+'</h3><div class="person-category">'+esc(a["Kelompok Utama"])+'</div></div></div><p class="person-work">'+esc(a["Peran / Jejak Profesional"])+'</p><div class="person-institution">'+esc(a["Institusi / Sektor"])+'</div><div class="profile-status '+(unknown?"profile-caution":"")+'">'+esc(a.degreeStatus)+'</div><details><summary>Dasar klasifikasi</summary><p>'+esc(a["Alasan Klasifikasi"])+'</p><p>Pendidikan: '+esc(a["Pendidikan ITB"])+'</p><p>Kekuatan bukti: '+esc(a["Kekuatan Bukti"])+', tanggal verifikasi tidak tercatat.</p></details>'+(url?'<a class="person-link" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">Lihat LinkedIn </a>':'')+'</article>'};
const baseAlumniFilter=filteredAlumni;
filteredAlumni=function(){const d=$("#alumniDegreeFilter")?.value||"all";
 return baseAlumniFilter().filter(function(a){return d==="all"||(d==="s1"&&a.degreeStatus==="S1 Meteorologi ITB tercantum")||(d==="unknown"&&a.degreeStatus!=="S1 Meteorologi ITB tercantum")})
};
const oldOverview=overviewTab;
overviewTab=function(t){return oldOverview(t)+'<div class="feature-box"><h4>Eksplorasi berikutnya</h4><p>Lihat perbedaan bidang ini dengan pilihan lain dan mulai satu proyek portofolio.</p><p><a href="#bandingkan">Komparasi </a>, <a href="#proyek">Pustaka proyek </a></p></div>'};
const courseState=safeGet("meteopath-courses",{});
function chosen(t){const req=curriculum[t.name].filter(function(c){return c.mandatory}).map(function(c){return c.code});return uniq(req.concat((courseState[t.slug]||[]).filter(function(c){return curriculum[t.name].some(function(x){return x.code===c})}))).slice(0,4)}
courseRows=function(t){const codes=chosen(t),items=courseList(t);return items.length?items.map(function(c){return '<label class="course-row course-select"><input data-course="'+esc(c.code)+'" type="checkbox" '+(codes.includes(c.code)?"checked ":"")+(c.mandatory?"disabled ":"")+'><span class="course-code">'+esc(c.code)+'</span><span class="course-name">'+esc(c.name)+'</span><span class="course-credits">'+(c.mandatory?'<span class="tag-required">Pilihan wajib</span>':"")+' <span>'+c.credits+' SKS</span></span></label>'}).join(''):'<div class="no-results">Tidak ada mata kuliah sesuai pencarian.</div>'};
const oldCourses=coursesTab;
coursesTab=function(t){return oldCourses(t).replace('<div class="course-list" id="courseRows">','<div class="course-planner-status" role="status" id="courseStatus"><strong>Simulasi: '+(chosen(t).length*3)+'/12 SKS terpilih</strong><p>Dua pilihan wajib sudah ditandai. Centang dua mata kuliah tambahan dari paket; ini bukan IRS resmi.</p></div><div class="course-list" id="courseRows">')+'<button type="button" id="copyCourse" class="copy-course">Salin rencana mata kuliah </button>'};
/* Comparison starts empty on every visit: the visitor chooses two or three tracks. */
let comparison=[];
function drawCompare(){
  const selected=comparison.map(function(slug){return trackBySlug[slug]}).filter(Boolean);
  $("#compareOptions").innerHTML=tracks.map(function(t){
    const yes=comparison.includes(t.slug);
    return '<label class="compare-option"><input type="checkbox" value="'+esc(t.slug)+'" '+(yes?"checked ":"")+(comparison.length>=3&&!yes?"disabled ":"")+'><span>'+esc(t.name)+'</span></label>';
  }).join("");
  const stateText='<div class="compare-selection-state" role="status"><span>'+comparison.length+' dari 3 spesialisasi dipilih</span>'+(comparison.length?'<button type="button" class="compare-reset" id="compareReset">Hapus pilihan</button>':"")+'</div>';
  const result=$("#compareResult");
  result.classList.toggle("has-comparison",selected.length>=2);
  if(selected.length<2){
    result.innerHTML=stateText+'<div class="compare-empty"><strong>'+(selected.length===0?'Mulai dengan memilih dua spesialisasi':'Pilih satu spesialisasi lagi')+'</strong><p>Centang dua atau tiga bidang di atas. Tabel akan muncul setelah minimal dua spesialisasi dipilih.</p></div>';
    return;
  }
  const rows=[
    ["Fokus",function(t){return t.summary}],
    ["Mata kuliah pilihan wajib",function(t){return curriculum[t.name].filter(function(c){return c.mandatory}).map(function(c){return c.code+" "+c.name}).join("; ")}],
    ["Skill",function(t){return t.skills.slice(0,5).join(", ")}],
    ["Kegiatan profesional",function(t){return t.work}],
    ["Jalur karier",function(t){return t.careerPath.replace(/→/g,", kemudian ")}],
    ["Proyek",function(t){return t.project}]
  ];
  result.innerHTML=stateText+'<div class="compare-table-wrap"><table class="compare-table"><thead><tr><th scope="col">Aspek</th>'+selected.map(function(t){return '<th scope="col">'+esc(t.name)+'</th>'}).join('')+'</tr></thead><tbody>'+rows.map(function(row){return '<tr><th scope="row">'+esc(row[0])+'</th>'+selected.map(function(t){return '<td>'+esc(row[1](t))+'</td>'}).join('')+'</tr>'}).join('')+'<tr><th scope="row">Lihat detail</th>'+selected.map(function(t){return '<td><a data-open-track="'+esc(t.slug)+'" href="spesialisasi.html#detail?track='+esc(t.slug)+'">Buka spesialisasi</a></td>'}).join('')+'</tr></tbody></table></div><p class="compare-note">Pilihan ini hanya untuk eksplorasi. Konsultasikan mata kuliah dengan dosen wali.</p>';
}
function drawCareer(){const t=trackBySlug[$("#careerTrack").value],st=t.careerPath.split("→").map(function(x){return x.trim()}).filter(Boolean).slice(0,4);$("#careerResult").innerHTML='<div class="career-overview"><h3>'+esc(t.name)+'</h3><p>'+esc(t.work)+'</p></div><div class="career-steps">'+st.map(function(s,i){return '<div class="career-step"><small>TAHAP '+(i+1)+'</small><strong>'+esc(s)+'</strong></div>'}).join('')+'</div><p class="career-tips"><strong>Kompetensi:</strong> '+esc(t.skills.slice(0,5).join(", "))+'. <a href="#proyek" data-choose-project="'+esc(t.slug)+'">Lihat contoh proyek </a></p>'}
function drawProjects(){const tr=$("#projectTrack").value,level=$("#projectLevel").value,p=dataSetProjects().filter(function(x){return (tr==="all"||x.track===tr)&&(level==="all"||x.level===level)});$("#projectCount").textContent=p.length+" PROYEK";$("#projectGrid").innerHTML=p.length?p.map(function(x){return '<article class="project-card"><span class="project-level">'+esc(x.level)+'</span><h3>'+esc(x.title)+'</h3><small>'+esc(trackBySlug[x.track].name)+'</small><p>'+esc(x.summary)+'</p><small>Tools: '+esc(x.tools)+'</small><p><strong>Hasil:</strong> '+esc(x.output)+'</p><details><summary>Lihat langkah-langkah</summary><ol>'+x.steps.map(function(s){return '<li>'+esc(s)+'</li>'}).join('')+'</ol></details></article>'}).join(''):'<div class="no-results">Tidak ada proyek yang cocok.</div>'}
function dataSetProjects(){return dataset.projects}
let currentPlan=safeGet("meteopath-plan",null);
function planInfo(p){const t=trackBySlug[p.track]||tracks[0],phases={awal:"Tahun awal kuliah",menengah:"Tahun menengah kuliah",akhir:"Menjelang lulus",lulusan:"Lulusan baru"},actions={awal:"Kuatkan dasar kuliah dan uji minat lewat satu proyek kecil.",menengah:"Bangun portofolio lengkap dan mulai cari pengalaman riset atau magang.",akhir:"Selaraskan tugas akhir, magang, dan lamaran kerja atau studi lanjut.",lulusan:"Evaluasi persyaratan posisi entry-level dan tunjukkan bukti kompetensi."};
return {title:t.name,phase:phases[p.stage]||phases.awal,goal:p.goal||t.careerPath.split("→").slice(-1)[0].trim(),skills:p.skills,steps:[actions[p.stage]||actions.awal,"Pelajari: "+t.skills.slice(0,4).join(", ")+".","Kerjakan proyek: "+t.project,"Baca profil profesional dan persyaratan posisi yang relevan.","Diskusikan progres dengan dosen atau mentor dan evaluasi kembali rencanamu."]}}
function planText(){if(!currentPlan)return "";const p=planInfo(currentPlan);return "METEOPATH RENCANA KARIER\nSpesialisasi: "+p.title+"\nTahap: "+p.phase+"\nTarget: "+p.goal+"\nSkill awal: "+(p.skills.join(", ")||"Belum dipilih")+"\n\n"+p.steps.map(function(x,i){return (i+1)+". "+x}).join("\n")+"\nPanduan eksploratif, bukan persyaratan akademik resmi."}
function saveTxt(txt,name){const u=URL.createObjectURL(new Blob([txt],{type:"text/plain;charset=utf-8"})),a=document.createElement("a");a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},1200)}
function drawPlan(){if(!currentPlan)return;const p=planInfo(currentPlan);$("#planOutput").innerHTML='<h3>'+esc(p.title)+'</h3><p><strong>Tahap:</strong> '+esc(p.phase)+', <strong>Target:</strong> '+esc(p.goal)+'</p><p><strong>Skill awal:</strong> '+esc(p.skills.join(", ")||"Belum dipilih")+'</p><ol>'+p.steps.map(function(s){return '<li>'+esc(s)+'</li>'}).join('')+'</ol><p>Rencana ini bukan penilaian bakat atau jaminan kerja.</p><div class="plan-tools"><button type="button" id="downloadPlan">Unduh .txt</button><button type="button" id="copyPlan">Salin</button></div>'}
function initV6(){
 options($("#careerTrack"),false);options($("#projectTrack"),true);options($("#planTrack"),false);
 $("#careerTrack").addEventListener("change",drawCareer);$("#projectTrack").addEventListener("change",drawProjects);$("#projectLevel").addEventListener("change",drawProjects);
 drawCompare();drawCareer();drawProjects();
 $("#compareOptions").addEventListener("change",function(e){const c=e.target.closest("input");if(!c)return;if(c.checked&&comparison.length<3&&!comparison.includes(c.value))comparison.push(c.value);else if(!c.checked)comparison=comparison.filter(function(v){return v!==c.value});drawCompare()});
 $("#compareResult").addEventListener("click",function(e){const reset=e.target.closest("#compareReset");if(reset){comparison=[];drawCompare();return}const a=e.target.closest("[data-open-track]");if(a){e.preventDefault();window.location.assign("spesialisasi.html#detail?track="+encodeURIComponent(a.dataset.openTrack))}});
 $("#careerResult").addEventListener("click",function(e){const a=e.target.closest("[data-choose-project]");if(a){$("#projectTrack").value=a.dataset.chooseProject;drawProjects()}});
 $("#detailTabs").addEventListener("keydown",function(e){if(!["ArrowRight","ArrowLeft","Home","End"].includes(e.key))return;const tabs=$$("#detailTabs [role=tab]"),at=tabs.indexOf(document.activeElement);if(at<0)return;e.preventDefault();const i=e.key==="Home"?0:e.key==="End"?tabs.length-1:(at+(e.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length;tabs[i].focus();tabs[i].click()});
 $("#detailBody").addEventListener("change",function(e){const c=e.target.closest("input[data-course]");if(!c)return;const t=trackBySlug[state.active],list=chosen(t);if(c.checked&&list.length<4)list.push(c.dataset.course);else if(!c.checked)list.splice(list.indexOf(c.dataset.course),1);else{c.checked=false;$("#courseStatus").textContent="Maksimal 12 SKS dapat dipilih.";return}courseState[t.slug]=list;safeSet("meteopath-courses",courseState);renderDetailBody()});
 $("#detailBody").addEventListener("click",function(e){if(e.target.id!=="copyCourse")return;const t=trackBySlug[state.active],codes=chosen(t),txt="Simulasi 12 SKS untuk "+t.name+"\n"+curriculum[t.name].filter(function(c){return codes.includes(c.code)}).map(function(c){return c.code+" "+c.name+" ("+c.credits+" SKS)"}).join("\n")+"\nKonsultasikan dengan dosen wali.";if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(function(){e.target.textContent="Rencana berhasil disalin"}).catch(function(){saveTxt(txt,"meteopath-rencana-mk.txt")});else saveTxt(txt,"meteopath-rencana-mk.txt")});
 const typeFilter=$("#companyTypeFilter"),regionFilter=$("#companyRegionFilter");
function populateFilter(el,values,label){el.innerHTML='<option value="all">'+label+'</option>'+values.map(function(v){return '<option value="'+esc(v)+'">'+esc(v)+'</option>'}).join('')}
populateFilter(typeFilter,uniq(orgs.map(function(o){return o.type})).sort(),"Semua jenis");
populateFilter(regionFilter,uniq(orgs.map(function(o){return o.region})).sort(),"Semua wilayah");
[typeFilter,regionFilter,$("#companyEvidenceFilter")].forEach(function(el){el.addEventListener("change",renderCompanies)});
$("#alumniDegreeFilter").addEventListener("change",renderAlumni);
renderCompanies();renderAlumni();
const skills=$("#planSkills");skills.innerHTML=skillChoices.map(function(s){return '<label><input type="checkbox" value="'+esc(s)+'"><span>'+esc(s)+'</span></label>'}).join('');
 if(currentPlan&&trackBySlug[currentPlan.track]){$("#planTrack").value=currentPlan.track;$("#planStage").value=currentPlan.stage;$("#planGoal").value=currentPlan.goal||"";$$("#planSkills input").forEach(function(x){x.checked=currentPlan.skills.includes(x.value)});drawPlan()}
 $("#careerPlannerForm").addEventListener("submit",function(e){e.preventDefault();currentPlan={track:$("#planTrack").value,stage:$("#planStage").value,goal:$("#planGoal").value.trim(),skills:$$("#planSkills input:checked").map(function(c){return c.value})};safeSet("meteopath-plan",currentPlan);drawPlan();$("#planOutput").scrollIntoView({behavior:reduceMotion?"auto":"smooth",block:"nearest"})});
 $("#planOutput").addEventListener("click",function(e){if(e.target.id==="downloadPlan")saveTxt(planText(),"meteopath-career-plan.txt");if(e.target.id==="copyPlan"){if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(planText()).then(function(){e.target.textContent="Berhasil disalin"}).catch(function(){saveTxt(planText(),"meteopath-career-plan.txt")});else saveTxt(planText(),"meteopath-career-plan.txt")}});
 function route(){const m=location.hash.match(/^#detail\?track=([a-z0-9-]+)$/);if(m&&trackBySlug[m[1]]){window.__meteopathRouteLoading=true;selectTrack(m[1],false);window.__meteopathRouteLoading=false;$("#detail").scrollIntoView({behavior:"auto",block:"start"})}}
 route();window.addEventListener("hashchange",route)
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initV6,{once:true});else initV6()
})();