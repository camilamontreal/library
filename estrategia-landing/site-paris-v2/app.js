(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };
  var TXT = window.TXT, lang = "pt";

  /* ---------- checkout links: replace with the two real URLs ---------- */
  var CM = window.CM || {};
  var BUY = CM.buy || { pt: "#checkout-pt", en: "#checkout-en" };

  /* ---------- measurement (only loads what has an ID in config.js) ---------- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  if (CM.ga) { var gs = document.createElement("script"); gs.async = true; gs.src = "https://www.googletagmanager.com/gtag/js?id=" + CM.ga; document.head.appendChild(gs); gtag("js", new Date()); gtag("config", CM.ga); }
  if (CM.pixel) {
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", CM.pixel); window.fbq("track", "PageView");
  }
  function track(name, p) {
    p = p || {}; p.lang = lang;
    try {
      window.dataLayer.push({ event: name, lang: lang, params: p });
      if (CM.ga) gtag("event", name, p);
      if (window.fbq) { if (name === "click_buy") window.fbq("track", "InitiateCheckout", { currency: lang === "pt" ? "BRL" : "CAD" }); else window.fbq("trackCustom", name, p); }
    } catch (e) {}
  }

  /* ---------- dynamic copy in both languages ---------- */
  var DYN = {
    pt: {
      days: [
        { h: "O cartão-postal, do almoço na torre ao cruzeiro.", t: "Torre Eiffel, Trocadéro e Sena", l: "Torre Eiffel", s: ["Trocadéro", "Almoço na Torre Eiffel", "Champ de Mars", "Cruzeiro no Sena", "Cartão-postal da Torre"], tip: "Um mirante pouco conhecido dentro do complexo da Torre.", imgs: ["img/r1-1.webp", "img/r1-2.webp", "img/r1-3.webp"] },
        { h: "Arte, ponte e catedral, e jazz à noite.", t: "Louvre e Notre-Dame", l: "Louvre", s: ["Dentro do Louvre", "Orsay e Orangerie", "Notre-Dame", "Le Marais", "Jazz no Quartier Latin"], tip: "Uma entrada do Louvre sem a fila da pirâmide.", imgs: ["img/r2-1.webp", "img/r2-2.webp", "img/r2-3.webp"] },
        { h: "Onde a Emily corre, almoça e trabalha.", t: "Emily in Paris e jardins", l: "Emily in Paris", s: ["Jardim de Luxemburgo", "Panthéon", "Prédio da Emily", "Restaurante do Gabriel", "Palais-Royal", "Galerie Vivienne"], tip: "A boulangerie do primeiro pain au chocolat da Emily.", imgs: ["img/r3-1.webp", "img/r3-2.webp", "img/r3-3.webp"] },
        { h: "Um bate-volta de dia inteiro, num palácio gigante.", t: "Versalhes", l: "Versalhes", s: ["Palácio e jardins", "Angelina", "Giverny"], tip: "Dá para combinar com o jardim de Monet, em Giverny.", imgs: ["img/r4-1.webp", "img/r4-2.webp", "img/r4-3.webp"] },
        { h: "A avenida mais famosa de Paris, do Arco à Concorde.", t: "Arco do Triunfo e Champs-Élysées", l: "Champs-Élysées", s: ["Arco do Triunfo", "Petit Palais e seu café", "Concorde e Tuileries", "Galeries Lafayette", "Ópera Garnier"], tip: "Um café escondido, de graça, no pátio de um palácio.", imgs: ["img/r5-1.webp", "img/r5-2.webp", "img/r5-3.webp"] },
        { h: "Ladeiras, vinhedo e a Paris do filme Amélie.", t: "Montmartre e Sacré-Cœur", l: "Montmartre", s: ["Sacré-Cœur", "Rue Lepic", "Museu, jardins e vinhedo", "Place du Tertre", "Moulin Rouge", "Disneyland Paris (opcional)"], tip: "Um terraço de graça atrás do Moulin Rouge.", imgs: ["img/r6-1.webp", "img/r6-2.webp", "img/r6-3.webp"] }
      ],
      tips: [
        "Tem um jeito de ver a Torre Eiffel por dentro sem pagar ingresso.",
        "Uma entrada do Louvre sem a fila da pirâmide.",
        "Um terraço de graça atrás do Moulin Rouge.",
        "Onde a água com gás é de graça, em plena rua.",
        "Um café onde você escreve uma carta para você mesma.",
        "A rua do jazz, para escolher o show na hora.",
        "Os três pontos para fotografar a Torre sem gente atrás.",
        "Como escolher um bom restaurante, sem cair em cilada de turista.",
        "O que fazer quando alguém te aborda na rua.",
        "Qual bilhete de transporte vale para o aeroporto.",
        "Uma rota de brechós para quem ama garimpar.",
        "Onde fica o prédio, o restaurante e a boulangerie da Emily."
      ],
      pays: ["Pix", "Cartão", "Boleto", "PayPal"], price: "R$ 67,90",
      per: "à vista, ou em até 9× de R$ 8,92 (parcelas com juros a partir de 2×).",
      pigeon: "Cuu! Pombo parisiense, dono da calçada.", taxi: "Pim pim! Um 2CV passando pelo cais.", cart: "Crepe de carrinho: parada obrigatória em Paris.", rat: "A baguete fugiu da padaria! Corre, pega!"
    },
    en: {
      days: [
        { h: "The postcard view, from lunch in the tower to the cruise.", t: "Eiffel Tower, Trocadéro and the Seine", l: "Eiffel Tower", s: ["Trocadéro", "Lunch in the Eiffel Tower", "Champ de Mars", "Seine cruise", "Eiffel Tower postcard"], tip: "A little-known viewpoint inside the Tower grounds.", imgs: ["img/r1-1.webp", "img/r1-2.webp", "img/r1-3.webp"] },
        { h: "Art, bridge and cathedral, and jazz at night.", t: "Louvre and Notre-Dame", l: "Louvre", s: ["Inside the Louvre", "Orsay and Orangerie", "Notre-Dame", "Le Marais", "Jazz in the Latin Quarter"], tip: "A Louvre entrance without the pyramid line.", imgs: ["img/r2-1.webp", "img/r2-2.webp", "img/r2-3.webp"] },
        { h: "Where Emily jogs, has lunch and works.", t: "Emily in Paris and gardens", l: "Emily in Paris", s: ["Luxembourg Garden", "Panthéon", "Emily's building", "Gabriel's restaurant", "Palais-Royal", "Galerie Vivienne"], tip: "The bakery of Emily's first pain au chocolat.", imgs: ["img/r3-1.webp", "img/r3-2.webp", "img/r3-3.webp"] },
        { h: "A full-day round trip to a giant palace.", t: "Versailles", l: "Versailles", s: ["Palace and gardens", "Angelina", "Giverny"], tip: "You can combine it with Monet's garden, in Giverny.", imgs: ["img/r4-1.webp", "img/r4-2.webp", "img/r4-3.webp"] },
        { h: "The most famous avenue in Paris, from the Arc to the Concorde.", t: "Arc de Triomphe and Champs-Élysées", l: "Champs-Élysées", s: ["Arc de Triomphe", "Petit Palais and its café", "Concorde and Tuileries", "Galeries Lafayette", "Opéra Garnier"], tip: "A hidden, free café in a palace courtyard.", imgs: ["img/r5-1.webp", "img/r5-2.webp", "img/r5-3.webp"] },
        { h: "Hills, a vineyard and the Paris of the movie Amélie.", t: "Montmartre and Sacré-Cœur", l: "Montmartre", s: ["Sacré-Cœur", "Rue Lepic", "Museum, gardens and vineyard", "Place du Tertre", "Moulin Rouge", "Disneyland Paris (optional)"], tip: "A free terrace behind the Moulin Rouge.", imgs: ["img/r6-1.webp", "img/r6-2.webp", "img/r6-3.webp"] }
      ],
      tips: [
        "There's a way to see the Eiffel Tower from the inside without paying a ticket.",
        "A Louvre entrance without the pyramid line.",
        "A free terrace behind the Moulin Rouge.",
        "Where sparkling water is free, right on the street.",
        "A café where you write a letter to yourself.",
        "The jazz street, where you pick the show on the spot.",
        "The three spots to photograph the Tower without people behind you.",
        "How to choose a good restaurant without falling into a tourist trap.",
        "What to do when someone approaches you on the street.",
        "Which transit ticket is valid for the airport.",
        "A thrift-shop route for those who love hunting for treasures.",
        "Where to find Emily's building, restaurant and bakery."
      ],
      pays: ["Card", "PayPal", "Klarna"], price: "CAD 21",
      per: "one-time payment, no subscription.",
      pigeon: "Coo! Parisian pigeon, owner of the sidewalk.", taxi: "Beep beep! A 2CV passing along the quay.", cart: "Street crêpe: a must-stop in Paris.", rat: "The baguette ran away from the bakery! Catch it!"
    }
  };
  function D() { return DYN[lang]; }
  function T(k) { return TXT[lang][k] || TXT.pt[k] || ""; }

  /* ---------- pause what is off screen ---------- */
  var visSet = new Set(), live = document.querySelectorAll(".st,.esc,.band,.zoo");
  function inView(el) { return !document.hidden && (!("IntersectionObserver" in window) || visSet.has(el)); }
  if ("IntersectionObserver" in window) {
    var lio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) visSet.add(e.target); else visSet.delete(e.target); e.target.classList.toggle("off-screen", !e.isIntersecting); });
    }, { rootMargin: "80px 0px" });
    live.forEach(function (s) { lio.observe(s); });
  }

  /* ---------- reveal ---------- */
  var targets = document.querySelectorAll("[data-r]");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (t) { io.observe(t); });
    /* fast flings can skip an element entirely: anything already above the fold counts as seen */
    var pend = Array.prototype.slice.call(targets);
    window.addEventListener("scroll", function () {
      if (!pend.length) return;
      var lim = window.innerHeight * 0.95;
      pend = pend.filter(function (t) { if (t.getBoundingClientRect().top < lim) { t.classList.add("in"); return false; } return true; });
    }, { passive: true });
    setTimeout(function () { targets.forEach(function (t) { t.classList.add("in"); }); pend = []; }, 6000);
  } else { targets.forEach(function (t) { t.classList.add("in"); }); }

  /* ---------- Paris from dawn to night: the scenery travels with the scroll ---------- */
  var world = $("world"), far = $("far"), nearEl = $("near"), sun = $("sun"), starsEl = $("stars");
  var KEYS = [0, .18, .42, .6, .74, .88, 1];
  var SKY = [[246, 215, 207], [252, 235, 214], [250, 227, 212], [246, 203, 143], [200, 107, 125], [58, 27, 51], [31, 16, 48]];
  var SIL = [[236, 200, 196], [238, 214, 196], [234, 200, 190], [196, 140, 122], [120, 52, 80], [40, 18, 40], [22, 10, 30]];
  var NEARC = [[226, 184, 182], [228, 198, 184], [222, 180, 172], [170, 112, 104], [92, 36, 62], [28, 12, 30], [14, 6, 20]];
  function mixc(T, p) {
    var i = 0; while (i < KEYS.length - 2 && p > KEYS[i + 1]) i++;
    var t = Math.max(0, Math.min(1, (p - KEYS[i]) / (KEYS[i + 1] - KEYS[i]))), a = T[i], b = T[i + 1];
    return "rgb(" + [0, 1, 2].map(function (k) { return Math.round(a[k] + (b[k] - a[k]) * t); }).join(",") + ")";
  }
  (function () {
    var s = '<svg viewBox="0 0 4320 120" preserveAspectRatio="xMinYMax slice"><defs><path id="rf" fill-rule="evenodd" d="M0 120V76L18 56H86L104 76H116V62H126V76H134L152 56H218L236 76V54H246V76H256L274 58H338L356 76H360V120ZM40 72h10v10H40ZM62 72h10v10H62ZM170 72h10v10h-10ZM192 72h10v10h-10ZM292 72h10v10h-10ZM314 72h10v10h-10Z"/><rect id="ch" x="0" y="0" width="0" height="0"/></defs>';
    for (var i = 0; i < 12; i++) s += '<use href="#rf" x="' + (i * 360) + '"/><rect x="' + (i * 360 + 30) + '" y="38" width="9" height="20"/><rect x="' + (i * 360 + 186) + '" y="34" width="9" height="24"/>';
    nearEl.innerHTML = s + "</svg>";
  })();
  var starHtml = ""; for (var q = 0; q < 34; q++) starHtml += '<i style="left:' + ((q * 53) % 100) + "%;top:" + ((q * 37) % 56) + "%;--d:" + ((q % 5) * .5) + 's"></i>';
  starsEl.innerHTML = starHtml;
  var vw = window.innerWidth, vh = window.innerHeight, farW = 0, nearW = 0;
  function measureWorld() { vw = window.innerWidth; vh = window.innerHeight; farW = far.getBoundingClientRect().width; nearW = nearEl.getBoundingClientRect().width; }
  var lastP = -1;
  function paintWorld() {
    var max = Math.max(1, document.documentElement.scrollHeight - vh), p = Math.max(0, Math.min(1, window.scrollY / max));
    if (Math.abs(p - lastP) < .0008) return; lastP = p;
    var sky = mixc(SKY, p);
    world.style.background = sky; document.documentElement.style.background = sky;
    world.style.setProperty("--sil", mixc(SIL, p)); world.style.setProperty("--near", mixc(NEARC, p));
    far.style.transform = "translate3d(" + (-p * Math.max(0, farW - vw)) + "px,0,0)";
    nearEl.style.transform = "translate3d(" + (-p * Math.max(0, nearW - vw) * .9) + "px,0,0)";
    var sx = vw * (.04 + .92 * p), sy = vh * (.88 - .8 * Math.sin(Math.PI * p));
    var warm = Math.max(0, Math.min(1, (p - .7) / .15));
    sun.style.transform = "translate3d(" + sx + "px," + sy + "px,0)";
    sun.style.background = warm > 0 ? "rgb(" + Math.round(255 - 11 * warm) + "," + Math.round(217 + 18 * warm) + "," + Math.round(160 + 61 * warm) + ")" : "";
    starsEl.style.opacity = Math.max(0, Math.min(1, (p - .78) / .12));
    document.body.classList.toggle("night", p > .72);
  }

  /* ---------- top bar (current section) ---------- */
  var ledt = $("ledt"), ledn = $("ledn");
  var sts = Array.prototype.slice.call(document.querySelectorAll(".st"));
  var cur = -1, ticking = false;
  function paintLed() { var s = sts[cur < 0 ? 0 : cur]; ledn.textContent = T(s.dataset.st) || ""; }
  function setLed(i) {
    if (i === cur) return; cur = i;
    ledt.classList.add("sw");
    setTimeout(function () { paintLed(); ledt.classList.remove("sw"); }, reduce ? 0 : 160);
  }
  function update() {
    ticking = false;
    var y = window.scrollY + window.innerHeight * 0.38, idx = 0;
    for (var i = 0; i < sts.length; i++) { if (sts[i].getBoundingClientRect().top + window.scrollY - 40 <= y) idx = i; }
    setLed(idx); barUpdate(); paintWorld();
  }
  var bar = $("buybar"), precoSec = document.getElementById("preco"), seenPrice = false;
  function barUpdate() {
    var pi = sts.indexOf(precoSec), show = cur >= 4 && cur < pi;
    bar.classList.toggle("on", show);
    if (!seenPrice && inView(precoSec)) { seenPrice = true; track("view_price"); }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { measureWorld(); lastP = -1; update(); });
  window.addEventListener("load", function () { measureWorld(); lastP = -1; update(); });

  /* ---------- region menu: hand-drawn map + polaroids ---------- */
  var NS = "http://www.w3.org/2000/svg", pinsG = $("pins"), route = $("route"), sel = -1, rdraw = null;
  var PINS = [{ x: 205, y: 304 }, { x: 410, y: 208 }, { x: 404, y: 304 }, { x: 64, y: 352 }, { x: 270, y: 170 }, { x: 392, y: 88 }];
  var COL = ["#5B1A2B", "#9A2F3A", "#B3262F", "#D98C7E", "#C9AE8A", "#4A2F33"];
  function mk(tag, attrs, text) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (text) e.textContent = text; return e; }
  var pinEls = [];
  PINS.forEach(function (p, i) {
    var g = mk("g", { class: "pin", transform: "translate(" + p.x + " " + p.y + ")", tabindex: "0", role: "button" });
    g.appendChild(mk("circle", { r: 19, fill: COL[i] }));
    g.appendChild(mk("text", { class: "pn", "text-anchor": "middle", y: 7, fill: i === 3 || i === 4 ? "#2a1418" : "#fff" }, String(i + 1)));
    var lab = mk("text", { class: "lab", "text-anchor": p.x > 380 ? "end" : "start", x: p.x > 380 ? -28 : 28, y: 8 }, "");
    g.appendChild(lab); pinsG.appendChild(g); pinEls.push({ g: g, lab: lab });
  });
  function drawRoute(a, b) {
    var mx = (a.x + b.x) / 2 + (b.y - a.y) * .18, my = (a.y + b.y) / 2 - (b.x - a.x) * .18;
    route.setAttribute("d", "M" + a.x + " " + a.y + "Q" + mx + " " + my + " " + b.x + " " + b.y);
    if (reduce || !route.animate) return;
    var len = route.getTotalLength(); route.style.strokeDasharray = len;
    if (rdraw) rdraw.cancel();
    rdraw = route.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 800, easing: "ease-out", fill: "forwards" });
  }
  function setDay(i) {
    var prev = sel; sel = i;
    var d = D().days[i];
    document.querySelectorAll("#btns button").forEach(function (b, q) { b.setAttribute("aria-selected", String(q === i)); });
    $("phook").textContent = d.h; $("pls").style.setProperty("--rc", COL[i]);
    $("ptt").textContent = d.t;
    d.imgs.forEach(function (s, q) { var im = $("pg" + q); if (im.getAttribute("src") !== s) { im.src = s; var f = im.parentNode; f.classList.remove("drop"); void f.offsetWidth; f.classList.add("drop"); } });
    $("pls").innerHTML = d.s.map(function (n) { return "<li>" + n + "</li>"; }).join("") + '<li class="tipli">' + d.tip + "</li>";
    pinEls.forEach(function (p, q) { p.g.classList.toggle("on", q === i); p.lab.textContent = D().days[q].l; });
    if (prev !== i) drawRoute(PINS[prev < 0 ? 0 : prev], PINS[i]);
  }
  document.querySelectorAll("#btns button").forEach(function (b) { b.addEventListener("click", function () { setDay(+b.dataset.i); }); });
  pinEls.forEach(function (p, i) { p.g.addEventListener("click", function () { setDay(i); }); p.g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setDay(i); } }); });
  setDay(0);

  /* ---------- tips on the quay ---------- */
  var ti = 0, tm = $("tmsg");
  function nextTip() {
    if (!inView(document.querySelector(".esc"))) return;
    var n; do { n = Math.floor(Math.random() * D().tips.length); } while (n === ti);
    ti = n; tm.classList.add("sw");
    setTimeout(function () { tm.textContent = D().tips[ti]; tm.classList.remove("sw"); }, reduce ? 0 : 220);
  }
  $("tnext").addEventListener("click", function () { nextTip(); });
  if (!reduce) setInterval(nextTip, 7000);

  /* ---------- easter eggs ---------- */
  var toast = $("toast"), tt, pg = $("pigeon");
  function say(t) { toast.textContent = t; toast.classList.add("on"); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove("on"); }, 2400); }
  pg.addEventListener("click", function () {
    say(D().pigeon);
    if (!reduce) { pg.classList.add("fly"); setTimeout(function () { pg.classList.remove("fly"); }, 3200); }
  });

  /* ---------- price + postcard stamp (follows the language) ---------- */
  var busy = false, buy = $("buy");
  function paintPrice() {
    $("mprice").textContent = D().price; $("per").textContent = D().per;
    buy.href = BUY[lang]; $("bbtn").href = BUY[lang]; $("bbp").textContent = D().price;
    $("pays").innerHTML = D().pays.map(function (n) { return "<li>" + n + "</li>"; }).join("");
    $("help").href = CM.contact || $("help").href; $("flink").href = CM.contact || $("flink").href;
  }
  $("bbtn").addEventListener("click", function () { track("click_buy", { from: "bar" }); });
  $("help").addEventListener("click", function () { track("click_help"); });
  buy.addEventListener("click", function (e) {
    track("click_buy", { from: "card" });
    if (reduce || busy) return;
    e.preventDefault(); busy = true;
    document.querySelector(".pay").classList.add("go");
    setTimeout(function () { window.location.href = BUY[lang]; busy = false; }, 1400);
  });

  /* ---------- facade windows (included) ---------- */
  var fac = $("fac"), wins = Array.prototype.slice.call(fac.querySelectorAll(".win")), wSel = -1, wTouched = false;
  function showWin(i, auto) {
    if (!auto) wTouched = true;
    wSel = i;
    wins.forEach(function (b, k) { b.setAttribute("aria-expanded", String(k === i)); });
    var c = $("skycard");
    if (i < 0) { c.classList.remove("on"); return; }
    $("skt").textContent = wins[i].querySelector(".bt").textContent;
    $("skd").textContent = wins[i].querySelector(".bd").textContent;
    c.classList.add("on");
  }
  wins.forEach(function (b, i) { b.addEventListener("click", function () { showWin(wSel === i ? -1 : i); }); });
  showWin(-1);
  if ("IntersectionObserver" in window && !reduce) {
    new IntersectionObserver(function (es, o) {
      if (!es[0].isIntersecting) return; o.disconnect();
      setTimeout(function () { if (!wTouched) showWin(4, true); }, 500);
      setTimeout(function () { if (!wTouched) showWin(-1, true); }, 2300);
    }, { threshold: .5 }).observe(fac);
  }

  /* ---------- guide viewer ---------- */
  var VC = { pt: ["Sumário clicável.", "Torre Eiffel, Trocadéro e Sena.", "Emily in Paris.", "Onde ficar.", "Favoritos e virais.", "Looks e fotos."],
             en: ["Clickable contents.", "Eiffel Tower, Trocadéro and the Seine.", "Emily in Paris.", "Where to stay.", "Favorites and viral spots.", "Looks and photos."] };
  var vimg = $("vimg"), vth = Array.prototype.slice.call(document.querySelectorAll("#vthumbs button")), vi = 0, vt;
  function setV(i) {
    vi = (i + vth.length) % vth.length;
    vimg.classList.add("sw");
    setTimeout(function () { vimg.src = "img/g" + (vi + 1) + ".webp"; vimg.classList.remove("sw"); }, reduce ? 0 : 160);
    vth.forEach(function (b, k) { b.classList.toggle("on", k === vi); });
    $("vcap").textContent = VC[lang][vi];
  }
  vth.forEach(function (b, i) { b.addEventListener("click", function () { setV(i); clearInterval(vt); }); });
  $("vprev").addEventListener("click", function () { setV(vi - 1); clearInterval(vt); });
  $("vnext").addEventListener("click", function () { setV(vi + 1); clearInterval(vt); });
  if (!reduce) vt = setInterval(function () { if (inView($("viewer").closest(".st"))) setV(vi + 1); }, 4500);

  /* ---------- update sign messages ---------- */
  var BM = { pt: ["Sempre que eu conhecer um lugar novo, você vai saber.", "Você recebe pelo mesmo link do guia.", "Sem pagar nada a mais."], en: ["Whenever I discover a new place, you'll know.", "You get it through the same guide link.", "At no extra cost."] };
  var bi = 0, bmsg = $("bmsg"), bbl = document.querySelectorAll(".mrow .bl");
  function bulb() { bbl.forEach(function (b, k) { b.classList.toggle("on", k === bi); }); }
  bulb();
  if (!reduce) setInterval(function () {
    if (!inView(document.querySelector(".band"))) return;
    bi = (bi + 1) % 3; bulb(); bmsg.classList.add("sw");
    setTimeout(function () { bmsg.textContent = BM[lang][bi]; bmsg.classList.remove("sw"); }, 220);
  }, 3800);

  /* ---------- polaroids you can drag ---------- */
  var zTop = 10;
  Array.prototype.forEach.call(document.querySelectorAll("#pols .pol"), function (p) {
    var sx = 0, sy = 0, tx = 0, ty = 0, on = false;
    p.addEventListener("pointerdown", function (e) { on = true; sx = e.clientX - tx; sy = e.clientY - ty; p.style.zIndex = ++zTop; p.classList.add("lift"); try { p.setPointerCapture(e.pointerId); } catch (x) {} });
    p.addEventListener("pointermove", function (e) { if (!on) return; tx = e.clientX - sx; ty = e.clientY - sy; p.style.setProperty("--tx", tx + "px"); p.style.setProperty("--ty", ty + "px"); });
    function end() { on = false; p.classList.remove("lift"); }
    p.addEventListener("pointerup", end); p.addEventListener("pointercancel", end);
  });

  /* ---------- warm up the lazy images so they are never blank ---------- */
  function warm() { document.querySelectorAll("img[loading=lazy]").forEach(function (m) { m.loading = "eager"; }); }
  if (document.readyState === "complete") setTimeout(warm, 600); else window.addEventListener("load", function () { setTimeout(warm, 600); });

  /* ---------- language: PT / EN ---------- */
  function applyLang(l) {
    var changed = l !== lang; lang = l; if (changed && started0) track("change_language", { to: l });
    document.documentElement.lang = l === "pt" ? "pt-BR" : "en";
    document.querySelectorAll("[data-k]").forEach(function (el) { var v = TXT[l][el.dataset.k]; if (v != null) el.innerHTML = v; });
    document.querySelectorAll(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.l === l)); });
    try { localStorage.setItem("cm-lang", l); } catch (e) {}
    document.querySelector(".pay").classList.remove("go");
    tm.textContent = D().tips[ti];
    paintLed(); paintPrice(); setDay(sel); showWin(wSel, true); $("vcap").textContent = VC[lang][vi]; bmsg.textContent = BM[lang][bi];
  }
  document.querySelectorAll(".lang button").forEach(function (b) { b.addEventListener("click", function () { applyLang(b.dataset.l); }); });
  var started0 = false;
  var saved = null; try { saved = localStorage.getItem("cm-lang"); } catch (e) {}
  var start = saved || ((navigator.language || "pt").toLowerCase().indexOf("pt") === 0 ? "pt" : "en");
  cur = -1; measureWorld(); applyLang(start); update(); started0 = true;
})();
