/* Meteopath scroll appearance v10.
   Gentle bubble reveal as sections enter viewport.
   The document remains fully visible when JS is disabled or motion is reduced. */
(function(){
 "use strict";
 const main=document.querySelector("main");
 if(!main)return;
 const reduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 if(reduced||!("IntersectionObserver" in window))return;
 const targets=[
  "main > section:not(.hero) > .wrap > .section-heading",
  "main > section:not(.hero) > .wrap > .page-title-row",
  "main > section:not(.hero) > .wrap > .compare-shell",
  "main > section:not(.hero) > .wrap > .detail-shell",
  "main > section:not(.hero) > .wrap > .career-explorer",
  "main > section:not(.hero) > .wrap > .planner-layout",
  "main > section:not(.hero) > .wrap > .fp-layout",
  "main > section:not(.hero) > .wrap > .closing-card",
  "main > section:not(.hero) > .wrap > .home-about-layout",
  "main > section:not(.hero) > .wrap > .fp-how-it-works",
  "main .home-feature",
  "main .spec-card",
  "main .person-card",
  "main .company-card",
  "main .journey-card",
  "main .method-grid article",
  "main .project-card",
  "main .career-role-card",
  "main .career-info-block",
  "main .career-timeline-item",
  "main .fp-how-it-works article"
 ].join(",");
 const observed=new WeakSet();
 let index=0,scheduled=false;
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries){
   if(!entry.isIntersecting)continue;
   const e=entry.target;
   e.classList.add("sb-shown");
   e.classList.remove("sb-pending");
   observer.unobserve(e);
  }
 },{root:null,rootMargin:"0px 0px -38px 0px",threshold:0.06});
 function update(){
  scheduled=false;
  main.querySelectorAll(targets).forEach(el=>{
   if(observed.has(el))return;
   // Content hidden by page routing should not animate after becoming visible.
   if(el.closest("[hidden]"))return;
   observed.add(el);
   el.classList.add("sb-reveal","sb-pending");
   el.style.setProperty("--sb-delay",String((index%4)*65)+"ms");
   index++;
   observer.observe(el);
  });
 }
 function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(update)}
 document.documentElement.classList.add("sb-enabled");
 schedule();
 const mutations=new MutationObserver(schedule);
 mutations.observe(main,{subtree:true,childList:true});
 window.addEventListener("pagehide",()=>{mutations.disconnect();observer.disconnect()},{once:true});
})();
