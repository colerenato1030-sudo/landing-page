/* AceTennis — hero carousel + mobile nav */
(function () {
  "use strict";

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- hero slides ----------
     `fit` trims the display size for longer headlines so every
     line still spans the stage without wrapping. */
  var slides = [
    { word: "Play Strong", lede: "Building Champions On and Off the Court", fit: 1 },
    { word: "Train Smart", lede: "Data-Driven Coaching for Every Level", fit: 1 },
    { word: "Win Together", lede: "One Club, One Bench, One Standard", fit: 0.92 }
  ];

  var stage = document.querySelector(".stage");
  var type = document.querySelector("[data-headline]");
  var line = type && type.querySelector(".stage__line");
  var lede = document.querySelector("[data-lede]");
  var current = document.querySelector("[data-current]");
  var total = document.querySelector("[data-total]");
  var prev = document.querySelector('[data-slide="prev"]');
  var next = document.querySelector('[data-slide="next"]');

  if (!type || !line || !lede) return;
  if (total) total.textContent = String(slides.length);

  var index = 0;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function render() {
    var s = slides[index];
    line.innerHTML = "";
    line.appendChild(document.createTextNode(s.word));
    var dot = document.createElement("span");
    dot.className = "stage__dot";
    dot.textContent = ".";
    line.appendChild(dot);

    lede.textContent = s.lede;
    if (current) current.textContent = String(index + 1);
    fit();
  }

  /* Measure the line at a known size, then scale it so it spans the stage
     exactly. Keeps the display type edge-to-edge without ever overflowing,
     whatever font ends up being used. */
  var MEASURE = 200;
  var MIN = 40;
  var MAX = 320;

  function fit() {
    if (!stage) return;
    /* Measure against the stage's content box, not the heading — a nowrap
       heading can stretch its own grid track and make the target circular. */
    var cs = getComputedStyle(stage);
    var avail =
      stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    if (avail <= 0) return;

    line.style.fontSize = MEASURE + "px";
    var natural = line.getBoundingClientRect().width;
    if (!natural) return;

    var size = (MEASURE * avail) / natural;
    line.style.fontSize = Math.max(MIN, Math.min(MAX, size)) + "px";
  }

  function go(step) {
    index = (index + step + slides.length) % slides.length;
    if (reduced) {
      render();
      return;
    }
    type.setAttribute("data-swapping", "");
    window.setTimeout(function () {
      render();
      type.removeAttribute("data-swapping");
    }, 260);
  }

  if (prev) prev.addEventListener("click", function () { go(-1); });
  if (next) next.addEventListener("click", function () { go(1); });

  document.addEventListener("keydown", function (e) {
    if (e.target !== document.body) return;
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  });

  render();

  if (window.ResizeObserver && stage) {
    new ResizeObserver(fit).observe(stage);
  } else {
    window.addEventListener("resize", fit);
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fit);
  }
})();

/* ---------- GSAP animations ---------- */
if (window.gsap) {
  gsap.registerPlugin(ScrollTrigger);

  /* Hero entrance animation */
  gsap.timeline()
    .from(".hero__clouds", { opacity: 0, duration: 0.8 }, 0)
    .from(".stage__type", { opacity: 0, y: 30, duration: 0.8 }, 0.2)
    .from(".stage__subject", { opacity: 0, scale: 0.95, duration: 0.8 }, 0.2)
    .from(".stage__caption", { opacity: 0, y: 20, duration: 0.8 }, 0.4);

  /* Nav animation */
  gsap.from(".nav", { opacity: 0, y: -20, duration: 0.6 });

  /* Scroll animations for sections */
  gsap.utils.toArray("section, footer").forEach((section) => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        once: true,
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
    });
  });

  /* Card stagger animations */
  gsap.utils.toArray(".card").forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        once: true,
      },
      opacity: 0,
      y: 20,
      rotation: -2,
      duration: 0.6,
      delay: i * 0.1,
    });
  });

  /* Coach list stagger */
  gsap.utils.toArray(".coaches li").forEach((coach, i) => {
    gsap.from(coach, {
      scrollTrigger: {
        trigger: coach,
        start: "top 90%",
        once: true,
      },
      opacity: 0,
      x: -20,
      duration: 0.5,
      delay: i * 0.08,
    });
  });

  /* Smooth scroll for nav links */
  gsap.utils.toArray("a[href^='#']").forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#" && document.querySelector(href)) {
        e.preventDefault();
        gsap.to(window, {
          scrollTo: href,
          duration: 0.8,
          ease: "power2.inOut",
        });
      }
    });
  });

  /* Add gsap.to for scroll-to functionality */
  if (!gsap.hasPlugin("scrollTo")) {
    gsap.registerPlugin(ScrollToPlugin);
  }
}
