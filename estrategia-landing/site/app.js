(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* reveal on enter, once */
  var targets = document.querySelectorAll("[data-r],[data-shutter],[data-stage]");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (t) { io.observe(t); });
    /* safety: never leave content hidden */
    setTimeout(function () { targets.forEach(function (t) { t.classList.add("in"); }); }, 6000);
  } else {
    targets.forEach(function (t) { t.classList.add("in"); });
  }

  /* hero photo: slow scroll-linked drift */
  var hp = document.querySelector(".hero-photo");
  if (hp && !reduce) {
    window.addEventListener("scroll", function () {
      var y = Math.min(window.scrollY, 600);
      hp.style.transform = "translateY(" + (y * 0.08) + "px) scale(" + (1 + y * 0.0002) + ")";
    }, { passive: true });
  }

  /* stats: days -> stops (honest cumulative sum) */
  var stops = [16, 11, 16, 14];
  var labels = [
    "1 dia: Midtown e Times Square",
    "2 dias: Midtown, Times Square e Central Park",
    "3 dias: mais Estátua, Downtown e Brooklyn",
    "4 dias: Midtown, Central Park, Estátua, Brooklyn e Hudson Yards"
  ];
  var num = document.getElementById("num");
  var dl = document.getElementById("dlabel");
  var dayBtns = document.querySelectorAll(".days button");
  function setDays(n) {
    var sum = 0;
    for (var i = 0; i < n; i++) sum += stops[i];
    num.textContent = sum;
    dl.textContent = labels[n - 1];
    dayBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(+b.dataset.d === n)); });
  }
  dayBtns.forEach(function (b) { b.addEventListener("click", function () { setDays(+b.dataset.d); }); });

  /* showcase tabs */
  var data = [
    ["Whispering Gallery", "De costas para o relógio, siga pelo arco à direita (saída Lexington), vire à direita e desça a rampa. Cada pessoa fala num canto do arco e a outra ouve do lado oposto."],
    ["Estátua da Liberdade de graça", "O Staten Island Ferry é gratuito, sai a cada 30 minutos e a viagem dura uns 20. Na ida, suba até o último andar e fique nas janelas do lado direito. Na volta, garanta um lugar do lado esquerdo."],
    ["Musicais em português", "Áudio-guia ShowTrans para Aladdin, The Book of Mormon, Hadestown, O Rei Leão e Wicked, e legendas em português pelo app GalaPro. Chegue com 30 a 40 minutos de antecedência."],
    ["20 locações de filmes e séries", "Home Alone 2, Friends, Sex and the City, Ghostbusters, Spider-Man e mais, cada uma com endereço que abre no Google Maps."]
  ];
  var tabs = document.querySelectorAll(".tabs button");
  var imgs = document.querySelectorAll(".sq img");
  var st = document.getElementById("st"), sp = document.getElementById("sp");
  function setTab(i) {
    tabs.forEach(function (t, k) { t.setAttribute("aria-selected", String(k === i)); });
    imgs.forEach(function (m, k) { m.classList.toggle("on", k === i); });
    st.textContent = data[i][0]; sp.textContent = data[i][1];
  }
  tabs.forEach(function (t, i) { t.addEventListener("click", function () { setTab(i); }); });

  /* gallery: one frame, contents change */
  var frame = document.getElementById("frame");
  var fi = frame.querySelectorAll("img"), cap = document.getElementById("cap"), cur = 0, timer;
  function show(n) {
    cur = (n + fi.length) % fi.length;
    fi.forEach(function (m, k) { m.classList.toggle("on", k === cur); });
    cap.textContent = fi[cur].dataset.c;
  }
  function auto() { clearInterval(timer); if (!reduce) timer = setInterval(function () { show(cur + 1); }, 2800); }
  frame.addEventListener("click", function () { show(cur + 1); auto(); });
  frame.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") { e.preventDefault(); show(cur + 1); auto(); } });
  auto();

  /* pricing: plan names, one live figure */
  var plans = document.querySelectorAll(".plans button");
  var stages = document.querySelectorAll(".stg");
  function setPlan(k) {
    plans.forEach(function (p) { p.setAttribute("aria-selected", String(p.dataset.pl === k)); });
    stages.forEach(function (s) {
      var on = s.dataset.s === k;
      if (on) { s.hidden = false; s.style.opacity = 0; requestAnimationFrame(function () { s.style.opacity = 1; }); }
      else s.hidden = true;
    });
  }
  plans.forEach(function (p) { p.addEventListener("click", function () { setPlan(p.dataset.pl); }); });
  var lang = (navigator.language || "pt-BR").toLowerCase();
  if (lang.indexOf("pt-br") !== 0 && lang.indexOf("pt") !== 0) setPlan("ca");
  /* checkout links: replace with the two real checkout URLs */
  var BUY = { br: "#checkout-br", ca: "#checkout-ca" };
  document.getElementById("buy-br").href = BUY.br;
  document.getElementById("buy-ca").href = BUY.ca;
})();
