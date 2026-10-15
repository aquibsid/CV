
"use strict";

/* Enable script-dependent styles */
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
    if (siteNav.classList.contains("open")) {
      closeNavigation();
    } else {
      openNavigation();
    }
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

if (
  "IntersectionObserver" in window &&
  sections.length &&
  navLinks.length
) {
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

/* English / Arabic language system */
function setLanguage(language) {
  const isArabic = language === "ar";

  translatableElements.forEach((element) => {
    const translatedText = element.getAttribute(
      isArabic ? "data-ar" : "data-en"
    );

    if (translatedText === null) return;

    /* Preserve nested icons and other HTML */
    if (element.children.length > 0) {
      const textNode = Array.from(element.childNodes).find(
        (node) =>
          node.nodeType === Node.TEXT_NODE &&
          node.textContent.trim()
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
    /* Language switching still works without localStorage */
  }
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const language = button.getAttribute("data-lang");

    if (language === "en" || language === "ar") {
      setLanguage(language);
    }
  });
});

let savedLanguage = "en";

try {
  const storedLanguage = localStorage.getItem("aquib-language");

  if (storedLanguage === "en" || storedLanguage === "ar") {
    savedLanguage = storedLanguage;
  }
} catch (error) {
  /* Default to English */
}

setLanguage(savedLanguage);

/* Company logo fallback: Companies and Experience */
function enableLogoFallback(imageSelector, fallbackSelector) {
  document.querySelectorAll(imageSelector).forEach((image) => {
    const container = image.closest("a") || image.parentElement;
    const fallback = container
      ? container.querySelector(fallbackSelector)
      : null;

    function showFallback() {
      image.hidden = true;

      if (fallback) {
        fallback.hidden = false;
      }
    }

    image.addEventListener("error", showFallback);

    if (image.complete && image.naturalWidth === 0) {
      showFallback();
    }
  });
}

enableLogoFallback(".logo-tile img", ".logo-fallback");
enableLogoFallback(
  ".experience-company-logo",
  ".experience-logo-fallback"
);

/* Copy credential IDs reliably */
async function copyTextToClipboard(value) {
  /* Modern secure-context clipboard API */
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (error) {
      /* Try the fallback below */
    }
  }

  /* Fallback for browsers where Clipboard API is unavailable */
  const textarea = document.createElement("textarea");

  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.setAttribute("aria-hidden", "true");

  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "-9999px";
  textarea.style.width = "1px";
  textarea.style.height = "1px";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);

  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  let copied = false;

  try {
    copied = document.execCommand("copy");
  } catch (error) {
    copied = false;
  } finally {
    textarea.remove();
  }

  return copied;
}

document.addEventListener("click", async (event) => {
  const button = event.target.closest(".copy-credential");

  if (!button || button.disabled) return;

  const value = button.dataset.copyValue;

  if (!value) {
    button.textContent = "No ID available";
    return;
  }

  const originalText =
    button.dataset.originalLabel || button.textContent.trim();

  button.dataset.originalLabel = originalText;
  button.disabled = true;
  button.setAttribute("aria-live", "polite");

  try {
    const copied = await copyTextToClipboard(value);

    if (copied) {
      button.textContent = "Copied!";
      button.setAttribute("title", "Credential ID copied to clipboard");
    } else {
      button.textContent = "Copy unavailable";
      button.setAttribute(
        "title",
        "Copy failed. Please select and copy the credential ID manually."
      );
    }
  } catch (error) {
    button.textContent = "Copy unavailable";
    button.setAttribute(
      "title",
      "Copy failed. Please copy the credential ID manually."
    );
  }

  window.setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
    button.removeAttribute("title");
  }, 2200);
});

/* Close mobile navigation when returning to desktop width */
window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    closeNavigation();
  }
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
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
        ? "auto"
        : "smooth"
    });
  });
});
