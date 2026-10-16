(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* reveal on enter, once */
  var targets = document.querySelectorAll("[data-r]");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (t) { io.observe(t); });
    setTimeout(function () { targets.forEach(function (t) { t.classList.add("in"); }); }, 6000);
  } else {
    targets.forEach(function (t) { t.classList.add("in"); });
  }

  /* stickers you can throw */
  var cluster = document.getElementById("cluster");
  document.querySelectorAll(".stk").forEach(function (el) {
    var x = 0, y = 0, vx = 0, vy = 0, sx, sy, ox, oy, lx, ly, lt, raf;
    function put() { el.style.transform = "translate(" + x + "px," + y + "px)"; }
    function clamp() {
      var c = cluster.getBoundingClientRect(), r = el.getBoundingClientRect();
      var dx = 0, dy = 0;
      if (r.left < c.left - 40) dx = c.left - 40 - r.left;
      if (r.right > c.right + 40) dx = c.right + 40 - r.right;
      if (r.top < c.top - 30) dy = c.top - 30 - r.top;
      if (r.bottom > c.bottom + 20) dy = c.bottom + 20 - r.bottom;
      x += dx; y += dy;
    }
    function glide() {
      vx *= 0.94; vy *= 0.94; x += vx; y += vy; clamp(); put();
      if (Math.abs(vx) + Math.abs(vy) > 0.4) raf = requestAnimationFrame(glide);
    }
    el.addEventListener("pointerdown", function (e) {
      cancelAnimationFrame(raf);
      el.setPointerCapture(e.pointerId); el.classList.add("drag");
      sx = e.clientX; sy = e.clientY; ox = x; oy = y; lx = sx; ly = sy; lt = performance.now(); vx = vy = 0;
    });
    el.addEventListener("pointermove", function (e) {
      if (!el.classList.contains("drag")) return;
      x = ox + e.clientX - sx; y = oy + e.clientY - sy;
      var now = performance.now(), dt = Math.max(now - lt, 1);
      vx = (e.clientX - lx) / dt * 16; vy = (e.clientY - ly) / dt * 16; lx = e.clientX; ly = e.clientY; lt = now;
      put();
    });
    function up() {
      if (!el.classList.contains("drag")) return;
      el.classList.remove("drag");
      if (!reduce) raf = requestAnimationFrame(glide);
    }
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  });

  /* quiz thread: days -> stops (honest cumulative sum) */
  var stops = [16, 11, 16, 14];
  var num = document.getElementById("num"), sent = document.getElementById("sent");
  var chips = document.querySelectorAll(".chips button");
  function setDays(n) {
    var sum = 0; for (var i = 0; i < n; i++) sum += stops[i];
    num.textContent = sum; sent.textContent = n === 1 ? "1 dia" : n + " dias";
    chips.forEach(function (b) { b.setAttribute("aria-pressed", String(+b.dataset.d === n)); });
  }
  chips.forEach(function (b) { b.addEventListener("click", function () { setDays(+b.dataset.d); }); });

  /* guide pages: one taped card */
  var frame = document.getElementById("frame");
  var fi = frame.querySelectorAll("img"), cap = document.getElementById("cap"), cur = 0, timer;
  function show(n) {
    cur = (n + fi.length) % fi.length;
    fi.forEach(function (m, k) { m.classList.toggle("on", k === cur); });
    cap.textContent = fi[cur].dataset.c;
  }
  function auto() { clearInterval(timer); if (!reduce) timer = setInterval(function () { show(cur + 1); }, 3200); }
  frame.addEventListener("click", function () { show(cur + 1); auto(); });
  frame.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") { e.preventDefault(); show(cur + 1); auto(); } });
  auto();

  /* tabs */
  var data = [
    ["Whispering Gallery", "De costas para o relógio, siga pelo arco à direita (saída Lexington), vire à direita e desça a rampa. Cada pessoa fala num canto do arco e a outra ouve do lado oposto."],
    ["Estátua da Liberdade de graça", "O Staten Island Ferry é gratuito, sai a cada 30 minutos e a viagem dura uns 20. Na ida, suba até o último andar e fique nas janelas do lado direito. Na volta, garanta um lugar do lado esquerdo."],
    ["Musicais em português", "Áudio-guia ShowTrans para Aladdin, The Book of Mormon, Hadestown, O Rei Leão e Wicked, e legendas em português pelo app GalaPro. Chegue com 30 a 40 minutos de antecedência."],
    ["20 locações de filmes e séries", "Home Alone 2, Friends, Sex and the City, Ghostbusters, Spider-Man e mais, cada uma com endereço que abre no Google Maps."]
  ];
  var tabs = document.querySelectorAll(".tabs [data-t]");
  var imgs = document.querySelectorAll(".pane .ph img");
  var st = document.getElementById("st"), sp = document.getElementById("sp");
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () {
      tabs.forEach(function (b, k) { b.setAttribute("aria-selected", String(k === i)); });
      imgs.forEach(function (m, k) { m.classList.toggle("on", k === i); });
      st.textContent = data[i][0]; sp.textContent = data[i][1];
    });
  });

  /* receipt: Brasil / Exterior */
  var plans = document.querySelectorAll("[data-pl]");
  var stages = document.querySelectorAll(".stg");
  function setPlan(k) {
    plans.forEach(function (p) { p.setAttribute("aria-selected", String(p.dataset.pl === k)); });
    stages.forEach(function (s) { s.hidden = s.dataset.s !== k; });
  }
  plans.forEach(function (p) { p.addEventListener("click", function () { setPlan(p.dataset.pl); }); });
  var lang = (navigator.language || "pt-BR").toLowerCase();
  if (lang.indexOf("pt") !== 0) setPlan("ca");
  /* checkout links: replace with the two real checkout URLs */
  var BUY = { br: "#checkout-br", ca: "#checkout-ca" };
  document.getElementById("buy-br").href = BUY.br;
  document.getElementById("buy-ca").href = BUY.ca;

  /* barcode */
  var bar = document.getElementById("bar"), seed = 7, html = "";
  for (var i = 0; i < 46; i++) { seed = (seed * 9301 + 49297) % 233280; html += '<i style="width:' + (1 + Math.floor(seed / 233280 * 4)) + 'px"></i>'; }
  bar.innerHTML = html;
})();
