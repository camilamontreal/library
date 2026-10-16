(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };

  /* reveal on enter, once */
  var targets = document.querySelectorAll("[data-r],.circ");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (t) { io.observe(t); });
    setTimeout(function () { targets.forEach(function (t) { t.classList.add("in"); }); }, 6000);
  } else {
    targets.forEach(function (t) { t.classList.add("in"); });
  }

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

  /* the 4 days are 4 lines */
  var days = [
    { c: "#fccc0a", t: "Midtown e Times Square", n: 16, s: ["Grand Central Terminal", "Summit One Vanderbilt", "Biblioteca Pública de Nova York", "Bryant Park", "Times Square"] },
    { c: "#ff6319", t: "Central Park, Upper West e Midtown", n: 11, s: ["Museu de História Natural", "Central Park", "Upper West Side"] },
    { c: "#00933c", t: "Estátua, Downtown e Brooklyn", n: 16, s: ["Staten Island Ferry", "Estátua da Liberdade", "Downtown", "Ponte do Brooklyn"] },
    { c: "#b933ad", t: "Hudson Yards, Chelsea e Downtown", n: 14, s: ["Hudson Yards", "Vessel", "Chelsea", "Downtown"] }
  ];
  var route = $("route"), rsvg = $("rsvg"), rl = $("rl");
  function setDay(i) {
    var d = days[i], k = d.s.length, H = 340, top = 14, bot = 326, step = k > 1 ? (bot - top) / (k - 1) : 0;
    $("rt").textContent = "Dia " + (i + 1) + " · " + d.t; $("rn").textContent = d.n + " paradas";
    var sum = 0; for (var j = 0; j <= i; j++) sum += days[j].n; $("cum").textContent = sum;
    var path = '<path d="M23 ' + top + ' L23 ' + bot + '" pathLength="1"/>', dots = "";
    for (var q = 0; q < k; q++) dots += '<circle cx="23" cy="' + (top + step * q) + '" r="10" style="transition-delay:' + (q * 140 + 200) + 'ms"/>';
    rsvg.innerHTML = path + dots; rsvg.style.setProperty("--c", d.c); rsvg.style.setProperty("--len", 1);
    rl.innerHTML = d.s.map(function (n, q) { return '<li style="--i:' + q + '">' + n + "</li>"; }).join("");
    rl.style.height = "340px"; rl.style.alignContent = "space-between";
    route.classList.remove("on"); void route.offsetWidth; route.classList.add("on");
    document.querySelectorAll("#btns button").forEach(function (b, q) { b.setAttribute("aria-pressed", String(q === i)); });
  }
  document.querySelectorAll("#btns button").forEach(function (b) { b.addEventListener("click", function () { setDay(+b.dataset.i); }); });
  route.classList.remove("on"); setDay(0);

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
})();
