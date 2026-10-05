const categories={
"HSE":["Risk assessment","JSA","Permit to Work","LOTO","Isolation control","Confined space","Hot work","Work at height","Incident & near-miss reporting","Emergency response","Contractor safety","Safety inspections","Behavior-based safety","Toolbox talks","RCA support"],
"Plant Operations":["Power plant operation","Alarm handling","Startup/shutdown","Abnormal operations","Utility systems","Maintenance coordination"],
"Process Control":["Yokogawa CENTUM VP","ProSafe-RS","Siemens S7-1500","STARDOM PLC","SCADA","Wonderware / InTouch","Foundation Fieldbus","DCS","SIS","PLC","ESD"],
"Shutdown / Turnaround":["LDPE / HDPE","Shutdown coordination","Contractor interfaces","Planned vs actual","Progress tracking"],
"Planning":["Primavera P6","WBS","Critical path","Look-ahead planning","Progress reporting"],
"Data & Reporting":["Advanced Excel","Power BI","Safety observation tracking","Incident trend analysis","Corrective action tracking","Management reporting"]
};

const translations={
"Skip to content":"تخطَّ إلى المحتوى","Home":"الرئيسية","About":"نبذة","Experience":"الخبرة","HSE":"HSE","Operations":"التشغيل","Turnaround":"الإيقاف الشامل","Projects":"المشاريع","Certifications":"الشهادات","Education":"التعليم","Contact":"تواصل","Menu":"القائمة",
"Saudi Arabia · Industrial HSE":"المملكة العربية السعودية · السلامة الصناعية",
"HSE Officer — Industrial Safety | Process Operations | Power Plant | Petrochemical":"مسؤول HSE — السلامة الصناعية | تشغيل العمليات | محطات الطاقة | البتروكيماويات",
"JAN 2026 — PRESENT":"يناير 2026 — حتى الآن","2022 — 2025":"2022 — 2025",
"Saudi/GCC HSE, industrial safety, operations and turnaround opportunities.":"فرص HSE والسلامة الصناعية والتشغيل والإيقاف الشامل في السعودية ودول الخليج.",
"COMPLETED":"مكتملة","IN PROGRESS":"قيد الدراسة"
};

const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

function initSkills(){
 const filter=$("#filter"), skills=$("#skills");
 Object.keys(categories).forEach((name,i)=>{
   const b=document.createElement("button"); b.textContent=name; b.type="button";
   b.onclick=()=>show(name); filter.appendChild(b);
 });
 function show(name){
   filter.querySelectorAll("button").forEach(b=>b.classList.toggle("active",b.textContent===name));
   skills.innerHTML="";
   categories[name].forEach(x=>{const s=document.createElement("span");s.textContent=x;skills.appendChild(s)});
 }
 show(Object.keys(categories)[0]);
}

function initMenu(){
 const btn=$("#menuBtn"), menu=$("#menu");
 btn.onclick=()=>{const open=menu.classList.toggle("open");btn.setAttribute("aria-expanded",open)};
 menu.onclick=e=>{if(e.target.matches("a")){menu.classList.remove("open");btn.setAttribute("aria-expanded","false")}};
}

function initScroll(){
 const progress=$("#progress"), links=[...$$("nav a[href^='#']")];
 addEventListener("scroll",()=>{
   const d=document.documentElement;
   progress.style.width=(scrollY/(d.scrollHeight-innerHeight)*100)+"%";
   links.forEach(a=>a.classList.remove("active"));
   let current="";
   $$("main section[id],header[id]").forEach(s=>{if(s.getBoundingClientRect().top<130)current="#"+s.id});
   const a=links.find(x=>x.getAttribute("href")===current); if(a)a.classList.add("active");
 },{passive:true});
}

function initLanguage(){
 const buttons=$$(".lang");
 buttons.forEach(btn=>btn.onclick=()=>{
   const lang=btn.dataset.lang;
   document.documentElement.lang=lang; document.documentElement.dir=lang==="ar"?"rtl":"ltr";
   buttons.forEach(b=>b.classList.toggle("active",b===btn));
   // Translate only exact standalone UI strings; technical terms remain unchanged.
   $$("body *").forEach(el=>{
     if(el.children.length===0){
       const original=el.dataset.en||el.textContent.trim();
       if(translations[original]){el.dataset.en=original;el.textContent=lang==="ar"?translations[original]:original}
     }
   });
   try{localStorage.setItem("aquib-lang",lang)}catch(e){}
 });
 try{if(localStorage.getItem("aquib-lang")==="ar")$(".lang[data-lang='ar']").click()}catch(e){}
}

initSkills();initMenu();initScroll();initLanguage();
