/* Levels Fitness Studio — interactions: mobile menu, scrollspy, counters,
   horizontal-scroll controls, FAQ accordion, lightbox, reveal on scroll. */
(function () {
  "use strict";

  /* Mobile menu — instant toggle (no transition on the open state) */
  var toggle = document.querySelector("[data-menu-toggle]");
  var mobileNav = document.querySelector("[data-mobile-menu]");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* Scrollspy — highlight the current section in the desktop nav */
  var navLinks = document.querySelectorAll(".site-nav a");
  var sections = ["train", "floor", "coaching", "membership", "gallery", "visit"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  if ("IntersectionObserver" in window && navLinks.length && sections.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach(function (section) { observer.observe(section); });
  }

  /* Animated counters — real numbers only (4.5 rating, 145 reviews) */
  var counters = document.querySelectorAll(".counter");
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-target"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var duration = 1200;
    var start = null;
    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window && counters.length) {
    var counterObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (counter) { counterObserver.observe(counter); });
  } else {
    counters.forEach(function (counter) {
      var decimals = parseInt(counter.getAttribute("data-decimals") || "0", 10);
      counter.textContent = parseFloat(counter.getAttribute("data-target")).toFixed(decimals);
    });
  }

  /* Horizontal-scroll controls for the training cards */
  document.querySelectorAll("[data-scroll-target]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var row = document.getElementById(btn.getAttribute("data-scroll-target"));
      if (!row) return;
      var dir = parseInt(btn.getAttribute("data-scroll-dir"), 10) || 1;
      row.scrollBy({ left: dir * 360, behavior: "smooth" });
    });
  });

  /* FAQ accordion */
  document.querySelectorAll(".accordion-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var panel = btn.parentElement.nextElementSibling;
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
      if (panel) panel.classList.toggle("open", !expanded);
    });
  });

  /* Lightbox gallery */
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = lightbox ? lightbox.querySelector(".lightbox-img") : null;
  var lightboxCaption = lightbox ? lightbox.querySelector(".lightbox-caption") : null;
  var current = 0;
  var lastFocus = null;

  function showPhoto(index) {
    current = (index + items.length) % items.length;
    var item = items[current];
    var img = item.querySelector("img");
    lightboxImg.src = item.getAttribute("data-full");
    lightboxImg.alt = item.getAttribute("data-alt") || img.alt;
    lightboxCaption.textContent = (item.querySelector("span") ? item.querySelector("span").textContent : "") +
      " — " + (current + 1) + " of " + items.length;
  }
  function openLightbox(index) {
    lastFocus = document.activeElement;
    showPhoto(index);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightbox.querySelector(".lightbox-close").focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  if (lightbox && items.length) {
    items.forEach(function (item, index) {
      item.addEventListener("click", function () { openLightbox(index); });
    });
    lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
    lightbox.querySelector(".lightbox-prev").addEventListener("click", function () { showPhoto(current - 1); });
    lightbox.querySelector(".lightbox-next").addEventListener("click", function () { showPhoto(current + 1); });
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (event) {
      if (lightbox.hidden) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPhoto(current - 1);
      if (event.key === "ArrowRight") showPhoto(current + 1);
    });
  }

  /* Reveal on scroll */
  var revealTargets = document.querySelectorAll(
    ".train-card, .floor-photo, .why-card, .gallery-item, .hours-card, .coaching-copy, .floor-copy"
  );
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("visible"); });
  }
})();
