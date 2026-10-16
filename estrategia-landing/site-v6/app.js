(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };

  /* reveal on enter, once */
  var targets = document.querySelectorAll("[data-r]");
  var circs = document.querySelectorAll(".circ");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); e.target.querySelectorAll(".circ").forEach(function (c) { c.classList.add("in"); }); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (t) { io.observe(t); });
    circs.forEach(function (c) { var p = c.parentNode; if (!p.hasAttribute("data-r")) io.observe(p); });
    setTimeout(function () { targets.forEach(function (t) { t.classList.add("in"); }); circs.forEach(function (c) { c.classList.add("in"); }); }, 6000);
  } else {
    targets.forEach(function (t) { t.classList.add("in"); }); circs.forEach(function (c) { c.classList.add("in"); });
  }

  /* platform: doors open after the train arrives */
  var arr = document.querySelector(".arrive");
  if (arr && !reduce) setTimeout(function () { arr.classList.add("go"); }, 600); else if (arr) arr.style.display = "none";

  /* train on the rail + LED sign */
  var line = $("line"), train = $("train"), prog = $("prog"), ledt = $("ledt"), ledb = $("ledb");
  var sts = Array.prototype.slice.call(document.querySelectorAll(".st"));
  var tops = [], lineTop = 0, cur = -1, ticking = false;
  function measure() {
    var lr = line.getBoundingClientRect(); lineTop = lr.top + window.scrollY;
    tops = sts.map(function (s) { return s.getBoundingClientRect().top + window.scrollY + parseFloat(getComputedStyle(s).paddingTop) + 6; });
  }
  function setLed(i) {
    if (i === cur) return; cur = i;
    var s = sts[i];
    ledt.classList.add("sw");
    setTimeout(function () {
      ledt.innerHTML = "<span>Próxima estação</span>" + s.dataset.st;
      ledb.textContent = s.dataset.b; ledb.className = "bl " + s.dataset.bc;
      line.style.setProperty("--line", s.dataset.c);
      ledt.classList.remove("sw");
    }, reduce ? 0 : 160);
  }
  function update() {
    ticking = false;
    var vh = window.innerHeight, y = window.scrollY + vh * 0.38;
    var h = line.offsetHeight - 64 - 46;
    var ty = Math.max(0, Math.min(y - lineTop - 46 - 32, h));
    train.style.setProperty("--ty", (ty + 46) + "px");
    prog.style.setProperty("--prog", (ty + 32) + "px");
    var idx = 0, near = false;
    for (var i = 0; i < tops.length; i++) { if (tops[i] - 40 <= y) idx = i; if (Math.abs(tops[i] - (y)) < 70) near = true; }
    train.classList.toggle("open", near);
    setLed(idx);
    sts.forEach(function (s, k) { s.classList.toggle("in", k <= idx); });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { measure(); update(); });
  window.addEventListener("load", function () { measure(); update(); });
  measure(); update();

  /* the 4 days are 4 lines on a real-looking subway map */
  var days = [
    { t: "Midtown e Times Square", n: 16, s: ["Grand Central Terminal", "Summit One Vanderbilt", "Biblioteca Pública", "Bryant Park", "Times Square"] },
    { t: "Central Park, Upper West e Midtown", n: 11, s: ["Museu de História Natural", "Central Park", "Upper West Side"] },
    { t: "Estátua, Downtown e Brooklyn", n: 16, s: ["Staten Island Ferry", "Estátua da Liberdade", "Downtown", "Ponte do Brooklyn"] },
    { t: "Hudson Yards, Chelsea e Downtown", n: 14, s: ["Hudson Yards", "Vessel", "Chelsea", "Downtown"] }
  ];
  var NS = "http://www.w3.org/2000/svg", stns = $("stns"), tr = $("tr"), anim = 0, sel = 0;
  function mk(tag, attrs, text) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (text) e.textContent = text; return e; }
  function setDay(i) {
    sel = i; cancelAnimationFrame(anim);
    var d = days[i], path = $("L" + i), L = path.getTotalLength(), k = d.s.length;
    for (var q = 0; q < 4; q++) $("L" + q).classList.toggle("on", q === i);
    $("rt").textContent = "Dia " + (i + 1) + " · " + d.t; $("rn").textContent = d.n + " paradas";
    var sum = 0; for (var j2 = 0; j2 <= i; j2++) sum += days[j2].n; $("cum").textContent = sum;
    document.querySelectorAll("#btns button").forEach(function (b, q) { b.setAttribute("aria-pressed", String(q === i)); });
    stns.innerHTML = "";
    var items = d.s.map(function (name, q) {
      var f = (q + .5) / k, p = path.getPointAtLength(L * f);
      var c = mk("circle", { class: "stn", cx: p.x, cy: p.y, r: 11 });
      var right = p.x < 560;
      var t = mk("text", { class: "lab", x: p.x + (right ? 18 : -18), y: p.y - 14, "text-anchor": right ? "start" : "end" }, name);
      stns.appendChild(c); stns.appendChild(t);
      return { f: f, c: c, t: t };
    });
    function show(x) { x.c.classList.add("on"); x.t.classList.add("on"); }
    if (reduce) { items.forEach(show); var e = path.getPointAtLength(L); tr.setAttribute("cx", e.x); tr.setAttribute("cy", e.y); return; }
    var t0 = performance.now(), dur = 2600;
    (function step(now) {
      var p = Math.min((now - t0) / dur, 1), e2 = 1 - Math.pow(1 - p, 3), pt = path.getPointAtLength(L * e2);
      tr.setAttribute("cx", pt.x); tr.setAttribute("cy", pt.y);
      items.forEach(function (x) { if (e2 >= x.f - .02) show(x); });
      if (p < 1) anim = requestAnimationFrame(step);
    })(t0);
  }
  document.querySelectorAll("#btns button").forEach(function (b) { b.addEventListener("click", function () { setDay(+b.dataset.i); }); });
  var mapEl = $("map"), mapStarted = false;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { if (es[0].isIntersecting && !mapStarted) { mapStarted = true; setDay(0); } }, { threshold: .35 }).observe(mapEl);
  } else { setDay(0); }
  for (var q0 = 0; q0 < 4; q0++) $("L" + q0).classList.toggle("on", q0 === 0);

  /* departures board: statuses take turns */
  var sts2 = document.querySelectorAll(".board .st2"), texts = ["Embarcando", "Chegando", "No horário"], bi = 0;
  if (!reduce) setInterval(function () {
    bi = (bi + 1) % 4;
    sts2.forEach(function (s, k) { var on = k === bi; s.textContent = on ? "Embarcando" : (k === (bi + 1) % 4 ? "Chegando" : "No horário"); s.classList.toggle("blink", on); });
  }, 3200);

  /* sky: day to dusk to night with the scroll */
  var view = $("view");
  function lerp(a, b, t) { return Math.round(a + (b - a) * t); }
  function mix(c1, c2, t) { return "rgb(" + lerp(c1[0], c2[0], t) + "," + lerp(c1[1], c2[1], t) + "," + lerp(c1[2], c2[2], t) + ")"; }
  var DAY = [124, 199, 242], DUSK = [245, 158, 91], NIGHT = [20, 30, 62];
  function sky() {
    var max = document.documentElement.scrollHeight - window.innerHeight, p = max > 0 ? window.scrollY / max : 0, col, night;
    if (p < .5) { col = mix(DAY, DUSK, p / .5); night = 0; } else { col = mix(DUSK, NIGHT, (p - .5) / .5); night = (p - .5) / .5; }
    view.style.setProperty("--sky", col); view.parentNode.style.setProperty("--night", night); view.style.setProperty("--night", night);
  }
  window.addEventListener("scroll", function () { requestAnimationFrame(sky); }, { passive: true });
  sky();

  /* guide pages in the window */
  var frame = $("frame"), fi = frame.querySelectorAll("img"), cap = $("cap"), dots = $("dots"), cur2 = 0, timer;
  fi.forEach(function () { dots.appendChild(document.createElement("i")); });
  function show(n) {
    cur2 = (n + fi.length) % fi.length;
    fi.forEach(function (m, k) { m.classList.toggle("on", k === cur2); });
    dots.querySelectorAll("i").forEach(function (d, k) { d.classList.toggle("on", k === cur2); });
    cap.textContent = fi[cur2].dataset.c;
  }
  function auto() { clearInterval(timer); if (!reduce) timer = setInterval(function () { show(cur2 + 1); }, 3200); }
  frame.addEventListener("click", function () { show(cur2 + 1); auto(); });
  frame.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") { e.preventDefault(); show(cur2 + 1); auto(); } });
  show(0); auto();

  /* posters */
  var data = [
    ["Whispering Gallery", "De costas para o relógio, siga pelo arco à direita (saída Lexington), vire à direita e desça a rampa. Cada pessoa fala num canto do arco e a outra ouve do lado oposto."],
    ["Estátua da Liberdade de graça", "O Staten Island Ferry é gratuito, sai a cada 30 minutos e a viagem dura uns 20. Na ida, suba até o último andar e fique nas janelas do lado direito. Na volta, garanta um lugar do lado esquerdo."],
    ["Musicais em português", "Áudio-guia ShowTrans para Aladdin, The Book of Mormon, Hadestown, O Rei Leão e Wicked, e legendas em português pelo app GalaPro. Chegue com 30 a 40 minutos de antecedência."],
    ["20 locações de filmes e séries", "Home Alone 2, Friends, Sex and the City, Ghostbusters, Spider-Man e mais, cada uma com endereço que abre no Google Maps."]
  ];
  var tabs = document.querySelectorAll(".tabs [data-t]"), pimgs = document.querySelectorAll(".poster .ph img");
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () {
      tabs.forEach(function (b, k) { b.setAttribute("aria-selected", String(k === i)); });
      pimgs.forEach(function (m, k) { m.classList.toggle("on", k === i); });
      $("st1").textContent = data[i][0]; $("sp1").textContent = data[i][1];
    });
  });

  /* MetroCard + turnstile */
  var plans = document.querySelectorAll("[data-pl]"), stages = document.querySelectorAll(".stg");
  var BUY = { br: "#checkout-br", ca: "#checkout-ca" };
  var price = { br: "R$ 67,90", ca: "CAD 21" }, plan = "br", busy = false;
  function setPlan(k) {
    plan = k;
    plans.forEach(function (p) { p.setAttribute("aria-selected", String(p.dataset.pl === k)); });
    stages.forEach(function (s) { s.hidden = s.dataset.s !== k; });
    $("mprice").textContent = price[k];
  }
  plans.forEach(function (p) { p.addEventListener("click", function () { setPlan(p.dataset.pl); }); });
  var lang = (navigator.language || "pt-BR").toLowerCase();
  if (lang.indexOf("pt") !== 0) setPlan("ca");
  ["br", "ca"].forEach(function (k) {
    var a = $("buy-" + k); a.href = BUY[k];
    a.addEventListener("click", function (e) {
      if (reduce || busy) return;
      e.preventDefault(); busy = true;
      var gt = $("gt"); document.querySelector(".pay").classList.add("go");
      setTimeout(function () { gt.classList.add("ok"); $("scrt").textContent = "Liberado · bom embarque"; }, 700);
      setTimeout(function () { window.location.href = BUY[k]; busy = false; }, 1500);
    });
  });

  /* station announcements: tips from the guide, shuffled */
  var tips = [
    "Visite o Summit One Vanderbilt no primeiro horário para evitar multidões.",
    "Staten Island Ferry: gratuito e passa pertinho da Estátua da Liberdade.",
    "Antes de pedir o café, procure promoções. Eu paguei US$ 2 em vez de 4 só perguntando.",
    "Banheiro público é raro em Nova York. Veja a aba de banheiros gratuitos no mapa.",
    "Entre pelo Gilder Center às 10h no Museu de História Natural: quase sem fila.",
    "Loteria da Broadway: ingressos bem mais baratos, e há legendas em português.",
    "Whispering Gallery, na Grand Central: cada pessoa fala num canto e a outra ouve do lado oposto."
  ], ti = 0, tm = $("tmsg");
  function nextTip() {
    var n; do { n = Math.floor(Math.random() * tips.length); } while (n === ti);
    ti = n; tm.classList.add("sw");
    setTimeout(function () { tm.textContent = tips[ti]; tm.classList.remove("sw"); }, reduce ? 0 : 220);
  }
  $("tnext").addEventListener("click", nextTip);
  if (!reduce) setInterval(nextTip, 7000);

  /* easter eggs */
  var toast = $("toast"), tt;
  function say(t) { toast.textContent = t; toast.classList.add("on"); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove("on"); }, 2400); }
  var pg = $("pigeon"), rat = $("rat");
  pg.addEventListener("click", function () {
    say("Cuu! Pombo de Nova York, dono da plataforma.");
    if (!reduce) { pg.classList.add("fly"); setTimeout(function () { pg.classList.remove("fly"); }, 3200); }
  });
  rat.addEventListener("click", function () { say("Pizza rat! Esse levou a fatia até a escada."); });
})();
