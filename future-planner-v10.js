/* Meteopath Future Planner v10. All records are private to this browser. */
(function () {
"use strict";
const root=document.getElementById("futurePlanner");
if(!root)return;
const dataset=window.METEOPATH_DATA||{};
const tracks=Array.isArray(dataset.specializations)?dataset.specializations:[];
const projects=Array.isArray(dataset.projects)?dataset.projects:[];
const KEY="meteopath-future-planner-v10";
const phaseOrder=["fondasi","portofolio","pengalaman","persiapan"];
const labels={fondasi:"Fondasi dan keterampilan",portofolio:"Proyek dan portofolio",pengalaman:"Pengalaman profesional",persiapan:"Persiapan tujuan"};
const goalLabels={magang:"Magang atau riset",karier:"Persiapan pekerjaan",portofolio:"Portofolio",studi:"Studi lanjut atau riset",personal:"Pengembangan diri"};
const $=sel=>root.querySelector(sel);
const $$=sel=>Array.from(root.querySelectorAll(sel));
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const now=()=>new Date();
const today=()=>toLocalDate(now());
function toLocalDate(d){return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")}
function fromISO(s){return /^\d{4}-\d{2}-\d{2}$/.test(String(s))?new Date(s+"T12:00:00"):null}
function format(s){const d=fromISO(s);return d&&Number.isFinite(d.getTime())?new Intl.DateTimeFormat("id-ID",{day:"numeric",month:"short",year:"numeric"}).format(d):"Belum ditentukan"}
function diffDays(s){const d=fromISO(s),n=fromISO(today());return d&&n?Math.round((d-n)/86400000):0}
function addDays(date,days){const d=fromISO(date)||now();d.setDate(d.getDate()+days);return toLocalDate(d)}
function dueByFraction(end,fraction){const t=fromISO(today()).getTime(),e=fromISO(end).getTime(),d=new Date(t+(e-t)*fraction);return toLocalDate(d)}
function id(){return "p"+Date.now().toString(36)+Math.random().toString(36).slice(2,8)}
function track(slug){return tracks.find(t=>t.slug===slug)||tracks[0]}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function safeRead(){try{const state=JSON.parse(localStorage.getItem(KEY)||"null");if(state&&Array.isArray(state.plans)){return {plans:state.plans.filter(p=>p&&p.id&&Array.isArray(p.tasks)).slice(0,20),activeId:state.activeId||null}}}catch(e){}return {plans:[],activeId:null}}
let state=safeRead(),editingPlan=null,editingTask=null,taskFilter="all",writingReview=false;
function persist(){
 try{localStorage.setItem(KEY,JSON.stringify(state));$("#fpLiveStatus").textContent="Perubahan terakhir tersimpan otomatis di browser.";return true}
 catch(e){$("#fpLiveStatus").textContent="Penyimpanan browser tidak tersedia. Perubahan hanya berlaku selama halaman ini terbuka.";return false}
}
function notify(s){$("#fpLiveStatus").textContent=s}
function current(){return state.plans.find(p=>p.id===state.activeId)||null}
function taskCount(p){return p.tasks.filter(t=>t.done).length}
function progress(p){return p.tasks.length?Math.round(taskCount(p)*100/p.tasks.length):0}
function chooseDefaultDate(){const d=now();d.setFullYear(d.getFullYear()+1);return toLocalDate(d)}
function formInputs(){return {title:$("#fpTitle").value.trim(),track:$("#fpTrack").value,goalType:$("#fpGoalType").value,stage:$("#fpStage").value,deadline:$("#fpDeadline").value,hours:Number($("#fpWeeklyHours").value),skills:$$('#fpSkills input:checked').map(e=>e.value),context:$("#fpContext").value.trim()}}
function renderSkills(selected){
 const t=track($("#fpTrack").value);
 if(!t)return;
 const options=[...new Set([...(t.skills||[]).slice(0,7),"Python","QGIS","Statistika","Komunikasi profesional"])].slice(0,10);
 const active=Array.isArray(selected)?selected:options.slice(0,2);
 $("#fpSkills").innerHTML=options.map(v=>'<label class="fp-check-skill"><input type="checkbox" value="'+esc(v)+'" '+(active.includes(v)?"checked":"")+'><span>'+esc(v)+'</span></label>').join("");
}
function resetForm(){
 editingPlan=null;$("#fpForm").reset();$("#fpTitle").value="";
 $("#fpDeadline").value=chooseDefaultDate();$("#fpTrack").value=tracks[0]?.slug||"";
 $("#fpStage").value="awal";$("#fpWeeklyHours").value="4";renderSkills(null);
 $("#fpSubmit").textContent="Susun rencanaku";$("#fpCancelEdit").hidden=true;
}
function fillForm(p){
 editingPlan=p.id;$("#fpTitle").value=p.title;$("#fpTrack").value=p.track;
 $("#fpGoalType").value=p.goalType;$("#fpStage").value=p.stage;
 $("#fpDeadline").value=p.deadline;$("#fpWeeklyHours").value=String(p.hours);
 $("#fpContext").value=p.context||"";renderSkills(p.skills);
 $("#fpSubmit").textContent="Simpan perubahan tujuan";$("#fpCancelEdit").hidden=false;
 $("#fpTitle").focus();$("#fpTitle").scrollIntoView({behavior:"smooth",block:"center"});
}
function createTask(name,phase,deadline,priority,notes){
 return {id:id(),title:name,phase,deadline,priority:priority||"sedang",notes:notes||"",done:false,completedAt:null};
}
function autoTasks(p){
 const t=track(p.track),skills=(p.skills.length?p.skills:(t.skills||[]).slice(0,2));
 const best=projects.filter(x=>x.track===p.track);
 const first=best[0]?.title||"Proyek analisis meteorologi";
 const second=best[1]?.title||"Proyek lanjutan";
 const goal=p.goalType;
 const endTasks={
  magang:["Identifikasi sedikitnya lima tempat magang atau laboratorium yang relevan.","Siapkan CV, portofolio, dan pesan perkenalan untuk tempat magang.","Hubungi tempat magang sesuai persyaratan lalu catat tindak lanjut."],
  karier:["Kumpulkan lima contoh posisi kerja beserta persyaratannya.","Perbarui CV, portofolio, dan profil profesional sesuai posisi target.","Latih penjelasan proyek dan lakukan simulasi wawancara."],
  portofolio:["Pilih dua karya yang paling relevan untuk menunjukkan kemampuanmu.","Rapikan dokumentasi, visualisasi, dan bukti pengujian hasil.","Minta ulasan mentor atau teman dan revisi portofolio final."],
  studi:["Identifikasi tiga kelompok riset atau program studi yang relevan.","Tulis ringkasan minat penelitian dan kaji persyaratan pendaftaran.","Hubungi calon pembimbing atau siapkan dokumen sesuai persyaratan."],
  personal:["Uji kemampuan yang sudah dipelajari melalui satu studi kasus nyata.","Minta umpan balik dan dokumentasikan perkembanganmu.","Evaluasi tujuan awal serta tentukan rencana pengembangan berikutnya."]
 };
 const rows=[
 ["Buat daftar keahlian yang dibutuhkan untuk "+(p.title||t.name)+".","fondasi","sedang","Tulis tiga keahlian inti dan sumber belajar yang akan digunakan."],
 ["Latih kemampuan "+(skills[0]||"analisis data meteorologi")+" melalui latihan terarah.","fondasi","tinggi","Sediakan bukti latihan dan jelaskan konsep yang sudah dipahami."],
 ["Pelajari "+(skills[1]||"statistika meteorologi")+" dan buat satu contoh sederhana.","fondasi","sedang","Simpan catatan belajar dan contoh penerapannya."],
 ["Pilih pertanyaan dan dataset untuk proyek "+first+".","portofolio","tinggi","Tuliskan tujuan, sumber data, periode, dan bentuk hasil akhir."],
 ["Kerjakan analisis utama untuk proyek "+first+".","portofolio","tinggi","Periksa kode, satuan, kualitas data, dan kecocokan metode."],
 ["Rangkum hasil dan keterbatasan proyek "+first+".","portofolio","tinggi","Buat halaman atau repositori yang menjelaskan proses dan output."],
 ["Cari tiga alumni atau profesional dengan pekerjaan yang menarik.","pengalaman","sedang","Catat tanggung jawab kerja dan kompetensi yang paling sering disebut."],
 ["Kerjakan studi kasus tambahan: "+second+".","pengalaman","sedang","Jadikan sebagai latihan kedua atau proyek kolaboratif."],
 ["Cari peluang mengikuti riset, kegiatan lapangan, atau komunitas profesional.","pengalaman","sedang","Buat daftar kegiatan yang benar benar dapat diikuti."],
 ...endTasks[goal].map((x,i)=>[x,"persiapan",i===2?"tinggi":"sedang","Tuliskan bukti penyelesaian yang konkret."])
 ];
 return rows.map((r,i)=>createTask(r[0],r[1],dueByFraction(p.deadline,(i+1)/13),r[2],r[3]));
}
function renderPlanList(){
 const box=$("#fpSavedPlans");
 if(!state.plans.length){box.innerHTML='<p class="fp-list-empty">Belum ada rencana tersimpan.</p>';return}
 box.innerHTML='<h4>Daftar rencanamu</h4><p>Tekan salah satu rencana untuk melihat dan mengelola progresnya.</p><div class="fp-plan-buttons">'+state.plans.map(p=>
 '<button class="fp-plan-choice'+(p.id===state.activeId?" is-active":"")+'" type="button" data-plan="'+esc(p.id)+'" aria-pressed="'+(p.id===state.activeId)+'">'+
 '<strong>'+esc(p.title)+'</strong><span>'+esc(format(p.deadline))+' · '+progress(p)+' persen selesai</span></button>').join("")+'</div>';
}
function renderMetrics(p){
 const open=p.tasks.filter(t=>!t.done);
 const late=open.filter(t=>diffDays(t.deadline)<0);
 const soon=open.filter(t=>diffDays(t.deadline)>=0&&diffDays(t.deadline)<=7);
 const remain=diffDays(p.deadline);
 $("#fpMetrics").innerHTML=[
 ["Tugas selesai",taskCount(p)+" dari "+p.tasks.length,"Pencapaian yang sudah tercentang"],
 ["Mendekati tenggat",String(soon.length),"Tujuh hari berikutnya"],
 ["Lewat tenggat",String(late.length),"Perlu dijadwalkan ulang"],
 ["Waktu tersisa",remain<0?Math.abs(remain)+" hari lewat":remain+" hari","Sampai target utama"]
 ].map(v=>'<div class="fp-metric"><span>'+esc(v[0])+'</span><strong>'+esc(v[1])+'</strong><small>'+esc(v[2])+'</small></div>').join("");
 const pct=progress(p);
 $("#fpProgressLabel").textContent=pct+" persen";
 $("#fpProgressBar").setAttribute("aria-valuenow",String(pct));
 $("#fpProgressFill").style.width=pct+"%";
 $("#fpDueSummary").textContent=pct===100?"Semua tugas telah ditandai selesai. Evaluasi apakah tujuanmu juga sudah tercapai.":late.length?late.length+" tugas melewati tenggat. Pertimbangkan untuk mengatur ulang tanggalnya.":"Kerjakan satu tugas yang paling dekat tenggatnya untuk menjaga progres.";
}
function nextTask(p){
 const candidates=p.tasks.filter(t=>!t.done).sort((a,b)=>a.deadline.localeCompare(b.deadline));
 if(!candidates.length){$("#fpNextTask").innerHTML='<strong>Semua langkah dalam rencana ini selesai.</strong><p>Tinjau kembali tujuan akhir dan catat pelajaran yang didapat.</p>';return}
 const t=candidates[0],offset=diffDays(t.deadline);
 const status=offset<0?"Lewat tenggat "+Math.abs(offset)+" hari":offset===0?"Tenggat hari ini":"Dalam "+offset+" hari";
 $("#fpNextTask").innerHTML='<div><p class="fp-eyebrow">PRIORITAS BERIKUTNYA</p><h4>'+esc(t.title)+'</h4><p>'+esc(status)+' · '+esc(format(t.deadline))+' · '+esc(labels[t.phase]||"Tahap kerja")+'</p></div>'+
 '<button type="button" data-next-done="'+esc(t.id)+'">Tandai selesai</button>';
}
function taskHTML(t){
 const days=diffDays(t.deadline),late=!t.done&&days<0,done=t.done;
 return '<article class="fp-task'+(done?" is-done":"")+(late?" is-late":"")+'">'+
 '<label class="fp-task-check"><input type="checkbox" data-toggle-task="'+esc(t.id)+'" '+(done?"checked":"")+' aria-label="Selesaikan '+esc(t.title)+'"><span class="fp-task-title">'+esc(t.title)+'</span></label>'+
 '<div class="fp-task-info"><time datetime="'+esc(t.deadline)+'">'+esc(format(t.deadline))+'</time>'+
 '<span class="fp-priority fp-priority-'+esc(t.priority)+'">'+esc("Prioritas "+t.priority)+'</span>'+
 (late?'<span class="fp-late-tag">Lewat tenggat</span>':"")+'</div>'+
 (t.notes?'<p class="fp-task-notes">'+esc(t.notes)+'</p>':"")+
 '<div class="fp-task-actions"><button type="button" data-edit-task="'+esc(t.id)+'">Ubah</button><button type="button" data-delete-task="'+esc(t.id)+'">Hapus</button></div></article>';
}
function renderMilestones(p){
 const groups=phaseOrder.map(phase=>{
 const tasks=p.tasks.filter(t=>t.phase===phase).sort((a,b)=>a.deadline.localeCompare(b.deadline));
 const filtered=tasks.filter(t=>taskFilter==="all"||(taskFilter==="open"&&!t.done)||(taskFilter==="done"&&t.done)||(taskFilter==="late"&&!t.done&&diffDays(t.deadline)<0));
 if(!filtered.length&&taskFilter!=="all")return "";
 const done=tasks.filter(t=>t.done).length;
 return '<section class="fp-phase"><header class="fp-phase-head"><div><span>'+esc(String(phaseOrder.indexOf(phase)+1).padStart(2,"0"))+'</span><h5>'+esc(labels[phase])+'</h5></div><p>'+done+' dari '+tasks.length+' tugas selesai</p></header>'+
 '<div class="fp-tasks">'+(filtered.length?filtered.map(taskHTML).join(""):'<p class="fp-phase-empty">Belum ada tugas pada tahap ini. Tambahkan tugas agar rencanamu lebih lengkap.</p>')+'</div></section>';
 });
 $("#fpMilestones").innerHTML=groups.filter(Boolean).join("")||'<p class="fp-phase-empty">Tidak ada tugas yang sesuai dengan filter ini.</p>';
}
function render(){
 renderPlanList();
 const p=current(),has=!!p;
 $("#fpEmpty").hidden=has;$("#fpDashboard").hidden=!has;
 if(!p)return;
 $("#fpActiveTitle").textContent=p.title;
 const t=track(p.track);
 $("#fpActiveMeta").textContent=(t?.name||"Meteorologi")+" · "+(goalLabels[p.goalType]||"Target pribadi")+" · "+format(p.deadline)+" · "+p.hours+" jam belajar per minggu";
 renderMetrics(p);nextTask(p);renderMilestones(p);
 if(!writingReview)$("#fpReviewText").value=p.review||"";
 $("#fpReviewDate").textContent=p.reviewedAt?"Terakhir direview "+format(p.reviewedAt):"Belum pernah direview";
}
function formError(message,el){notify(message);if(el)el.focus()}
function saveGoal(e){
 e.preventDefault();
 const x=formInputs(),when=fromISO(x.deadline);
 if(!x.title){formError("Isi nama rencana terlebih dahulu.",$("#fpTitle"));return}
 if(!when||!Number.isFinite(when.getTime())||diffDays(x.deadline)<=0){formError("Tanggal target harus sesudah hari ini.",$("#fpDeadline"));return}
 if(!track(x.track)){formError("Pilih spesialisasi.",$("#fpTrack"));return}
 if(editingPlan){
 const p=state.plans.find(x=>x.id===editingPlan);if(!p){resetForm();return}
 Object.assign(p,x,{updatedAt:today()});
 state.activeId=p.id;notify("Tujuan telah diperbarui. Tanggal tugas yang sudah dibuat tetap dipertahankan dan dapat diedit.");
 }else{
 if(state.plans.length>=20){formError("Maksimal 20 rencana tersimpan. Hapus rencana lama sebelum menambah lagi.");return}
 const p={...x,id:id(),createdAt:today(),updatedAt:today(),review:"",reviewedAt:null,tasks:[]};
 p.tasks=autoTasks(p);state.plans.unshift(p);state.activeId=p.id;
 notify("Rencana berhasil dibuat. Silakan ubah tugas dan tenggat sesuai kondisi nyata.");
 }
 persist();resetForm();render();
 $("#fpDashboard").scrollIntoView({behavior:"smooth",block:"start"});
}
function removePlan(){
 const p=current();if(!p)return;
 if(!confirm('Hapus rencana "'+p.title+'"? Semua progres dan tugas dalam rencana ini akan terhapus dari browser.'))return;
 state.plans=state.plans.filter(x=>x.id!==p.id);state.activeId=state.plans[0]?.id||null;
 editingTask=null;resetForm();persist();render();notify("Rencana telah dihapus dari browser.");
}
function setTaskDone(taskId,isDone){
 const p=current(),t=p?.tasks.find(x=>x.id===taskId);if(!t)return;
 t.done=isDone;t.completedAt=isDone?today():null;p.updatedAt=today();persist();render();
}
function resetTaskForm(){
 editingTask=null;$("#fpTaskForm").reset();
 $("#fpTaskDate").value=addDays(today(),7);
 $("#fpTaskFormTitle").textContent="Tambahkan tugas sendiri";
 $("#fpTaskSubmit").textContent="Tambah tugas";
 $("#fpTaskCancel").hidden=true;
}
function editTask(taskId){
 const t=current()?.tasks.find(x=>x.id===taskId);if(!t)return;
 editingTask=taskId;$("#fpTaskTitle").value=t.title;$("#fpTaskPhase").value=t.phase;
 $("#fpTaskDate").value=t.deadline;$("#fpTaskPriority").value=t.priority;$("#fpTaskNotes").value=t.notes||"";
 $("#fpTaskFormTitle").textContent="Ubah tugas";
 $("#fpTaskSubmit").textContent="Simpan perubahan tugas";$("#fpTaskCancel").hidden=false;
 $("#fpTaskEditor").scrollIntoView({behavior:"smooth",block:"center"});
 $("#fpTaskTitle").focus();
}
function saveTask(e){
 e.preventDefault();const p=current();if(!p)return;
 const title=$("#fpTaskTitle").value.trim(),phase=$("#fpTaskPhase").value,deadline=$("#fpTaskDate").value,
 priority=$("#fpTaskPriority").value,notes=$("#fpTaskNotes").value.trim();
 if(!title||!fromISO(deadline)||!phaseOrder.includes(phase)){notify("Masukkan judul, tahap, dan tenggat tugas yang valid.");return}
 if(editingTask){const t=p.tasks.find(x=>x.id===editingTask);if(t)Object.assign(t,{title,phase,deadline,priority,notes})}
 else {if(p.tasks.length>=150){notify("Maksimal 150 tugas untuk setiap rencana.");return}p.tasks.push(createTask(title,phase,deadline,priority,notes))}
 p.updatedAt=today();persist();resetTaskForm();render();notify("Tugas tersimpan. Progres diperbarui.");
}
function deleteTask(taskId){
 const p=current(),t=p?.tasks.find(x=>x.id===taskId);if(!t)return;
 if(!confirm('Hapus tugas "'+t.title+'"?'))return;
 p.tasks=p.tasks.filter(x=>x.id!==taskId);p.updatedAt=today();persist();render();notify("Tugas telah dihapus.");
 if(editingTask===taskId)resetTaskForm();
}
function saveReview(){
 const p=current();if(!p)return;
 p.review=$("#fpReviewText").value.trim();p.reviewedAt=today();p.updatedAt=today();
 writingReview=false;persist();render();notify("Evaluasi telah disimpan. Kamu dapat mengubahnya lagi kapan saja.");
}
function init(){
 $("#fpTrack").innerHTML=tracks.map(t=>'<option value="'+esc(t.slug)+'">'+esc(t.name)+'</option>').join("");
 $("#fpDeadline").min=addDays(today(),1);
 $("#fpTaskDate").min="";
 resetForm();resetTaskForm();
 $("#fpTrack").addEventListener("change",()=>renderSkills(null));
 $("#fpForm").addEventListener("submit",saveGoal);
 $("#fpCancelEdit").addEventListener("click",resetForm);
 $("#fpSavedPlans").addEventListener("click",e=>{
 const choice=e.target.closest("[data-plan]");if(!choice)return;
 state.activeId=choice.dataset.plan;taskFilter="all";$("#fpTaskFilter").value="all";
 resetTaskForm();persist();render();
 });
 $("#fpEditGoal").addEventListener("click",()=>{const p=current();if(p)fillForm(p)});
 $("#fpDeletePlan").addEventListener("click",removePlan);
 $("#fpTaskFilter").addEventListener("change",e=>{taskFilter=e.target.value;const p=current();if(p)renderMilestones(p)});
 $("#fpMilestones").addEventListener("change",e=>{
 const cb=e.target.closest("[data-toggle-task]");if(cb)setTaskDone(cb.dataset.toggleTask,cb.checked)
 });
 $("#fpMilestones").addEventListener("click",e=>{
 const edit=e.target.closest("[data-edit-task]"),del=e.target.closest("[data-delete-task]");
 if(edit)editTask(edit.dataset.editTask);
 if(del)deleteTask(del.dataset.deleteTask)
 });
 $("#fpNextTask").addEventListener("click",e=>{
 const b=e.target.closest("[data-next-done]");if(b)setTaskDone(b.dataset.nextDone,true)
 });
 $("#fpTaskForm").addEventListener("submit",saveTask);
 $("#fpTaskCancel").addEventListener("click",resetTaskForm);
 $("#fpReviewText").addEventListener("input",()=>{writingReview=true;notify("Catatan evaluasi belum disimpan. Tekan Simpan evaluasi saat selesai.")});
 $("#fpSaveReview").addEventListener("click",saveReview);
 if(!state.activeId&&state.plans.length)state.activeId=state.plans[0].id;
 render();
 if(state.plans.length)notify("Rencana sebelumnya berhasil dimuat dari browser ini.");
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();