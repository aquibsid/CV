/* =========================================================
   AQUIB PORTFOLIO
   Navigation / Language / Reveal / Logo Fallbacks
   ========================================================= */

"use strict";


/* =========================================================
   DOCUMENT READY
   ========================================================= */

document.documentElement.classList.add("js-ready");


/* =========================================================
   ELEMENTS
   ========================================================= */

const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");
const siteHeader = document.getElementById("siteHeader");

const languageButtons =
  document.querySelectorAll(".lang-btn");

const translatableElements =
  document.querySelectorAll("[data-en][data-ar]");

const currentYear =
  document.getElementById("currentYear");


/* =========================================================
   YEAR
   ========================================================= */

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

function closeNavigation() {
  if (!siteNav || !navToggle) {
    return;
  }

  siteNav.classList.remove("open");
  navToggle.classList.remove("open");

  navToggle.setAttribute(
    "aria-expanded",
    "false"
  );

  navToggle.setAttribute(
    "aria-label",
    "Open navigation"
  );

  document.body.classList.remove("nav-open");
}


function openNavigation() {
  if (!siteNav || !navToggle) {
    return;
  }

  siteNav.classList.add("open");
  navToggle.classList.add("open");

  navToggle.setAttribute(
    "aria-expanded",
    "true"
  );

  navToggle.setAttribute(
    "aria-label",
    "Close navigation"
  );

  document.body.classList.add("nav-open");
}


if (navToggle && siteNav) {

  navToggle.addEventListener("click", () => {

    const isOpen =
      siteNav.classList.contains("open");

    if (isOpen) {
      closeNavigation();
    } else {
      openNavigation();
    }

  });


  siteNav
    .querySelectorAll("a")
    .forEach((link) => {

      link.addEventListener(
        "click",
        closeNavigation
      );

    });


  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Escape") {
        closeNavigation();
      }

    }
  );


  document.addEventListener(
    "click",
    (event) => {

      if (!siteNav.classList.contains("open")) {
        return;
      }

      if (
        !siteNav.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        closeNavigation();
      }

    }
  );

}


/* =========================================================
   HEADER SCROLL STATE
   ========================================================= */

function updateHeader() {

  if (!siteHeader) {
    return;
  }

  if (window.scrollY > 20) {
    siteHeader.classList.add("scrolled");
  } else {
    siteHeader.classList.remove("scrolled");
  }

}


window.addEventListener(
  "scroll",
  updateHeader,
  { passive: true }
);

updateHeader();


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

const navLinks =
  document.querySelectorAll(
    '.site-nav > a[href^="#"]'
  );

const sections =
  document.querySelectorAll(
    "main section[id]"
  );


if (
  "IntersectionObserver" in window &&
  sections.length &&
  navLinks.length
) {

  const sectionObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }

          navLinks.forEach((link) => {
            link.classList.remove("active");
          });

          const activeLink =
            document.querySelector(
              `.site-nav > a[href="#${entry.target.id}"]`
            );

          if (activeLink) {
            activeLink.classList.add("active");
          }

        });

      },
      {
        rootMargin: "-30% 0px -60% 0px"
      }
    );


  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

}


/* =========================================================
   LANGUAGE SYSTEM
   ========================================================= */

function setLanguage(language) {

  const isArabic =
    language === "ar";


  translatableElements.forEach(
    (element) => {

      const value =
        isArabic
          ? element.getAttribute("data-ar")
          : element.getAttribute("data-en");

      if (value !== null) {
        element.textContent = value;
      }

    }
  );


  document.documentElement.lang =
    isArabic ? "ar" : "en";

  document.documentElement.dir =
    isArabic ? "rtl" : "ltr";


  languageButtons.forEach(
    (button) => {

      const active =
        button.getAttribute("data-lang") === language;

      button.classList.toggle(
        "active",
        active
      );

    }
  );


  localStorage.setItem(
    "aquib-language",
    language
  );

}


languageButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        const language =
          button.getAttribute("data-lang");

        if (
          language === "en" ||
          language === "ar"
        ) {
          setLanguage(language);
        }

      }
    );

  }
);


/* =========================================================
   LOAD SAVED LANGUAGE
   ========================================================= */

const savedLanguage =
  localStorage.getItem("aquib-language");

if (
  savedLanguage === "en" ||
  savedLanguage === "ar"
) {
  setLanguage(savedLanguage);
} else {
  setLanguage("en");
}


/* =========================================================
   LOGO FALLBACKS
   ========================================================= */

const logoTiles =
  document.querySelectorAll(".logo-tile");


logoTiles.forEach(
  (tile) => {

    const image =
      tile.querySelector("img");

    const fallback =
      tile.querySelector(".logo-fallback");


    if (!image || !fallback) {
      return;
    }


    image.addEventListener(
      "error",
      () => {

        image.style.display = "none";

        fallback.hidden = false;

      }
    );


    /*
      Also handle images that may already
      have failed before the listener was added.
    */

    if (
      image.complete &&
      image.naturalWidth === 0
    ) {

      image.style.display = "none";

      fallback.hidden = false;

    }

  }
);


/* =========================================================
   CLOSE MOBILE NAV WHEN RESIZING
   ========================================================= */

window.addEventListener(
  "resize",
  () => {

    if (
      window.innerWidth > 900
    ) {
      closeNavigation();
    }

  }
);


/* =========================================================
   SMOOTH INTERNAL LINKS
   ========================================================= */

document
  .querySelectorAll('a[href^="#"]')
  .forEach((link) => {

    link.addEventListener(
      "click",
      (event) => {

        const targetId =
          link.getAttribute("href");

        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }

        const target =
          document.querySelector(targetId);

        if (!target) {
          return;
        }

        event.preventDefault();

        target.scrollIntoView({
          behavior:
            window.matchMedia(
              "(prefers-reduced-motion: reduce)"
            ).matches
              ? "auto"
              : "smooth"
        });

      }
    );

  });
