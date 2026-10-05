/* =====================================================================
   script.js - the small amount of JavaScript this website uses.
   No libraries. Nothing here is needed to READ the page: if JavaScript
   is switched off, all the content is still visible.

   What this file does:
   1. Mobile menu (open / close)
   2. Scroll progress bar + highlighting the current menu item
   3. Skill filter buttons (HSE section)
   4. CV download safety net
   5. Language switch (English <-> Arabic)
   ===================================================================== */


/* ---------------------------------------------------------------------
   0. TELL THE PAGE THAT JAVASCRIPT IS ON
   Adds the class "js" to the page. style.css uses it to tidy the skill
   lists only when JavaScript is available.
   --------------------------------------------------------------------- */
function markJavaScriptOn() {
  document.documentElement.classList.add("js");
}


/* ---------------------------------------------------------------------
   1. MOBILE MENU
   On phones the menu links are hidden. The "Menu" button shows/hides
   them. The menu also closes after you tap a link.
   --------------------------------------------------------------------- */
function setupMobileMenu() {
  const menuButton = document.getElementById("mb");
  const menu = document.getElementById("menu");

  menuButton.addEventListener("click", function () {
    const isOpen = menu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", isOpen);
  });

  menu.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
      menu.classList.remove("open");
      menuButton.setAttribute("aria-expanded", false);
    }
  });
}


/* ---------------------------------------------------------------------
   2. SCROLL PROGRESS BAR + ACTIVE MENU ITEM
   Runs every time you scroll. It (a) stretches the thin amber bar at
   the top of the page and (b) underlines the menu item of the section
   you are currently reading.
   --------------------------------------------------------------------- */
function setupScrollEffects() {
  const progressBar = document.getElementById("prog");
  const menuLinks = document.querySelectorAll("#menu a");

  function updateScrollEffects() {
    // (a) progress bar width = how far down the page you are
    const page = document.documentElement;
    const scrollableHeight = page.scrollHeight - window.innerHeight;
    const percent = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    progressBar.style.width = percent + "%";

    // (b) find the last section whose top has passed the top of the screen
    let current = "#home";
    menuLinks.forEach(function (link) {
      const section = document.querySelector(link.hash);
      if (section && section.getBoundingClientRect().top < 120) {
        current = link.hash;
      }
    });
    // at the very bottom of the page, highlight "Contact"
    if (window.innerHeight + window.scrollY >= page.scrollHeight - 4) {
      current = "#contact";
    }
    menuLinks.forEach(function (link) {
      link.classList.toggle("on", link.hash === current);
    });
  }

  window.addEventListener("scroll", updateScrollEffects, { passive: true });
  updateScrollEffects();
}


/* ---------------------------------------------------------------------
   3. SKILL FILTER (HSE section)
   The skills themselves are plain HTML in index.html
   (<div class="skill-group" data-category="...">).
   This function makes one button per group and shows only the chosen
   group. To add a new category, just add a new skill-group in the HTML.
   --------------------------------------------------------------------- */
function setupSkillFilter() {
  const groups = document.querySelectorAll(".skill-group");
  const buttonBar = document.getElementById("tabs");

  // show one group, hide the others, and mark the active button
  function showGroup(name) {
    groups.forEach(function (group) {
      group.hidden = group.dataset.category !== name;
    });
    buttonBar.querySelectorAll("button").forEach(function (button) {
      button.setAttribute("aria-pressed", button.textContent === name);
    });
  }

  groups.forEach(function (group) {
    const button = document.createElement("button");
    button.textContent = group.dataset.category;
    button.addEventListener("click", function () {
      showGroup(group.dataset.category);
    });
    buttonBar.appendChild(button);
  });

  if (groups.length > 0) {
    showGroup(groups[0].dataset.category);
  }
}


/* ---------------------------------------------------------------------
   4. CV DOWNLOAD SAFETY NET
   The "Download CV" buttons point to Mohammad-Aquib-Siddiquee-CV.pdf
   (see index.html). When the site is online, this checks that the PDF
   really exists. If you forgot to upload it, the buttons open an email
   to you instead of showing a "file not found" error.
   (When you open index.html directly from your computer this check is
   skipped.)
   --------------------------------------------------------------------- */
function setupCvLinks() {
  const emailFallback = "mailto:aquibsid.work@gmail.com?subject=CV%20request%20-%20HSE%20Officer";
  const cvLinks = document.querySelectorAll(".cv-link");
  if (!window.location.protocol.startsWith("http") || cvLinks.length === 0) {
    return;
  }
  fetch(cvLinks[0].getAttribute("href"), { method: "HEAD" })
    .then(function (response) {
      if (!response.ok) { throw new Error("CV not found"); }
    })
    .catch(function () {
      cvLinks.forEach(function (link) {
        link.setAttribute("href", emailFallback);
        link.removeAttribute("download");
      });
    });
}


/* ---------------------------------------------------------------------
   5. LANGUAGE SWITCH (English <-> Arabic)
   English is written directly in index.html. When "عربي" is pressed,
   every text that appears in ARABIC_TEXT (below) is swapped for its
   Arabic version and the page flips to right-to-left.

   HOW TO EDIT: ARABIC_TEXT works as  "English sentence": "Arabic sentence".
   The English side must match the text in index.html EXACTLY. If you
   change an English sentence in index.html, change it here too -
   otherwise that sentence simply stays English in Arabic mode.
   --------------------------------------------------------------------- */
function setupLanguageSwitch() {
  // find every plain-text element that has an Arabic translation
  const translatable = [];
  document.querySelectorAll("body *:not(script):not(style)").forEach(function (element) {
    const text = element.textContent.trim();
    const skip = element.closest(".lang, #tabs, .skill-group");
    if (element.children.length === 0 && !skip && ARABIC_TEXT[text]) {
      translatable.push({ element: element, english: text });
    }
  });

  function setLanguage(language) {
    translatable.forEach(function (item) {
      item.element.textContent = language === "ar" ? ARABIC_TEXT[item.english] : item.english;
    });
    const page = document.documentElement;
    page.lang = language;
    page.dir = language === "ar" ? "rtl" : "ltr";
    document.querySelectorAll(".lang button").forEach(function (button) {
      button.setAttribute("aria-pressed", button.dataset.l === language);
    });
    try { localStorage.setItem("lang", language); } catch (e) { /* storage blocked: ignore */ }
  }

  document.querySelectorAll(".lang button").forEach(function (button) {
    button.addEventListener("click", function () { setLanguage(button.dataset.l); });
  });

  // remember the visitor's last choice
  try {
    if (localStorage.getItem("lang") === "ar") { setLanguage("ar"); }
  } catch (e) { /* ignore */ }
}


/* ---------------------------------------------------------------------
   ARABIC TEXT (used by section 5 above)
   --------------------------------------------------------------------- */
const ARABIC_TEXT = {
  "Skip to content": "تخطَّ إلى المحتوى",
  "AQUIB": "عاقب",
  "Menu": "القائمة",
  "Home": "الرئيسية",
  "About": "نبذة",
  "Experience": "الخبرة",
  "HSE": "HSE",
  "Operations": "التشغيل",
  "Turnaround": "الإيقاف الشامل",
  "Projects": "المشاريع",
  "Certifications": "الشهادات",
  "Education": "التعليم",
  "Contact": "تواصل",
  "Saudi Arabia · Industrial HSE": "المملكة العربية السعودية · السلامة الصناعية",
  "Mohammad Aquib Siddiquee": "محمد عاقب صديقي",
  "HSE Officer — Industrial Safety | Process Operations | Power Plant | Petrochemical": "مسؤول HSE — السلامة الصناعية | تشغيل العمليات | محطات الطاقة | البتروكيماويات",
  "HSE-focused industrial professional with 4+ years of Saudi experience across power plant operations and petrochemical turnaround environments, combining frontline operations, PTW/LOTO control, shutdown coordination, and industrial automation.": "متخصص صناعي يركّز على السلامة والصحة والبيئة بخبرة تزيد على 4 سنوات في السعودية عبر تشغيل محطات الطاقة وبيئات الإيقاف الشامل في البتروكيماويات، يجمع بين التشغيل الميداني وضبط PTW/LOTO وتنسيق الإيقاف وأتمتة العمليات الصناعية.",
  "View Experience": "عرض الخبرة",
  "Download CV": "تحميل السيرة الذاتية",
  "Contact Me": "تواصل معي",
  "63 MW captive power plant": "محطة طاقة ذاتية 63 ميجاواط",
  "PTW · LOTO · Isolation": "PTW · LOTO · العزل",
  "LDPE/HDPE turnaround": "إيقاف شامل LDPE/HDPE",
  "IOSH · OSHA 30 · NEBOSH IGC in progress": "IOSH · OSHA 30 · NEBOSH IGC قيد الدراسة",
  "Captive power generation environment": "بيئة توليد طاقة ذاتية",
  "PTW activities monitored per day": "أنشطة PTW تتم مراقبتها يوميًا",
  "4+ yrs": "4+ سنوات",
  "Saudi industrial experience": "خبرة صناعية في السعودية",
  "I understand industrial safety because I have worked inside industrial operations.": "أفهم السلامة الصناعية لأنني عملت من داخل العمليات الصناعية.",
  "My path started with a B.Tech in Computer Science and Engineering, followed by training in industrial automation: DCS, PLC and SCADA. That grounding led to a control-room role at Ma’aden Gold’s 63 MW captive power plant in Saudi Arabia, where I operated six Wärtsilä engine units through DCS/SCADA.": "بدأ مساري بدرجة B.Tech في علوم وهندسة الحاسب، ثم تدريب في الأتمتة الصناعية: DCS وPLC وSCADA. قادني ذلك إلى العمل في غرفة التحكم بمحطة الطاقة الذاتية (63 ميجاواط) لدى معادن للذهب في السعودية، حيث شغّلت ست وحدات محركات Wärtsilä عبر DCS/SCADA.",
  "In that role, safety was part of the daily job. I issued and monitored Permit to Work activities, executed LOTO isolations, and coordinated with field teams during abnormal conditions, across hot work, confined space entry and electrical isolation.": "في هذا الدور كانت السلامة جزءًا من العمل اليومي: أصدرت ورصدت تصاريح العمل، ونفّذت عزل LOTO، ونسّقت مع الفرق الميدانية أثناء الظروف غير الطبيعية، في أعمال الحرارة والأماكن المحصورة والعزل الكهربائي.",
  "In 2025 I moved to Tasnee as Scheduler on the LDPE & HDPE turnaround, which gave me exposure to shutdown execution, contractor interfaces and permit-controlled field work. I am now moving toward dedicated HSE roles, building on this operational base while completing NEBOSH IGC.": "في 2025 انتقلت إلى Tasnee كمجدول في إيقاف LDPE وHDPE، ما أتاح لي الاطلاع على تنفيذ الإيقاف والتعامل مع المقاولين والأعمال الميدانية الخاضعة للتصاريح. أتجه الآن نحو وظائف HSE المتخصصة، مستفيدًا من هذه الخلفية التشغيلية بينما أُكمل NEBOSH IGC.",
  "From live plant operations to turnaround planning.": "من التشغيل الحي للمحطات إلى تخطيط الإيقاف الشامل.",
  "Employer names are shown for factual reference only and do not imply endorsement.": "أسماء الجهات مذكورة للإشارة الواقعية فقط ولا تعني أي تأييد.",
  "2022–2025 · Ma’aden Gold – DRA Global": "2022–2025 · معادن للذهب – DRA Global",
  "Nov 2025 – Apr 2026 · Tasnee": "نوفمبر 2025 – أبريل 2026 · Tasnee",
  "Next": "التالي",
  "A scheduling role, shown as such. Relevance to HSE: day-to-day exposure to a high-risk petrochemical shutdown, its contractors and permit-controlled work.": "دور جدولة، يُعرض كما هو. صلته بالسلامة: تعرّض يومي لإيقاف بتروكيماوي عالي المخاطر ومقاوليه والأعمال الخاضعة للتصاريح.",
  "Shutdown scheduling and planning": "جدولة وتخطيط الإيقاف",
  "Progress monitoring; planned vs actual tracking": "متابعة التقدم؛ مقارنة المخطط بالفعلي",
  "Daily coordination meetings": "اجتماعات التنسيق اليومية",
  "Operations, maintenance and contractor coordination": "التنسيق مع التشغيل والصيانة والمقاولين",
  "Schedule conflict resolution": "حل تعارضات الجدول",
  "Progress reporting": "رفع تقارير التقدم",
  "Primavera P6, WBS, critical path, look-ahead planning": "Primavera P6 وWBS والمسار الحرج والتخطيط المستقبلي",
  "Contractor coordination": "التنسيق مع المقاولين",
  "Project: Mansourah & Massarah · 63 MW captive power plant · 6 × Wärtsilä W20V32 TS engine units.": "المشروع: المنصورة ومسرّة · محطة طاقة ذاتية 63 ميجاواط · 6 وحدات محركات Wärtsilä W20V32 TS.",
  "Safe continuous plant operation; DCS/SCADA monitoring": "تشغيل آمن ومستمر للمحطة؛ مراقبة DCS/SCADA",
  "PTW issuance and monitoring (15–20+ activities per day)": "إصدار ومراقبة PTW (15–20+ نشاطًا يوميًا)",
  "LOTO, isolation control, electrical isolation": "LOTO وضبط العزل والعزل الكهربائي",
  "Hot work and confined space controls": "ضوابط الأعمال الحرارية والأماكن المحصورة",
  "Abnormal operating conditions": "ظروف التشغيل غير الطبيعية",
  "Field and maintenance coordination": "التنسيق الميداني ومع الصيانة",
  "Incident, near-miss and operational deviation reporting": "الإبلاغ عن الحوادث والحوادث الوشيكة والانحرافات التشغيلية",
  "Root-cause follow-up": "متابعة السبب الجذري",
  "ESD functional testing": "اختبار وظائف ESD",
  "Commissioning safety checks; startup readiness": "فحوصات سلامة التشغيل التجريبي؛ جاهزية البدء",
  "Isolation": "العزل",
  "Confined space": "الأماكن المحصورة",
  "Hot work": "الأعمال الحرارية",
  "HSE Capability": "قدرات HSE",
  "Built through live operations. Listed as capability areas, not scores.": "بُنيت من خلال التشغيل الفعلي. تُعرض كمجالات قدرات لا كدرجات.",
  "Work control": "ضبط العمل",
  "Permit to Work, LOTO, isolation control, confined space entry, hot work, work at height.": "تصاريح العمل، LOTO، ضبط العزل، دخول الأماكن المحصورة، الأعمال الحرارية، العمل على المرتفعات.",
  "Risk & compliance": "المخاطر والامتثال",
  "Risk assessment, JSA, safety inspections, contractor safety, HSE documentation.": "تقييم المخاطر، JSA، التفتيش على السلامة، سلامة المقاولين، توثيق HSE.",
  "Reporting & response": "الإبلاغ والاستجابة",
  "Incident and near-miss reporting, emergency response, root cause analysis support, corrective action tracking.": "الإبلاغ عن الحوادث والحوادث الوشيكة، الاستجابة للطوارئ، دعم تحليل السبب الجذري، متابعة الإجراءات التصحيحية.",
  "Culture": "ثقافة السلامة",
  "Behavior-based safety, toolbox talks.": "السلامة القائمة على السلوك، اجتماعات السلامة القصيرة (Toolbox Talks).",
  "Expertise filter": "تصفية الخبرات",
  "Power Plant Operations": "تشغيل محطات الطاقة",
  "Operated within a 63 MW captive power generation environment (plant capacity, not individual responsibility).": "عملت ضمن بيئة توليد طاقة ذاتية بقدرة 63 ميجاواط (سعة المحطة، وليست مسؤوليتي الفردية).",
  "Plant": "المحطة",
  "6 × Wärtsilä W20V32 TS engines and utility systems.": "6 محركات Wärtsilä W20V32 TS وأنظمة المرافق.",
  "Control": "التحكم",
  "DCS operation, SCADA monitoring, alarm handling, ESD systems.": "تشغيل DCS، مراقبة SCADA، التعامل مع الإنذارات، أنظمة ESD.",
  "Operating modes": "أوضاع التشغيل",
  "Startup, shutdown and abnormal operating conditions.": "البدء والإيقاف وظروف التشغيل غير الطبيعية.",
  "Coordination": "التنسيق",
  "Maintenance and field coordination in safety-critical operations.": "التنسيق مع الصيانة والميدان في العمليات الحرجة للسلامة.",
  "Automation systems": "أنظمة الأتمتة",
  "Technical context for safety-critical operations, not a software portfolio.": "سياق تقني للعمليات الحرجة للسلامة، وليس ملف أعمال برمجيات.",
  "Shutdown & Turnaround": "الإيقاف الدوري (Shutdown & Turnaround)",
  "LDPE & HDPE turnaround coordination at Tasnee.": "تنسيق إيقاف LDPE وHDPE في Tasnee.",
  "High-risk shutdown work is executed inside an operating environment I already know. Scheduling the turnaround exposed me to contractor interfaces, permit-controlled activities and field coordination, which complements my PTW and isolation background.": "تُنفَّذ أعمال الإيقاف عالية المخاطر داخل بيئة تشغيلية أعرفها جيدًا. وقد أتاحت لي جدولة الإيقاف الاطلاع على التعامل مع المقاولين والأنشطة الخاضعة للتصاريح والتنسيق الميداني، بما يكمّل خلفيتي في PTW والعزل.",
  "Critical path": "المسار الحرج",
  "Look-ahead planning": "التخطيط المستقبلي",
  "Planned vs actual": "المخطط مقابل الفعلي",
  "Daily coordination": "التنسيق اليومي",
  "Schedule reporting": "تقارير الجدول",
  "Corrective action tracking": "متابعة الإجراءات التصحيحية",
  "Achievements & Initiatives": "الإنجازات والمبادرات",
  "Stated as they happened, with proposals labelled as proposals.": "تُذكر كما حدثت، مع وسم المقترحات كمقترحات.",
  "Achievement": "إنجاز",
  "No major lost-time incidents": "لا حوادث كبرى مسببة لضياع وقت العمل",
  "Over 3+ years of continuous operations at Ma’aden Gold’s 63 MW plant.": "خلال أكثر من 3 سنوات من التشغيل المستمر في محطة معادن للذهب (63 ميجاواط).",
  "Compliance strengthened": "تعزيز الامتثال",
  "PTW, LOTO, confined space and work-at-height controls across contractor and direct crews.": "ضوابط PTW وLOTO والأماكن المحصورة والعمل على المرتفعات لدى فرق المقاولين والفرق المباشرة.",
  "HSE dashboards": "لوحات متابعة HSE",
  "Excel/Power BI tracking of safety observations, corrective actions and incident trends.": "متابعة ملاحظات السلامة والإجراءات التصحيحية واتجاهات الحوادث عبر Excel/Power BI.",
  "Initiative": "مبادرة",
  "Digital work request system": "نظام رقمي لطلبات العمل",
  "Paper workflow caused duplicate entry. I proposed a digital system and secured Director-level approval at Ma’aden.": "كان سير العمل الورقي يسبب تكرار إدخال البيانات. اقترحت نظامًا رقميًا وحصلت على موافقة على مستوى المدير (Director) في معادن.",
  "Recommendation": "توصية",
  "Robotic solar panel cleaning": "تنظيف الألواح الشمسية بالروبوتات",
  "Recommended for a 19,000-panel solar plant to improve yield and reduce manual cleaning exposure. The recommendation was approved and processed for fund allocation; I do not claim it was implemented.": "أوصيت به لمحطة شمسية بـ19,000 لوح لتحسين الإنتاج وتقليل التعرض للتنظيف اليدوي. تمت الموافقة على التوصية ومعالجتها لتخصيص التمويل؛ ولا أدّعي أنها نُفّذت.",
  "Completed": "مكتملة",
  "IN PROGRESS": "قيد الدراسة",
  "Ma’aden site training": "تدريب موقع معادن",
  "Fire safety, first aid, emergency response, Permit to Work, working at height.": "السلامة من الحرائق، الإسعافات الأولية، الاستجابة للطوارئ، تصاريح العمل، العمل على المرتفعات.",
  "Education & Languages": "التعليم واللغات",
  "B.Tech, Computer Science & Engineering": "بكالوريوس تقنية (B.Tech) في علوم وهندسة الحاسب",
  "Dr. A. P. J. Abdul Kalam Technical University (AKTU). Background for digital systems, data and process-control technology.": "جامعة الدكتور أ. ب. ج. عبد الكلام التقنية (AKTU). خلفية في الأنظمة الرقمية والبيانات وتقنيات التحكم في العمليات.",
  "Languages": "اللغات",
  "English: professional proficiency": "الإنجليزية: إتقان مهني",
  "Hindi / Urdu: native": "الهندية / الأردية: لغة أم",
  "Arabic: basic": "العربية: أساسي",
  "Saudi Arabia:": "السعودية:",
  "Mohammad Aquib Siddiquee · HSE Officer, Industrial Safety & Process Operations · Saudi Arabia": "محمد عاقب صديقي · مسؤول HSE، السلامة الصناعية وتشغيل العمليات · المملكة العربية السعودية",
  "Email Me": "راسلني عبر البريد",
  "Call": "اتصال",
  "WhatsApp": "واتساب",
  "Email": "البريد",
  "Scheduler – LDPE & HDPE Turnaround — Tasnee, Saudi Arabia, Nov 2025 – Apr 2026": "مجدول – إيقاف LDPE وHDPE — Tasnee، السعودية، نوفمبر 2025 – أبريل 2026",
  "Control Room Operator — Ma’aden Gold – DRA Global, Saudi Arabia, 2022–2025": "مشغّل غرفة تحكم — معادن للذهب – DRA Global، السعودية، 2022–2025",
  "Wärtsilä W20V32 TS engine units": "وحدات محركات Wärtsilä W20V32 TS",
  "Control Room Operator · 63 MW power plant": "مشغّل غرفة تحكم · محطة طاقة 63 ميجاواط",
  "Scheduler – LDPE & HDPE Turnaround · Saudi Arabia": "مجدول – إيقاف LDPE وHDPE · السعودية",
  "HSE Officer / Coordinator roles": "وظائف مسؤول / منسق HSE"
};


/* ---------------------------------------------------------------------
   START EVERYTHING when the page has loaded
   --------------------------------------------------------------------- */
markJavaScriptOn();
setupMobileMenu();
setupScrollEffects();
setupSkillFilter();
setupCvLinks();
setupLanguageSwitch();
