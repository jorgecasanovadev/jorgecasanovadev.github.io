  (function () {
    "use strict";
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ES / EN toggle. Spanish is the markup default; the choice is remembered.
    var lang = "es";
    try { lang = localStorage.getItem("lang") || (navigator.language || "es").slice(0, 2); } catch (e) {}
    if (lang !== "en") lang = "es";

    // Builds the translated text from DOM nodes instead of innerHTML, so the
    // strings are never parsed as markup. The only formatting they may carry
    // is <strong>…</strong>; anything else stays literal text.
    function render(el, text) {
      el.textContent = "";
      text.split(/(<strong>.*?<\/strong>)/).forEach(function (part) {
        var m = /^<strong>(.*)<\/strong>$/.exec(part);
        if (m) {
          var s = document.createElement("strong");
          s.textContent = m[1];
          el.appendChild(s);
        } else if (part) {
          el.appendChild(document.createTextNode(part));
        }
      });
    }

    function applyLang() {
      document.documentElement.lang = lang;
      document.querySelectorAll("[data-" + lang + "]").forEach(function (el) {
        render(el, el.getAttribute("data-" + lang));
      });
      var cv = "Jorge_Casanova_Mobile_FullStack_Developer_CV_" + lang.toUpperCase() + ".pdf";
      document.querySelectorAll("[data-cv]").forEach(function (el) { el.setAttribute("href", cv); });
      document.querySelectorAll("#langToggle button").forEach(function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang ? "true" : "false");
      });
    }
    document.getElementById("langToggle").addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      lang = b.getAttribute("data-lang");
      try { localStorage.setItem("lang", lang); } catch (err) {}
      applyLang();
    });
    applyLang();

    // Binary noise divider strips
    document.querySelectorAll(".binary-strip").forEach(function (el) {
      var chars = "";
      var target = Math.ceil(window.innerWidth / 5.5);
      for (var i = 0; i < target; i++) chars += Math.round(Math.random());
      el.textContent = chars.match(/.{1,4}/g).join(" ");
    });

    // Periodic glitch burst on the hero name
    var nameEl = document.getElementById("glitchName");
    if (nameEl && !reduceMotion) {
      setInterval(function () {
        nameEl.classList.remove("glitching");
        void nameEl.offsetWidth;
        nameEl.classList.add("glitching");
      }, 4200);
    }

    // Ambient binary rain behind hero, canvas 2D
    var canvas = document.getElementById("rain");
    if (canvas && !reduceMotion) {
      var ctx = canvas.getContext("2d");
      var hero = canvas.parentElement;
      var cols, drops, fontSize = 14;
      function resize() {
        canvas.width = hero.clientWidth;
        canvas.height = hero.clientHeight;
        cols = Math.floor(canvas.width / fontSize);
        drops = new Array(cols).fill(0).map(function () { return Math.random() * -50; });
      }
      resize();
      window.addEventListener("resize", resize);
      setInterval(function () {
        ctx.fillStyle = "rgba(6, 10, 8, 0.14)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = fontSize + "px 'JetBrains Mono', monospace";
        for (var i = 0; i < cols; i++) {
          var y = drops[i] * fontSize;
          ctx.fillStyle = Math.random() > 0.94 ? "rgba(255,180,84,0.55)" : "rgba(77,255,160,0.28)";
          ctx.fillText(Math.round(Math.random()), i * fontSize, y);
          if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
          drops[i]++;
        }
      }, 65);
    } else if (canvas) {
      canvas.hidden = true;
    }
  })();
