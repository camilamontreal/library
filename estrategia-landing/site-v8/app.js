(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };
  var TXT = window.TXT, lang = "pt";

  /* ---------- checkout links: replace with the two real URLs ---------- */
  var BUY = { pt: "#checkout-pt", en: "#checkout-en" };

  /* ---------- dynamic copy in both languages ---------- */
  var DYN = {
    pt: {
      days: [
        { t: "Midtown e Times Square", n: "16 paradas", s: ["Grand Central Terminal", "Summit One Vanderbilt", "Biblioteca Pública", "Bryant Park", "Times Square"], tip: "Segredo: Whispering Gallery, na Grand Central.", img: "img/gc.webp" },
        { t: "Central Park, Upper West e Midtown", n: "11 paradas", s: ["Museu de História Natural", "Central Park", "Upper West Side"], tip: "Entre pelo Gilder Center às 10h: quase sem fila.", img: "img/park.webp" },
        { t: "Estátua, Downtown e Brooklyn", n: "16 paradas", s: ["Staten Island Ferry", "Estátua da Liberdade", "Downtown", "Ponte do Brooklyn"], tip: "O Staten Island Ferry é gratuito e passa pertinho da Estátua.", img: "img/ferry.webp" },
        { t: "Hudson Yards, Chelsea e Downtown", n: "14 paradas", s: ["Hudson Yards", "Vessel", "Chelsea", "Downtown"], tip: "Prédio de Friends: só a fachada, o Central Perk não existe.", img: "img/vessel.webp" },
        { t: "Mais dias, mais ideias", n: "extras do guia", s: ["Bate-voltas: Washington, Filadélfia, Boston, Niagara Falls e Long Island", "Harlem", "Passeios pela cidade e arredores"], tip: "Cada dia é independente: se você fica menos, escolha os dias que combinam.", img: "img/aerial.webp" }
      ],
      tips: [
        "Visite o Summit One Vanderbilt no primeiro horário para evitar multidões.",
        "Staten Island Ferry: gratuito e passa pertinho da Estátua da Liberdade.",
        "Antes de pedir o café, procure promoções. Eu paguei US$ 2 em vez de 4 só perguntando.",
        "Banheiro público é raro em Nova York. Veja a aba de banheiros gratuitos no mapa.",
        "Entre pelo Gilder Center às 10h no Museu de História Natural: quase sem fila.",
        "Loteria da Broadway: ingressos bem mais baratos, e há legendas em português.",
        "Whispering Gallery, na Grand Central: cada pessoa fala num canto e a outra ouve do lado oposto."
      ],
      caps: ["Sumário: toque e vá direto para o dia ou a seção que você precisa.", "Dia 1: paradas da manhã com segredos e links de reserva.", "Dia 3: a Estátua da Liberdade, com a dica de economizar.", "Onde comer: bairro, endereço e o que pedir.", "Broadway em português e a loteria de ingressos.", "Locações de filmes, com endereço no Google Maps."],
      posters: [
        ["Whispering Gallery", "De costas para o relógio, siga pelo arco à direita (saída Lexington), vire à direita e desça a rampa. Cada pessoa fala num canto do arco e a outra ouve do lado oposto."],
        ["Estátua da Liberdade de graça", "O Staten Island Ferry é gratuito, sai a cada 30 minutos e a viagem dura uns 20. Na ida, suba até o último andar e fique nas janelas do lado direito. Na volta, garanta um lugar do lado esquerdo."],
        ["Musicais em português", "Áudio-guia ShowTrans para Aladdin, The Book of Mormon, Hadestown, O Rei Leão e Wicked, e legendas em português pelo app GalaPro. Chegue com 30 a 40 minutos de antecedência."],
        ["20 locações de filmes e séries", "Home Alone 2, Friends, Sex and the City, Ghostbusters, Spider-Man e mais, cada uma com endereço que abre no Google Maps."]
      ],
      people: " pessoas", price: "R$ 67,90",
      per: "à vista, ou em até 9× de R$ 8,92 (parcelas com juros a partir de 2×). Cartão, Pix, boleto ou PayPal.",
      scrOk: "Liberado · bom embarque",
      pigeon: "Cuu! Pombo de Nova York, dono da plataforma.", rat: "Pizza rat! Esse levou a fatia até a escada.", sndOn: "Som ligado", sndOff: "Som desligado"
    },
    en: {
      days: [
        { t: "Midtown and Times Square", n: "16 stops", s: ["Grand Central Terminal", "Summit One Vanderbilt", "Public Library", "Bryant Park", "Times Square"], tip: "Secret: the Whispering Gallery, at Grand Central.", img: "img/gc.webp" },
        { t: "Central Park, Upper West and Midtown", n: "11 stops", s: ["Natural History Museum", "Central Park", "Upper West Side"], tip: "Enter through the Gilder Center at 10am: almost no line.", img: "img/park.webp" },
        { t: "Statue, Downtown and Brooklyn", n: "16 stops", s: ["Staten Island Ferry", "Statue of Liberty", "Downtown", "Brooklyn Bridge"], tip: "The Staten Island Ferry is free and passes close to the Statue.", img: "img/ferry.webp" },
        { t: "Hudson Yards, Chelsea and Downtown", n: "14 stops", s: ["Hudson Yards", "Vessel", "Chelsea", "Downtown"], tip: "The Friends building: just the facade, Central Perk doesn't exist.", img: "img/vessel.webp" },
        { t: "More days, more ideas", n: "guide extras", s: ["Day trips: Washington, Philadelphia, Boston, Niagara Falls and Long Island", "Harlem", "Outings around the city and nearby"], tip: "Each day is independent: if you stay less, pick the days that suit you.", img: "img/aerial.webp" }
      ],
      tips: [
        "Visit Summit One Vanderbilt at the first time slot to avoid the crowds.",
        "Staten Island Ferry: free, and it passes close to the Statue of Liberty.",
        "Before ordering coffee, look for deals. I paid US$ 2 instead of 4 just by asking.",
        "Public restrooms are rare in New York. Check the free restrooms tab on the map.",
        "Enter the Natural History Museum through the Gilder Center at 10am: almost no line.",
        "Broadway lottery: much cheaper tickets, and there are Portuguese subtitles.",
        "Whispering Gallery at Grand Central: one person talks in a corner and the other hears from the opposite side."
      ],
      caps: ["Contents: tap to jump straight to the day or section you need.", "Day 1: morning stops with secrets and booking links.", "Day 3: the Statue of Liberty, with the saving tip.", "Where to eat: neighborhood, address and what to order.", "Broadway in Portuguese and the ticket lottery.", "Movie locations, with an address on Google Maps."],
      posters: [
        ["Whispering Gallery", "With your back to the clock, take the arch on the right (Lexington exit), turn right and go down the ramp. One person speaks into a corner of the arch and the other hears from the opposite side."],
        ["Statue of Liberty for free", "The Staten Island Ferry is free, leaves every 30 minutes and the ride takes about 20. Going, head to the top deck and stand at the right-side windows. Coming back, grab a spot on the left."],
        ["Musicals in Portuguese", "ShowTrans audio guide for Aladdin, The Book of Mormon, Hadestown, The Lion King and Wicked, and Portuguese subtitles through the GalaPro app. Arrive 30 to 40 minutes early."],
        ["20 movie and TV locations", "Home Alone 2, Friends, Sex and the City, Ghostbusters, Spider-Man and more, each one with an address that opens in Google Maps."]
      ],
      people: " people", price: "CAD 21",
      per: "one-time payment, no subscription. Card, PayPal or Klarna.",
      scrOk: "Cleared · enjoy the ride",
      pigeon: "Coo! New York pigeon, owner of the platform.", rat: "Pizza rat! This one carried the slice all the way to the stairs.", sndOn: "Sound on", sndOff: "Sound off"
    }
  };
  function D() { return DYN[lang]; }
  function T(k) { return TXT[lang][k] || TXT.pt[k] || ""; }

  /* ---------- reveal ---------- */
  var targets = document.querySelectorAll("[data-r],.peek");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (t) { io.observe(t); });
    setTimeout(function () { targets.forEach(function (t) { t.classList.add("in"); }); }, 6000);
  } else { targets.forEach(function (t) { t.classList.add("in"); }); }

  /* ---------- train on the rail + LED ---------- */
  var line = $("line"), train = $("train"), prog = $("prog"), ledt = $("ledt"), ledb = $("ledb"), ledn = $("ledn");
  var sts = Array.prototype.slice.call(document.querySelectorAll(".st"));
  var tops = [], lineTop = 0, cur = -1, ticking = false;
  function measure() {
    lineTop = line.getBoundingClientRect().top + window.scrollY;
    tops = sts.map(function (s) { return s.getBoundingClientRect().top + window.scrollY + parseFloat(getComputedStyle(s).paddingTop) + 6; });
  }
  function paintLed() { var s = sts[cur < 0 ? 0 : cur]; ledn.textContent = T(s.dataset.st) || ""; }
  function setLed(i) {
    if (i === cur) return; cur = i;
    var s = sts[i];
    ledt.classList.add("sw");
    setTimeout(function () {
      paintLed(); ledb.textContent = s.dataset.b; ledb.className = "bl " + s.dataset.bc;
      line.style.setProperty("--line", s.dataset.c); ledt.classList.remove("sw");
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
    for (var i = 0; i < tops.length; i++) { if (tops[i] - 40 <= y) idx = i; if (Math.abs(tops[i] - y) < 70) near = true; }
    train.classList.toggle("open", near);
    setLed(idx);
    sts.forEach(function (s, k) { s.classList.toggle("in", k <= idx); });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { measure(); update(); });
  window.addEventListener("load", function () { measure(); update(); });

  /* ---------- day menu: map + preview ---------- */
  var NS = "http://www.w3.org/2000/svg", stns = $("stns"), tr = $("tr"), anim = 0, sel = 0;
  function mk(tag, attrs, text) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (text) e.textContent = text; return e; }
  function setDay(i) {
    sel = i; cancelAnimationFrame(anim);
    var d = D().days[i];
    document.querySelectorAll("#btns button").forEach(function (b, q) { b.setAttribute("aria-selected", String(q === i)); });
    $("rt").textContent = d.t; $("rn").textContent = d.n;
    $("ptt").textContent = d.t; $("ptp").textContent = d.tip; $("pimg").src = d.img;
    $("pls").innerHTML = d.s.map(function (n) { return "<li>" + n + "</li>"; }).join("");
    stns.innerHTML = ""; tr.setAttribute("cx", -20); tr.setAttribute("cy", -20);
    for (var q = 0; q < 4; q++) { $("L" + q).classList.toggle("on", i === 4 || q === i); }
    if (i === 4) return;
    var path = $("L" + i), L = path.getTotalLength(), k = d.s.length;
    var items = d.s.map(function (name, q) {
      var f = (q + .5) / k, p = path.getPointAtLength(L * f), right = p.x < 560;
      var c = mk("circle", { class: "stn", cx: p.x, cy: p.y, r: 11 });
      var t = mk("text", { class: "lab", x: p.x + (right ? 18 : -18), y: p.y - 14, "text-anchor": right ? "start" : "end" }, name);
      stns.appendChild(c); stns.appendChild(t);
      return { f: f, c: c, t: t };
    });
    function show(x) { x.c.classList.add("on"); x.t.classList.add("on"); }
    if (reduce) { items.forEach(show); return; }
    var t0 = performance.now(), dur = 2200;
    (function step(now) {
      var p = Math.min((now - t0) / dur, 1), e2 = 1 - Math.pow(1 - p, 3), pt = path.getPointAtLength(L * e2);
      tr.setAttribute("cx", pt.x); tr.setAttribute("cy", pt.y);
      items.forEach(function (x) { if (e2 >= x.f - .02) show(x); });
      if (p < 1) anim = requestAnimationFrame(step);
    })(t0);
  }
  document.querySelectorAll("#btns button").forEach(function (b) { b.addEventListener("click", function () { setDay(+b.dataset.i); chime("tick"); }); });
  var started = false;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { if (es[0].isIntersecting && !started) { started = true; setDay(sel); } }, { threshold: .3 }).observe($("map"));
  } else { setDay(0); }
  setDay(0);

  /* ---------- guide pages ---------- */
  var frame = $("frame"), fi = frame.querySelectorAll("img"), cap = $("cap"), dots = $("dots"), cur2 = 0, timer;
  fi.forEach(function () { dots.appendChild(document.createElement("i")); });
  function show2(n) {
    cur2 = (n + fi.length) % fi.length;
    fi.forEach(function (m, k) { m.classList.toggle("on", k === cur2); });
    dots.querySelectorAll("i").forEach(function (d, k) { d.classList.toggle("on", k === cur2); });
    cap.textContent = D().caps[cur2];
  }
  function auto() { clearInterval(timer); if (!reduce) timer = setInterval(function () { show2(cur2 + 1); }, 3200); }
  frame.addEventListener("click", function () { show2(cur2 + 1); auto(); });
  frame.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") { e.preventDefault(); show2(cur2 + 1); auto(); } });
  auto();

  /* ---------- included boxes ---------- */
  document.querySelectorAll(".bx").forEach(function (b) {
    b.addEventListener("click", function () {
      var open = b.getAttribute("aria-expanded") === "true";
      b.setAttribute("aria-expanded", String(!open)); chime("tick");
    });
  });

  /* ---------- posters ---------- */
  var tabs = document.querySelectorAll(".tabs [data-t]"), pimgs = document.querySelectorAll(".poster .ph img"), pt = 0;
  function setPoster(i) {
    pt = i;
    tabs.forEach(function (b, k) { b.setAttribute("aria-selected", String(k === i)); });
    pimgs.forEach(function (m, k) { m.classList.toggle("on", k === i); });
    $("st1h").textContent = D().posters[i][0]; $("sp1").textContent = D().posters[i][1];
  }
  tabs.forEach(function (t, i) { t.addEventListener("click", function () { setPoster(i); }); });

  /* ---------- crowd slider (illustration) ---------- */
  var hour = $("hour"), dA = $("dA"), dB = $("dB");
  function mkDots(el) { for (var i = 0; i < 40; i++) el.appendChild(document.createElement("i")); }
  mkDots(dA); mkDots(dB);
  function crowd(h) {
    function bump(x, m, s) { return Math.exp(-Math.pow((x - m) / s, 2)); }
    return Math.min(40, Math.round(6 + 34 * Math.max(bump(h, 8.5, 1.8), bump(h, 17.5, 2.2)) + 6 * bump(h, 13, 3)));
  }
  function setHour() {
    var h = +hour.value, a = crowd(h), b = Math.max(3, Math.round(a * 0.3));
    $("hout").textContent = (h < 10 ? "0" : "") + h + ":00";
    dA.querySelectorAll("i").forEach(function (d, k) { d.classList.toggle("on", k < a); });
    dB.querySelectorAll("i").forEach(function (d, k) { d.classList.toggle("on", k < b); });
    $("cA").textContent = a + D().people; $("cB").textContent = b + D().people;
  }
  hour.addEventListener("input", setHour);

  /* ---------- station announcements ---------- */
  var ti = 0, tm = $("tmsg");
  function nextTip() {
    var n; do { n = Math.floor(Math.random() * D().tips.length); } while (n === ti);
    ti = n; tm.classList.add("sw");
    setTimeout(function () { tm.textContent = D().tips[ti]; tm.classList.remove("sw"); }, reduce ? 0 : 220);
  }
  $("tnext").addEventListener("click", function () { nextTip(); chime("tick"); });
  if (!reduce) setInterval(nextTip, 7000);

  /* ---------- sound (Web Audio, no files) ---------- */
  var actx, soundOn = false, snd = $("snd");
  function chime(kind) {
    if (!soundOn) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      var notes = kind === "tick" ? [988] : [880, 659], t = actx.currentTime;
      notes.forEach(function (f, i) {
        var o = actx.createOscillator(), g = actx.createGain();
        o.type = "sine"; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t + i * 0.28);
        g.gain.exponentialRampToValueAtTime(0.18, t + i * 0.28 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.28 + 0.5);
        o.connect(g); g.connect(actx.destination); o.start(t + i * 0.28); o.stop(t + i * 0.28 + 0.55);
      });
    } catch (e) {}
  }
  function paintSnd() { snd.textContent = soundOn ? D().sndOn : D().sndOff; snd.setAttribute("aria-pressed", String(soundOn)); }
  snd.addEventListener("click", function () { soundOn = !soundOn; paintSnd(); chime("door"); });

  /* ---------- easter eggs ---------- */
  var toast = $("toast"), tt, pg = $("pigeon"), rat = $("rat");
  function say(t) { toast.textContent = t; toast.classList.add("on"); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove("on"); }, 2400); }
  pg.addEventListener("click", function () {
    say(D().pigeon);
    if (!reduce) { pg.classList.add("fly"); setTimeout(function () { pg.classList.remove("fly"); }, 3200); }
  });
  rat.addEventListener("click", function () { say(D().rat); });

  /* ---------- price + turnstile (follows the language) ---------- */
  var busy = false, buy = $("buy");
  function paintPrice() {
    $("mprice").textContent = D().price; $("per").textContent = D().per;
    $("buyp").textContent = " · " + D().price; buy.href = BUY[lang];
  }
  buy.addEventListener("click", function (e) {
    chime("door");
    if (reduce || busy) return;
    e.preventDefault(); busy = true;
    document.querySelector(".pay").classList.add("go");
    setTimeout(function () { $("gt").classList.add("ok"); $("scrt").textContent = D().scrOk; }, 700);
    setTimeout(function () { window.location.href = BUY[lang]; busy = false; }, 1500);
  });

  /* ---------- language: PT / EN ---------- */
  function applyLang(l) {
    lang = l;
    document.documentElement.lang = l === "pt" ? "pt-BR" : "en";
    document.querySelectorAll("[data-k]").forEach(function (el) { var v = TXT[l][el.dataset.k]; if (v != null) el.innerHTML = v; });
    document.querySelectorAll(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.l === l)); });
    try { localStorage.setItem("cm-lang", l); } catch (e) {}
    $("gt").classList.remove("ok"); $("scrt").textContent = T("scr0"); document.querySelector(".pay").classList.remove("go");
    tm.textContent = D().tips[ti];
    paintLed(); paintSnd(); paintPrice(); show2(cur2); setPoster(pt); setHour(); setDay(sel);
  }
  document.querySelectorAll(".lang button").forEach(function (b) { b.addEventListener("click", function () { applyLang(b.dataset.l); }); });
  var saved = null; try { saved = localStorage.getItem("cm-lang"); } catch (e) {}
  var start = saved || ((navigator.language || "pt").toLowerCase().indexOf("pt") === 0 ? "pt" : "en");
  measure(); cur = -1; applyLang(start); update();
})();
