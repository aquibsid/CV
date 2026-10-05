/* =========================================================
   AQUIB CV WEBSITE
   Vanilla JavaScript — no external libraries
========================================================= */

document.documentElement.classList.add("js-ready");


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const header = document.getElementById("site-header");
  const navLinks = document.getElementById("nav-links");
  const menuToggle = document.getElementById("menu-toggle");
  const languageButtons =
    document.querySelectorAll(".language-btn");

  const navItems =
    document.querySelectorAll(".nav-link");

  const sections =
    document.querySelectorAll("main section[id]");

  const revealElements =
    document.querySelectorAll(".reveal");

  const counterElements =
    document.querySelectorAll("[data-counter]");

  const progressBar =
    document.querySelector(".scroll-progress");

  const yearElement =
    document.getElementById("year");


  /* =======================================================
     YEAR
  ======================================================= */

  if (yearElement) {
    yearElement.textContent =
      new Date().getFullYear();
  }


  /* =======================================================
     MOBILE MENU
  ======================================================= */

  function openMenu() {

    if (!navLinks || !menuToggle) return;

    navLinks.classList.add("open");
    menuToggle.classList.add("open");

    menuToggle.setAttribute(
      "aria-expanded",
      "true"
    );

    menuToggle.setAttribute(
      "aria-label",
      "Close navigation"
    );

    document.body.classList.add("menu-open");
  }


  function closeMenu() {

    if (!navLinks || !menuToggle) return;

    navLinks.classList.remove("open");
    menuToggle.classList.remove("open");

    menuToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    menuToggle.setAttribute(
      "aria-label",
      "Open navigation"
    );

    document.body.classList.remove("menu-open");
  }


  if (menuToggle) {

    menuToggle.addEventListener("click", () => {

      const isOpen =
        navLinks.classList.contains("open");

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }

    });

  }


  /* CLOSE AFTER NAVIGATION */

  navItems.forEach((link) => {

    link.addEventListener("click", () => {

      if (
        window.innerWidth <= 760
      ) {
        closeMenu();
      }

    });

  });


  /* CLOSE WITH ESCAPE */

  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
      closeMenu();
    }

  });


  /* CLOSE WHEN CLICKING OUTSIDE */

  document.addEventListener("click", (event) => {

    if (!navLinks || !menuToggle) return;

    if (
      window.innerWidth <= 760 &&
      navLinks.classList.contains("open") &&
      !navLinks.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }

  });


  /* =======================================================
     HEADER SCROLL STATE
  ======================================================= */

  function updateHeader() {

    if (!header) return;

    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

  }


  /* =======================================================
     SCROLL PROGRESS
  ======================================================= */

  function updateProgress() {

    if (!progressBar) return;

    const documentHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;

    if (documentHeight <= 0) {
      progressBar.style.width = "0%";
      return;
    }

    const progress =
      (window.scrollY / documentHeight) * 100;

    progressBar.style.width =
      `${Math.min(progress, 100)}%`;

  }


  /* =======================================================
     ACTIVE NAVIGATION
  ======================================================= */

  function updateActiveNav() {

    if (!sections.length) return;

    const scrollPosition =
      window.scrollY + 180;

    let currentSection = "home";

    sections.forEach((section) => {

      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (
        scrollPosition >= top &&
        scrollPosition < top + height
      ) {
        currentSection = section.id;
      }

    });

    navItems.forEach((link) => {

      const target =
        link.getAttribute("data-section");

      link.classList.toggle(
        "active",
        target === currentSection
      );

    });

  }


  /* =======================================================
     SCROLL HANDLER
  ======================================================= */

  function handleScroll() {

    updateHeader();
    updateProgress();
    updateActiveNav();

  }

  window.addEventListener(
    "scroll",
    handleScroll,
    { passive: true }
  );

  handleScroll();


  /* =======================================================
     REVEAL ANIMATION
  ======================================================= */

  if (
    "IntersectionObserver" in window
  ) {

    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              "visible"
            );

            observer.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -40px 0px"
        }
      );


    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });

  } else {

    revealElements.forEach((element) => {
      element.classList.add("visible");
    });

  }


  /* =======================================================
     COUNTERS
  ======================================================= */

  function animateCounter(element) {

    const target =
      Number(
        element.getAttribute("data-counter")
      );

    if (
      !Number.isFinite(target)
    ) {
      return;
    }

    const duration = 1200;

    const startTime =
      performance.now();


    function updateCounter(currentTime) {

      const elapsed =
        currentTime - startTime;

      const progress =
        Math.min(
          elapsed / duration,
          1
        );

      const eased =
        1 - Math.pow(
          1 - progress,
          3
        );

      const currentValue =
        Math.round(target * eased);

      element.textContent =
        currentValue.toString();

      if (progress < 1) {
        requestAnimationFrame(
          updateCounter
        );
      }

    }

    requestAnimationFrame(
      updateCounter
    );

  }


  if (
    "IntersectionObserver" in window
  ) {

    const counterObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) {
              return;
            }

            animateCounter(
              entry.target
            );

            observer.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.6
        }
      );


    counterElements.forEach((counter) => {
      counterObserver.observe(counter);
    });

  } else {

    counterElements.forEach((counter) => {
      counter.textContent =
        counter.getAttribute(
          "data-counter"
        );
    });

  }


  /* =======================================================
     LANGUAGE SYSTEM
  ======================================================= */

  const translations = {

    en: {
      "Home": "Home",
      "About": "About",
      "Experience": "Experience",
      "Capabilities": "Capabilities",
      "Projects": "Projects",
      "Education": "Education",
      "Contact": "Contact"
    },

    ar: {
      "Home": "الرئيسية",
      "About": "نبذة",
      "Experience": "الخبرة",
      "Capabilities": "المهارات",
      "Projects": "المشاريع",
      "Education": "التعليم",
      "Contact": "تواصل"
    }

  };


  function setLanguage(language) {

    const selectedLanguage =
      language === "ar"
        ? "ar"
        : "en";

    document.documentElement.lang =
      selectedLanguage;

    document.documentElement.dir =
      selectedLanguage === "ar"
        ? "rtl"
        : "ltr";


    /* Elements with explicit translations */

    document
      .querySelectorAll("[data-en][data-ar]")
      .forEach((element) => {

        const value =
          element.getAttribute(
            `data-${selectedLanguage}`
          );

        if (value !== null) {
          element.textContent = value;
        }

      });


    /* Navigation */

    navItems.forEach((link) => {

      const englishText =
        link.getAttribute("data-en-text") ||
        link.textContent.trim();

      if (!link.getAttribute("data-en-text")) {
        link.setAttribute(
          "data-en-text",
          englishText
        );
      }

      const translated =
        translations[selectedLanguage][
          englishText
        ];

      if (translated) {
        link.textContent = translated;
      }

    });


    /* Active language button */

    languageButtons.forEach((button) => {

      button.classList.toggle(
        "active",
        button.getAttribute("data-lang") ===
          selectedLanguage
      );

    });


    try {

      localStorage.setItem(
        "aquib-language",
        selectedLanguage
      );

    } catch (error) {
      /* Ignore storage errors */
    }


    /* Close menu after language change */

    closeMenu();

  }


  /* LANGUAGE BUTTON EVENTS */

  languageButtons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        setLanguage(
          button.getAttribute(
            "data-lang"
          )
        );

      }
    );

  });


  /* LOAD SAVED LANGUAGE */

  let savedLanguage = "en";

  try {

    const stored =
      localStorage.getItem(
        "aquib-language"
      );

    if (
      stored === "ar" ||
      stored === "en"
    ) {
      savedLanguage = stored;
    }

  } catch (error) {
    savedLanguage = "en";
  }

  setLanguage(savedLanguage);


  /* =======================================================
     IMAGE FALLBACK
  ======================================================= */

  document
    .querySelectorAll(".industrial-logo img, .company-brands img")
    .forEach((image) => {

      image.addEventListener(
        "error",
        () => {

          image.style.display = "none";

        },
        { once: true }
      );

    });


  /* =======================================================
     RESIZE SAFETY
  ======================================================= */

  window.addEventListener(
    "resize",
    () => {

      if (window.innerWidth > 760) {
        closeMenu();
      }

    }
  );

});
