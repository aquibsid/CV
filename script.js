const categories = {

  "HSE": [
    "Risk assessment",
    "JSA",
    "Permit to Work",
    "LOTO",
    "Isolation control",
    "Confined space",
    "Hot work",
    "Work at height",
    "Incident & near-miss reporting",
    "Emergency response",
    "Contractor safety",
    "Safety inspections",
    "Behavior-based safety",
    "Toolbox talks",
    "RCA support"
  ],

  "Plant Operations": [
    "Power plant operation",
    "Alarm handling",
    "Startup / shutdown",
    "Abnormal operations",
    "Utility systems",
    "Maintenance coordination"
  ],

  "Process Control": [
    "Yokogawa CENTUM VP",
    "ProSafe-RS",
    "Siemens S7-1500",
    "STARDOM PLC",
    "SCADA",
    "Wonderware / InTouch",
    "Foundation Fieldbus",
    "DCS",
    "SIS",
    "PLC",
    "ESD"
  ],

  "Shutdown / Turnaround": [
    "LDPE / HDPE",
    "Shutdown coordination",
    "Contractor interfaces",
    "Planned vs actual",
    "Progress tracking"
  ],

  "Planning": [
    "Primavera P6",
    "WBS",
    "Critical path",
    "Look-ahead planning",
    "Progress reporting"
  ],

  "Data & Reporting": [
    "Advanced Excel",
    "Power BI",
    "Safety observation tracking",
    "Incident trend analysis",
    "Corrective action tracking",
    "Management reporting"
  ]

};


/* LANGUAGE */

const translations = {

  "Skip to content": "تخطَّ إلى المحتوى",
  "About": "نبذة",
  "Experience": "الخبرة",
  "Operations": "التشغيل",
  "Projects": "المشاريع",
  "Education": "التعليم",
  "Credentials": "المؤهلات",
  "Contact": "تواصل",
  "Menu": "القائمة",

  "SAUDI ARABIA · INDUSTRIAL HSE":
    "المملكة العربية السعودية · السلامة الصناعية",

  "HSE Officer · Industrial Safety · Process Operations":
    "مسؤول HSE · السلامة الصناعية · تشغيل العمليات",

  "COMPLETED":
    "مكتملة",

  "IN PROGRESS":
    "قيد الدراسة"

};


/* HELPERS */

const $ = selector =>
  document.querySelector(selector);

const $$ = selector =>
  document.querySelectorAll(selector);


/* SKILLS */

function initSkills() {

  const filter = $("#filter");
  const skills = $("#skills");

  Object.keys(categories).forEach(name => {

    const button = document.createElement("button");

    button.textContent = name;
    button.type = "button";

    button.addEventListener("click", () => {
      showSkills(name);
    });

    filter.appendChild(button);

  });


  function showSkills(name) {

    filter
      .querySelectorAll("button")
      .forEach(button => {

        button.classList.toggle(
          "active",
          button.textContent === name
        );

      });


    skills.innerHTML = "";


    categories[name].forEach((skill, index) => {

      const span = document.createElement("span");

      span.textContent = skill;

      span.style.animationDelay =
        `${index * 18}ms`;

      skills.appendChild(span);

    });

  }


  showSkills(Object.keys(categories)[0]);

}


/* MOBILE MENU */

function initMenu() {

  const button = $("#menuBtn");
  const menu = $("#menu");

  button.addEventListener("click", () => {

    const open =
      menu.classList.toggle("open");

    button.setAttribute(
      "aria-expanded",
      open
    );

  });


  menu.addEventListener("click", event => {

    if (event.target.matches("a")) {

      menu.classList.remove("open");

      button.setAttribute(
        "aria-expanded",
        "false"
      );

    }

  });

}


/* SCROLL PROGRESS + ACTIVE NAV */

function initScroll() {

  const progress = $("#progress");

  const links =
    [...$$("nav a[href^='#']")];


  function update() {

    const documentElement =
      document.documentElement;


    const scrollPercent =
      scrollY /
      (documentElement.scrollHeight - innerHeight) *
      100;


    progress.style.width =
      `${Math.min(100, scrollPercent)}%`;


    let current = "#home";


    $$("main section[id], header[id]")
      .forEach(section => {

        if (
          section.getBoundingClientRect().top < 140
        ) {

          current =
            `#${section.id}`;

        }

      });


    links.forEach(link => {

      link.classList.toggle(
        "active",
        link.getAttribute("href") === current
      );

    });

  }


  addEventListener(
    "scroll",
    update,
    { passive: true }
  );


  update();

}


/* SCROLL REVEAL */

function initReveal() {

  const items =
    $$(".reveal");


  if (!("IntersectionObserver" in window)) {

    items.forEach(item => {
      item.classList.add("visible");
    });

    return;
  }


  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            observer.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.12
      }
    );


  items.forEach(item => {

    observer.observe(item);

  });

}


/* NUMBER COUNTERS */

function initCounters() {

  const elements =
    $$("[data-count]");


  if (!("IntersectionObserver" in window)) {

    elements.forEach(element => {

      setCounter(element);

    });

    return;
  }


  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            setCounter(entry.target);

            observer.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.7
      }
    );


  elements.forEach(element => {

    observer.observe(element);

  });


  function setCounter(element) {

    const target =
      Number(element.dataset.count);

    const suffix =
      element.dataset.suffix || "";


    let start = 0;

    const duration = 900;

    const startTime =
      performance.now();


    function tick(now) {

      const progress =
        Math.min(
          1,
          (now - startTime) / duration
        );


      const eased =
        1 - Math.pow(1 - progress, 3);


      const value =
        Math.round(
          start +
          (target - start) * eased
        );


      element.textContent =
        `${value}${suffix}`;


      if (progress < 1) {

        requestAnimationFrame(tick);

      }

    }


    requestAnimationFrame(tick);

  }

}


/* LANGUAGE SWITCH */

function initLanguage() {

  const buttons =
    $$(".lang");


  buttons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const language =
          button.dataset.lang;


        document.documentElement.lang =
          language;


        document.documentElement.dir =
          language === "ar"
            ? "rtl"
            : "ltr";


        buttons.forEach(item => {

          item.classList.toggle(
            "active",
            item === button
          );

        });


        $$("body *").forEach(element => {

          if (element.children.length === 0) {

            const original =
              element.dataset.en ||
              element.textContent.trim();


            if (translations[original]) {

              element.dataset.en =
                original;


              element.textContent =
                language === "ar"
                  ? translations[original]
                  : original;

            }

          }

        });


        try {

          localStorage.setItem(
            "aquib-lang",
            language
          );

        } catch (error) {}

      }
    );

  });


  try {

    if (
      localStorage.getItem("aquib-lang") === "ar"
    ) {

      document
        .querySelector(".lang[data-lang='ar']")
        .click();

    }

  } catch (error) {}

}


/* START */

initSkills();
initMenu();
initScroll();
initReveal();
initCounters();
initLanguage();
