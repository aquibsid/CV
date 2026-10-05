/* =========================================================
   AQUIB CV WEBSITE
   Main interactions
   ========================================================= */

document.documentElement.classList.add("js-ready");

document.addEventListener("DOMContentLoaded", () => {

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


  /* =======================================================
     CURRENT YEAR
     ======================================================= */

  const yearElement = $("#currentYear");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  /* =======================================================
     MOBILE MENU
     ======================================================= */

  const menuToggle = $("#menuToggle");
  const mobileNav = $("#mobileNav");

  if (menuToggle && mobileNav) {

    menuToggle.addEventListener("click", () => {

      const isOpen = mobileNav.classList.toggle("open");

      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));

      document.body.classList.toggle("menu-open", isOpen);
    });


    $$("#mobileNav a").forEach(link => {

      link.addEventListener("click", () => {

        mobileNav.classList.remove("open");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");

        document.body.classList.remove("menu-open");
      });

    });
  }


  /* =======================================================
     SCROLL PROGRESS
     ======================================================= */

  const scrollProgress = $("#scrollProgress");

  const updateScrollProgress = () => {

    if (!scrollProgress) return;

    const scrollTop = window.scrollY;

    const documentHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress =
      documentHeight > 0
        ? (scrollTop / documentHeight) * 100
        : 0;

    scrollProgress.style.width = `${progress}%`;
  };

  window.addEventListener("scroll", updateScrollProgress, {
    passive: true
  });

  updateScrollProgress();


  /* =======================================================
     HEADER SHADOW
     ======================================================= */

  const header = $("#siteHeader");

  const updateHeader = () => {

    if (!header) return;

    header.classList.toggle(
      "scrolled",
      window.scrollY > 20
    );
  };

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  updateHeader();


  /* =======================================================
     SCROLL REVEAL
     ======================================================= */

  const revealElements = $$(".reveal");

  const reducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {

    revealElements.forEach(element => {
      element.classList.add("visible");
    });

  } else if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");

          observer.unobserve(entry.target);
        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
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


  /* =======================================================
     COUNTERS
     ======================================================= */

  const counters = $$(".counter");

  const animateCounter = element => {

    const target = Number(element.dataset.target || 0);
    const suffix = element.dataset.suffix || "";

    if (reducedMotion) {
      element.textContent = `${target}${suffix}`;
      return;
    }

    const duration = 1200;
    const startTime = performance.now();

    const update = currentTime => {

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased =
        1 - Math.pow(1 - progress, 3);

      const current =
        Math.round(target * eased);

      element.textContent = `${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      }

    };

    requestAnimationFrame(update);
  };


  if ("IntersectionObserver" in window) {

    const counterObserver = new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) return;

          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        });

      },
      {
        threshold: .7
      }
    );

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });

  } else {

    counters.forEach(counter => {
      animateCounter(counter);
    });

  }


  /* =======================================================
     ACTIVE NAVIGATION
     ======================================================= */

  const sections = $$("main section[id]");
  const navLinks = $$(".desktop-nav a");

  if ("IntersectionObserver" in window) {

    const navObserver = new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) return;

          const id = entry.target.id;

          navLinks.forEach(link => {

            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${id}`
            );

          });

        });

      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
      }
    );

    sections.forEach(section => {
      navObserver.observe(section);
    });
  }


  /* =======================================================
     HSE FILTERS
     ======================================================= */

  const filterButtons = $$(".filter-btn");
  const skillCards = $$(".skill-card");

  filterButtons.forEach(button => {

    button.addEventListener("click", () => {

      const filter = button.dataset.filter;

      filterButtons.forEach(item => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      skillCards.forEach(card => {

        const category = card.dataset.category;

        const shouldShow =
          filter === "all" ||
          category === filter;

        card.classList.toggle(
          "hidden",
          !shouldShow
        );

      });

    });

  });


  /* =======================================================
     LANGUAGE SWITCHER
     ======================================================= */

  const languageButtons = $$(".lang-btn");

  const translatableElements =
    $$("[data-en][data-ar]");

  const setLanguage = language => {

    const isArabic = language === "ar";

    document.documentElement.lang =
      isArabic ? "ar" : "en";

    document.documentElement.dir =
      isArabic ? "rtl" : "ltr";

    translatableElements.forEach(element => {

      const translation =
        isArabic
          ? element.dataset.ar
          : element.dataset.en;

      if (translation) {
        element.textContent = translation;
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
      /* localStorage may be unavailable */
    }
  };


  languageButtons.forEach(button => {

    button.addEventListener("click", () => {

      const language =
        button.dataset.lang || "en";

      setLanguage(language);
    });

  });


  /* Load saved language */

  let savedLanguage = "en";

  try {

    const stored =
      localStorage.getItem("aquib-language");

    if (stored === "ar" || stored === "en") {
      savedLanguage = stored;
    }

  } catch (error) {
    /* Ignore storage errors */
  }

  setLanguage(savedLanguage);


  /* =======================================================
     LOGO FALLBACK
     ======================================================= */

  $$("img").forEach(image => {

    image.addEventListener("error", () => {

      image.style.display = "none";

      const fallback =
        image.parentElement?.querySelector(".logo-fallback");

      if (fallback) {
        fallback.style.display = "block";
      }

    });

  });


  /* =======================================================
     CLOSE MOBILE MENU ON ESC
     ======================================================= */

  document.addEventListener("keydown", event => {

    if (event.key !== "Escape") return;

    if (!mobileNav || !menuToggle) return;

    mobileNav.classList.remove("open");
    menuToggle.classList.remove("active");

    menuToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    document.body.classList.remove("menu-open");
  });


  /* =======================================================
     SMOOTH ANCHOR FALLBACK
     ======================================================= */

  $$('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

      const targetId =
        link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target =
        document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start"
      });

    });

  });


  /* =======================================================
     IMAGE LAZY LOAD SAFETY
     ======================================================= */

  $$("img[loading='lazy']").forEach(image => {

    image.setAttribute(
      "decoding",
      "async"
    );

  });


  /* =======================================================
     CONSOLE MESSAGE
     ======================================================= */

  console.log(
    "%cAQUIB.%c Industrial HSE / Operations / Planning",
    "color:#c9e86b;font-weight:800;font-size:16px;",
    "color:#87988f;font-size:12px;"
  );

});
