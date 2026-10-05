/* =========================================================
   AQUIB CV WEBSITE
   MAIN JAVASCRIPT
   ========================================================= */

document.documentElement.classList.add("js-ready");


/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];


/* ---------------------------------------------------------
   YEAR
--------------------------------------------------------- */

const year = $("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}


/* ---------------------------------------------------------
   MOBILE MENU
--------------------------------------------------------- */

const menuBtn = $("#menuBtn");
const mobileMenu = $("#mobileMenu");

if (menuBtn && mobileMenu) {

  menuBtn.addEventListener("click", () => {

    mobileMenu.classList.toggle("open");

  });


  $$(".mobile-menu a").forEach(link => {

    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
    });

  });

}


/* ---------------------------------------------------------
   SCROLL PROGRESS
--------------------------------------------------------- */

const scrollProgress = $("#scrollProgress");

function updateScrollProgress() {

  if (!scrollProgress) return;

  const scrollTop =
    window.scrollY ||
    document.documentElement.scrollTop;

  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  const progress =
    height > 0
      ? (scrollTop / height) * 100
      : 0;

  scrollProgress.style.width = `${progress}%`;

}

window.addEventListener(
  "scroll",
  updateScrollProgress,
  { passive: true }
);

updateScrollProgress();


/* ---------------------------------------------------------
   SCROLL REVEAL
--------------------------------------------------------- */

const revealElements = $$(".reveal");

if ("IntersectionObserver" in window) {

  const revealObserver = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add("visible");

          revealObserver.unobserve(entry.target);

        }

      });

    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -50px 0px"
    }
  );


  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

} else {

  revealElements.forEach(element => {
    element.classList.add("visible");
  });

}


/* ---------------------------------------------------------
   COUNTERS
--------------------------------------------------------- */

const counters = $$("[data-counter]");

function animateCounter(element) {

  const target =
    Number(element.dataset.counter);

  if (!Number.isFinite(target)) return;

  const duration = 1200;
  const start = performance.now();

  function update(now) {

    const progress =
      Math.min((now - start) / duration, 1);

    const eased =
      1 - Math.pow(1 - progress, 3);

    element.textContent =
      Math.round(target * eased);

    if (progress < 1) {
      requestAnimationFrame(update);
    }

  }

  requestAnimationFrame(update);
}


if ("IntersectionObserver" in window) {

  const counterObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            animateCounter(entry.target);

            counterObserver.unobserve(entry.target);

          }

        });

      },
      {
        threshold: .6
      }
    );


  counters.forEach(counter => {
    counterObserver.observe(counter);
  });

}


/* ---------------------------------------------------------
   HSE FILTERS
--------------------------------------------------------- */

const filterButtons = $$(".filter-btn");
const skillCards = $$(".skill-card");

filterButtons.forEach(button => {

  button.addEventListener("click", () => {

    const filter =
      button.dataset.filter;

    filterButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");


    skillCards.forEach(card => {

      const category =
        card.dataset.category;

      if (
        filter === "all" ||
        category === filter
      ) {

        card.classList.remove("hidden");

      } else {

        card.classList.add("hidden");

      }

    });

  });

});


/* ---------------------------------------------------------
   LANGUAGE SWITCHER
--------------------------------------------------------- */

const languageButtons =
  $$(".language-btn");

const translatableElements =
  $$("[data-en][data-ar]");


function setLanguage(language) {

  const isArabic =
    language === "ar";

  document.documentElement.lang =
    isArabic ? "ar" : "en";

  document.documentElement.dir =
    isArabic ? "rtl" : "ltr";


  translatableElements.forEach(element => {

    const text =
      isArabic
        ? element.dataset.ar
        : element.dataset.en;

    if (text) {
      element.textContent = text;
    }

  });


  languageButtons.forEach(button => {

    button.classList.toggle(
      "active",
      button.dataset.lang === language
    );

  });


  try {

    localStorage.setItem(
      "aquib-language",
      language
    );

  } catch (error) {

    /* localStorage may be blocked */

  }

}


languageButtons.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      setLanguage(
        button.dataset.lang
      );

    }
  );

});


/* ---------------------------------------------------------
   RESTORE LANGUAGE
--------------------------------------------------------- */

let savedLanguage = "en";

try {

  savedLanguage =
    localStorage.getItem(
      "aquib-language"
    ) || "en";

} catch (error) {

  savedLanguage = "en";

}

setLanguage(savedLanguage);


/* ---------------------------------------------------------
   LOGO FALLBACK
--------------------------------------------------------- */

$$("img").forEach(image => {

  image.addEventListener("error", () => {

    image.style.display = "none";

    const parent =
      image.parentElement;

    if (!parent) return;

    if (
      parent.classList.contains("maaden-brand") ||
      parent.classList.contains("maaden-strip")
    ) {

      const fallback =
        document.createElement("strong");

      fallback.textContent =
        "MA'ADEN";

      fallback.style.color =
        "#b4ef5a";

      fallback.style.fontSize =
        "20px";

      parent.appendChild(fallback);

    }

    if (
      parent.classList.contains("dra-brand") ||
      parent.classList.contains("dra-strip")
    ) {

      const fallback =
        document.createElement("strong");

      fallback.textContent =
        "DRA GLOBAL";

      fallback.style.color =
        "#111";

      fallback.style.fontSize =
        "17px";

      parent.appendChild(fallback);

    }

  });

});


/* ---------------------------------------------------------
   ACTIVE NAVIGATION
--------------------------------------------------------- */

const sections =
  $$("main section[id]");

const navLinks =
  $$(".desktop-nav a");

if ("IntersectionObserver" in window) {

  const navObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting)
            return;

          const id =
            entry.target.id;

          navLinks.forEach(link => {

            link.style.color = "";

            if (
              link.getAttribute("href") ===
              `#${id}`
            ) {

              link.style.color =
                "var(--green)";

            }

          });

        });

      },
      {
        threshold: .25,
        rootMargin: "-20% 0px -60% 0px"
      }
    );


  sections.forEach(section => {
    navObserver.observe(section);
  });

}


/* ---------------------------------------------------------
   CLOSE MOBILE MENU ON ESC
--------------------------------------------------------- */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape" &&
      mobileMenu
    ) {

      mobileMenu.classList.remove(
        "open"
      );

    }

  }
);


/* ---------------------------------------------------------
   SAFETY FALLBACK
--------------------------------------------------------- */

window.addEventListener(
  "error",
  event => {

    /*
      A JavaScript error should never make
      the website invisible.
    */

    console.warn(
      "Website script warning:",
      event.message
    );

  }
);
