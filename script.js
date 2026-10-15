"use strict";

/* Add class for scripts-enabled styling */
document.documentElement.classList.add("js-ready");

const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");
const siteHeader = document.getElementById("siteHeader");
const languageButtons = document.querySelectorAll(".lang-btn");
const translatableElements = document.querySelectorAll("[data-en][data-ar]");
const currentYear = document.getElementById("currentYear");

/* Footer year */
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

/* Mobile navigation */
function closeNavigation() {
  if (!siteNav || !navToggle) return;

  siteNav.classList.remove("open");
  navToggle.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");
  document.body.classList.remove("nav-open");
}

function openNavigation() {
  if (!siteNav || !navToggle) return;

  siteNav.classList.add("open");
  navToggle.classList.add("open");
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Close navigation");
  document.body.classList.add("nav-open");
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    siteNav.classList.contains("open")
      ? closeNavigation()
      : openNavigation();
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNavigation);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigation();
  });

  document.addEventListener("click", (event) => {
    if (
      siteNav.classList.contains("open") &&
      !siteNav.contains(event.target) &&
      !navToggle.contains(event.target)
    ) {
      closeNavigation();
    }
  });
}

/* Header scroll state */
function updateHeader() {
  if (siteHeader) {
    siteHeader.classList.toggle("scrolled", window.scrollY > 20);
  }
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

/* Active navigation link */
const navLinks = document.querySelectorAll('.site-nav > a[href^="#"]');
const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window && sections.length && navLinks.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => link.classList.remove("active"));

      const activeLink = document.querySelector(
        `.site-nav > a[href="#${entry.target.id}"]`
      );

      if (activeLink) activeLink.classList.add("active");
    });
  }, {
    rootMargin: "-30% 0px -60% 0px"
  });

  sections.forEach((section) => sectionObserver.observe(section));
}

/* Language system */
function setLanguage(language) {
  const isArabic = language === "ar";

  translatableElements.forEach((element) => {
    const translatedText = element.getAttribute(
      isArabic ? "data-ar" : "data-en"
    );

    if (translatedText === null) return;

    /*
      These attributes are used only on text-bearing elements.
      Replacing text on the element itself can remove child icons,
      so skip elements containing non-text child elements.
    */
    const hasElementChildren = Array.from(element.children).length > 0;

    if (hasElementChildren) {
      /*
        Preserve nested markup and update a dedicated text node only
        when the element has one. Otherwise, keep its child elements.
      */
      const textNode = Array.from(element.childNodes).find(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
      );

      if (textNode) {
        textNode.textContent = translatedText;
      } else {
        element.setAttribute("aria-label", translatedText);
      }
    } else {
      element.textContent = translatedText;
    }
  });

  document.documentElement.lang = isArabic ? "ar" : "en";
  document.documentElement.dir = isArabic ? "rtl" : "ltr";

  languageButtons.forEach((button) => {
    const active = button.getAttribute("data-lang") === language;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  try {
    localStorage.setItem("aquib-language", language);
  } catch (error) {
    /* Storage may be unavailable; language still changes for this page view. */
  }
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const language = button.getAttribute("data-lang");
    if (language === "en" || language === "ar") setLanguage(language);
  });
});

let savedLanguage = "en";
try {
  const storedLanguage = localStorage.getItem("aquib-language");
  if (storedLanguage === "en" || storedLanguage === "ar") {
    savedLanguage = storedLanguage;
  }
} catch (error) {
  /* Use English if storage is unavailable. */
}

setLanguage(savedLanguage);

/* Logo fallbacks */
document.querySelectorAll(".logo-tile").forEach((tile) => {
  const image = tile.querySelector("img");
  const fallback = tile.querySelector(".logo-fallback");

  if (!image || !fallback) return;

  function showFallback() {
    image.style.display = "none";
    fallback.hidden = false;
  }

  image.addEventListener("error", showFallback);

  if (image.complete && image.naturalWidth === 0) {
    showFallback();
  }
});

/* Copy credential IDs */
document.addEventListener("click", async (event) => {
  const button = event.target.closest(".copy-credential");
  if (!button) return;

  const value = button.dataset.copyValue;
  if (!value) return;

  const originalText = button.textContent;

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";

    document.body.appendChild(textarea);
    textarea.select();

    const success = document.execCommand("copy");
    textarea.remove();

    if (!success) throw new Error("Copy failed");
  }

  try {
    await copyText(value);
    button.textContent = "Copied!";
  } catch (error) {
    button.textContent = "Copy failed";
  }

  button.disabled = true;

  window.setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
  }, 1800);
});

/* Close mobile menu after returning to desktop width */
window.addEventListener("resize", () => {
  if (window.innerWidth > 900) closeNavigation();
});

/* Smooth internal links */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth"
    });
  });
});
