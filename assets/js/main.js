/* =========================================================
   Amir Karimi — site behaviour
   No dependencies. Everything degrades gracefully without JS.
   ========================================================= */
(function () {
  "use strict";

  var root = document.documentElement;
  var THEME_KEY = "ak-theme";

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0b0f18" : "#f7f8fb");
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* private mode */ }
    });
  }

  // Follow the OS only while the visitor hasn't chosen a theme themselves.
  var media = window.matchMedia("(prefers-color-scheme: dark)");
  var onSchemeChange = function (e) {
    var stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (err) { /* ignore */ }
    if (!stored) applyTheme(e.matches ? "dark" : "light");
  };
  if (media.addEventListener) media.addEventListener("change", onSchemeChange);
  else if (media.addListener) media.addListener(onSchemeChange);

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById("menu-btn");
  var nav = document.getElementById("nav");

  function closeMenu() {
    if (!nav) return;
    nav.classList.remove("is-open");
    if (menuBtn) {
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "Open menu");
    }
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    document.addEventListener("click", function (e) {
      if (!nav.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
    });
  }

  /* ---------- Header state + scroll progress ---------- */
  var header = document.getElementById("site-header");
  var progress = document.getElementById("scroll-progress");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    if (header) header.classList.toggle("is-scrolled", y > 8);

    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    }
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  var revealables = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function revealAll() {
    revealables.forEach(function (el) { el.classList.add("is-visible"); });
  }

  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealAll();
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        // Small stagger so groups of cards don't all pop at once.
        setTimeout(function () { entry.target.classList.add("is-visible"); }, i * 70);
        obs.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    revealables.forEach(function (el) { revealObserver.observe(el); });

    // Safety net: nothing on this page may stay invisible because an
    // animation never fired (deep links, print, odd browsers).
    setTimeout(revealAll, 2500);
    window.addEventListener("beforeprint", revealAll);
  }

  /* ---------- Active nav link ---------- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-list a"));

  if ("IntersectionObserver" in window && sections.length) {
    var visible = {};

    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
      });

      var bestId = null, bestRatio = 0;
      Object.keys(visible).forEach(function (id) {
        if (visible[id] > bestRatio) { bestRatio = visible[id]; bestId = id; }
      });

      navLinks.forEach(function (link) {
        link.classList.toggle("is-active", bestId !== null && link.hash === "#" + bestId);
      });
    }, { rootMargin: "-30% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] });

    sections.forEach(function (section) { navObserver.observe(section); });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
