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
        { h: "O coração de Manhattan, de mirante em mirante.", t: "Midtown e Times Square", n: "16 paradas", s: ["Grand Central Terminal", "Summit One Vanderbilt", "Biblioteca Pública", "Bryant Park", "Times Square"], tip: "Segredo: Whispering Gallery, na Grand Central.", imgs: ["img/gc.webp","img/ts.webp","img/friends.webp"] },
        { h: "Verde, museus e um bairro para caminhar.", t: "Central Park, Upper West e Midtown", n: "11 paradas", s: ["Museu de História Natural", "Central Park", "Upper West Side"], tip: "Entre pelo Gilder Center às 10h: quase sem fila.", imgs: ["img/park.webp","img/vb-rink.webp","img/vb-empire-view.webp"] },
        { h: "A Estátua, os arranha-céus e a ponte mais famosa.", t: "Estátua, Downtown e Brooklyn", n: "16 paradas", s: ["Staten Island Ferry", "Estátua da Liberdade", "Downtown", "Ponte do Brooklyn"], tip: "O Staten Island Ferry é gratuito e passa pertinho da Estátua.", imgs: ["img/ferry.webp","img/statue.webp","img/vb-brooklyn-bridge.webp"] },
        { h: "O bairro novo, com vista e muita arquitetura.", t: "Hudson Yards, Chelsea e Downtown", n: "14 paradas", s: ["Hudson Yards", "Vessel", "Chelsea", "Downtown"], tip: "Prédio de Friends: só a fachada, o Central Perk não existe.", imgs: ["img/vessel.webp","img/vb-hudson.webp","img/vb-edge.webp"] },
        { h: "Ideias para quando você tem mais dias.", t: "Mais dias, mais ideias", n: "extras do guia", s: ["Bate-voltas: Washington, Filadélfia, Boston, Niagara Falls e Long Island", "Harlem", "Passeios pela cidade e arredores"], tip: "Cada dia é independente: se você fica menos, escolha os dias que combinam.", imgs: ["img/aerial.webp","img/vb-bridge-walk.webp","img/vb-balloons.webp"] }
      ],
      tips: [
        "Tem um segredo escondido numa das estações mais famosas da cidade.",
        "Eu conto como ver os cartões-postais da cidade gastando menos.",
        "Um horário que muda tudo em um dos museus mais cheios de Nova York.",
        "Um perrengue de US$ 200 na primeira hora que você vai poder evitar.",
        "Onde achar banheiro de graça, o que é raro em Manhattan.",
        "Como assistir a um musical da Broadway mesmo sem falar inglês.",
        "Spots de foto com o melhor ângulo, e a hora certa para cada um.",
        "Onde comer bem sem cair em cilada de turista.",
        "Qual cartão de transporte compensa para a sua viagem.",
        "Quais bairros combinar no mesmo dia para não perder tempo.",
        "O que muda no roteiro no inverno e no verão.",
        "Locações de filmes e séries, com endereço direto no mapa."
      ],
      people: " pessoas", pays: ["Pix", "Cartão", "Boleto", "PayPal"], price: "R$ 67,90",
      per: "à vista, ou em até 9× de R$ 8,92 (parcelas com juros a partir de 2×).",
     
      pigeon: "Cuu! Pombo de Nova York, dono da plataforma.", taxi: "Beep beep! Táxi amarelo livre.", squirrel: "O esquilo do Central Park achou uma noz!", cart: "Hot dog de carrinho: parada obrigatória em NY.", kk: "Toque em um prédio!", rat: "Pizza rat! Esse levou a fatia até a escada."
    },
    en: {
      days: [
        { h: "The heart of Manhattan, from viewpoint to viewpoint.", t: "Midtown and Times Square", n: "16 stops", s: ["Grand Central Terminal", "Summit One Vanderbilt", "Public Library", "Bryant Park", "Times Square"], tip: "Secret: the Whispering Gallery, at Grand Central.", imgs: ["img/gc.webp","img/ts.webp","img/friends.webp"] },
        { h: "Green space, museums and a neighborhood to walk.", t: "Central Park, Upper West and Midtown", n: "11 stops", s: ["Natural History Museum", "Central Park", "Upper West Side"], tip: "Enter through the Gilder Center at 10am: almost no line.", imgs: ["img/park.webp","img/vb-rink.webp","img/vb-empire-view.webp"] },
        { h: "The Statue, the skyscrapers and the most famous bridge.", t: "Statue, Downtown and Brooklyn", n: "16 stops", s: ["Staten Island Ferry", "Statue of Liberty", "Downtown", "Brooklyn Bridge"], tip: "The Staten Island Ferry is free and passes close to the Statue.", imgs: ["img/ferry.webp","img/statue.webp","img/vb-brooklyn-bridge.webp"] },
        { h: "The new neighborhood, with views and great architecture.", t: "Hudson Yards, Chelsea and Downtown", n: "14 stops", s: ["Hudson Yards", "Vessel", "Chelsea", "Downtown"], tip: "The Friends building: just the facade, Central Perk doesn't exist.", imgs: ["img/vessel.webp","img/vb-hudson.webp","img/vb-edge.webp"] },
        { h: "Ideas for when you have more days.", t: "More days, more ideas", n: "guide extras", s: ["Day trips: Washington, Philadelphia, Boston, Niagara Falls and Long Island", "Harlem", "Outings around the city and nearby"], tip: "Each day is independent: if you stay less, pick the days that suit you.", imgs: ["img/aerial.webp","img/vb-bridge-walk.webp","img/vb-balloons.webp"] }
      ],
      tips: [
        "There's a secret hidden in one of the city's most famous stations.",
        "I tell you how to see the city's postcards while spending less.",
        "A time of day that changes everything at one of New York's busiest museums.",
        "A US$ 200 mishap in the first hour that you'll be able to avoid.",
        "Where to find a free restroom, which is rare in Manhattan.",
        "How to watch a Broadway musical even if you don't speak English.",
        "Photo spots with the best angle, and the right time for each one.",
        "Where to eat well without falling into a tourist trap.",
        "Which transit card is worth it for your trip.",
        "Which neighborhoods to combine on the same day to save time.",
        "What changes in the itinerary in winter and in summer.",
        "Movie and series locations, with the address right on the map."
      ],
      people: " people", pays: ["Card", "PayPal", "Klarna"], price: "CAD 21",
      per: "one-time payment, no subscription.",
     
      pigeon: "Coo! New York pigeon, owner of the platform.", taxi: "Beep beep! Yellow cab available.", squirrel: "The Central Park squirrel found a nut!", cart: "Street hot dog: a must-stop in NYC.", kk: "Tap a building!", rat: "Pizza rat! This one carried the slice all the way to the stairs."
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
  var targets = document.querySelectorAll("[data-r],.peek");
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

  /* ---------- train on the rail + LED ---------- */
  var line = $("line"), train = $("train"), ledt = $("ledt"), ledb = $("ledb"), ledn = $("ledn");
  var sts = Array.prototype.slice.call(document.querySelectorAll(".st"));
  var tops = [], lineTop = 0, cur = -1, ticking = false;
  var lineH = 0, railH = 1, lastIdx = -1, lastNear = false;
  function measure() {
    lineH = line.offsetHeight; railH = Math.max(1, lineH - 46);
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
    var h = lineH - 64 - 46;
    var ty = Math.max(0, Math.min(y - lineTop - 46 - 32, h));
    var idx = 0, near = false;
    for (var i = 0; i < tops.length; i++) { if (tops[i] - 40 <= y) idx = i; if (Math.abs(tops[i] - y) < 70) near = true; }
    if (near !== lastNear) { lastNear = near; train.classList.toggle("open", near); }
    setLed(idx); barUpdate();
    if (idx !== lastIdx) { lastIdx = idx; sts.forEach(function (s, k) { s.classList.toggle("in", k <= idx); }); }
  }
  var bar = $("buybar"), precoSec = document.getElementById("preco"), seenPrice = false;
  function barUpdate() {
    var show = window.scrollY > window.innerHeight * 0.9 && !inView(precoSec);
    bar.classList.toggle("on", show);
    if (!seenPrice && inView(precoSec)) { seenPrice = true; track("view_price"); }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  if ("ResizeObserver" in window) { var rmt; new ResizeObserver(function () { clearTimeout(rmt); rmt = setTimeout(function () { measure(); onScroll(); }, 120); }).observe(line); }
  window.addEventListener("resize", function () { measure(); update(); });
  window.addEventListener("load", function () { measure(); update(); });

  /* ---------- day menu: map + preview ---------- */
  var NS = "http://www.w3.org/2000/svg", stns = $("stns"), tr = $("tr"), anim = 0, sel = 0;
  function mk(tag, attrs, text) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (text) e.textContent = text; return e; }
  function setDay(i) {
    sel = i; cancelAnimationFrame(anim);
    var d = D().days[i];
    document.querySelectorAll("#btns button").forEach(function (b, q) { b.setAttribute("aria-selected", String(q === i)); });
    $("rt").textContent = d.t; $("rn").textContent = d.n; $("phook").textContent = d.h; $("pls").style.setProperty("--rc", ["#fccc0a", "#ff6319", "#00933c", "#b933ad", "#2e3052"][i]);
    $("ptt").textContent = d.t; d.imgs.forEach(function (s, q) { $("pg" + q).src = s; });
    $("pls").innerHTML = d.s.map(function (n) { return "<li>" + n + "</li>"; }).join("");
    stns.innerHTML = ""; tr.setAttribute("cx", -20); tr.setAttribute("cy", -20);
    for (var q = 0; q < 4; q++) { $("L" + q).classList.toggle("on", i === 4 || q === i); }
    if (i === 4) return;
    var path = $("L" + i), L = path.getTotalLength(), k = d.s.length;
    var items = d.s.map(function (name, q) {
      var f = (q + .5) / k, p = path.getPointAtLength(L * f), right = p.x < 560;
      var c = mk("circle", { class: "stn", cx: p.x, cy: p.y, r: 11 });
      var t = mk("text", { class: "lab", x: p.x + (right ? 18 : -18), y: p.y + (q % 2 ? 34 : -14), "text-anchor": right ? "start" : "end" }, name);
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
  document.querySelectorAll("#btns button").forEach(function (b) { b.addEventListener("click", function () { setDay(+b.dataset.i); }); });
  var started = false;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { if (es[0].isIntersecting && !started) { started = true; setDay(sel); } }, { threshold: .3 }).observe($("map"));
  } else { setDay(0); }
  setDay(0);

  /* ---------- crowd slider: a real subway car (illustration) ---------- */
  var hour = $("hour"), dA = $("dA"), dB = $("dB");
  var PAL = ["#2e3052", "#6f8fb3", "#31a593", "#ee352e", "#fccc0a", "#b933ad", "#ff6319", "#00933c"];
  function mkCar(el) {
    var s = '<svg viewBox="0 0 640 210" role="presentation"><rect x="4" y="4" width="632" height="200" rx="34" fill="#fff" stroke="#2e3052" stroke-width="6"/>';
    for (var w = 0; w < 6; w++) s += '<rect x="' + (28 + w * 100) + '" y="20" width="76" height="56" rx="10" fill="#d8e2e6"/>';
    s += '<rect x="20" y="150" width="600" height="16" rx="8" fill="#93b6be"/>';
    s += '<path d="M24 96H616" stroke="#9aa1ad" stroke-width="5" stroke-linecap="round"/>';
    [110, 320, 530].forEach(function (x) { s += '<path d="M' + x + ' 96V186" stroke="#9aa1ad" stroke-width="6" stroke-linecap="round"/>'; });
    var slots = [], i;
    for (i = 0; i < 12; i++) slots.push({ x: 50 + i * 49, y: 150, seat: 1 });
    for (i = 0; i < 28; i++) slots.push({ x: 40 + (i % 14) * 43 + (i < 14 ? 0 : 20), y: i < 14 ? 120 : 140, seat: 0 });
    var order = slots.map(function (_, k) { return k; }).sort(function (a, b) { return ((a * 7919) % 41) - ((b * 7919) % 41); });
    var g = "";
    order.forEach(function (k, n) {
      var p = slots[k], col = PAL[(k * 3) % PAL.length], top = p.y - (p.seat ? 40 : 52);
      g += '<g transform="translate(' + p.x + ' 0)"><g class="pp" data-n="' + n + '"><circle cx="0" cy="' + (top + 8) + '" r="9" fill="' + col + '"/><rect x="-11" y="' + (top + 19) + '" width="22" height="' + (p.seat ? 30 : 40) + '" rx="9" fill="' + col + '"/></g></g>';
    });
    el.innerHTML = s + g + "</svg>";
  }
  mkCar(dA); mkCar(dB);
  function crowd(h) {
    function bump(x, m, s) { return Math.exp(-Math.pow((x - m) / s, 2)); }
    return Math.min(40, Math.round(6 + 34 * Math.max(bump(h, 8.5, 1.8), bump(h, 17.5, 2.2)) + 6 * bump(h, 13, 3)));
  }
  function showN(el, n) { el.querySelectorAll(".pp").forEach(function (g) { g.classList.toggle("on", +g.dataset.n < n); }); }
  function setHour() {
    var h = +hour.value, a = crowd(h), b = Math.max(3, Math.round(a * 0.3));
    $("hout").textContent = (h < 10 ? "0" : "") + h + ":00";
    showN(dA, a); showN(dB, b);
    $("cA").textContent = a + D().people; $("cB").textContent = b + D().people;
  }
  hour.addEventListener("input", setHour);

  /* ---------- station announcements ---------- */
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
    
    setTimeout(function () { window.location.href = BUY[lang]; busy = false; }, 1500);
  });

  /* ---------- skyline (included) ---------- */
  var sky = $("sky"), sks = Array.prototype.slice.call(sky.querySelectorAll(".sk")), skSel = -1;
  function showSky(i) {
    skSel = i;
    sks.forEach(function (b, k) { b.setAttribute("aria-expanded", String(k === i)); });
    var c = $("skycard"); placeKong(i);
    if (i < 0) { c.classList.remove("on"); return; }
    $("skt").textContent = sks[i].querySelector(".bt").textContent;
    $("skd").textContent = sks[i].querySelector(".bd").textContent;
    c.classList.add("on");
  }
  var kong = $("kong"), kbub = $("kbub"), swrap = $("skywrap");
  function placeKong(i) {
    var b = sks[i < 0 ? 3 : i], wr = swrap.getBoundingClientRect(), r = b.getBoundingClientRect(), kw = kong.offsetWidth, kh = kong.offsetHeight;
    var x = r.left - wr.left + r.width / 2 - kw / 2;
    var top = r.top - wr.top - kh + 8 - (i < 0 ? 0 : 0);
    if (i >= 0) { var h = parseFloat(getComputedStyle(b).getPropertyValue("--h")) + 44; top = (r.bottom - wr.top) - h - kh + 8; } else { top = (r.bottom - wr.top) - parseFloat(getComputedStyle(b).getPropertyValue("--h")) - kh + 8; }
    kong.style.left = Math.max(0, Math.min(x, wr.width - kw)) + "px"; kong.style.top = Math.max(0, top) + "px";
    kbub.textContent = i < 0 ? T("kk") : sks[i].querySelector(".bt").textContent + "!";
    kong.classList.remove("hop"); void kong.offsetWidth; if (i >= 0) kong.classList.add("hop");
    swrap.style.setProperty("--sw", swrap.offsetWidth + "px");
  }
  window.addEventListener("resize", function () { placeKong(skSel); });
  window.addEventListener("load", function () { placeKong(skSel); });
  sks.forEach(function (b, i) { b.addEventListener("click", function () { showSky(skSel === i ? -1 : i); }); });
  showSky(-1);

  /* ---------- guide viewer ---------- */
  var VC = { pt: ["Boas-vindas: tudo o que você vai encontrar.", "Épocas do ano: Natal em NYC.", "Onde comer, por região.", "Teatro e Broadway.", "Guia fotográfico.", "Locações de filmes e séries."],
             en: ["Welcome: everything you'll find.", "Seasons: Christmas in NYC.", "Where to eat, by area.", "Theater and Broadway.", "Photo guide.", "Movie and series locations."] };
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
    setTimeout(function () { bmsg.textContent = BM[lang][bi]; placeKong(skSel); bmsg.classList.remove("sw"); }, 220);
  }, 3800);

  /* ---------- testimonials carousel ---------- */
  var tqt = $("tqtrack");
  function tqmove(d) { var w = tqt.querySelector(".tq").offsetWidth + 14; if (d > 0 && tqt.scrollLeft + tqt.clientWidth >= tqt.scrollWidth - 4) tqt.scrollTo({ left: 0 }); else if (d < 0 && tqt.scrollLeft <= 2) tqt.scrollTo({ left: tqt.scrollWidth }); else tqt.scrollBy({ left: d * w }); }
  $("tqprev").addEventListener("click", function () { tqmove(-1); });
  $("tqnext").addEventListener("click", function () { tqmove(1); });
  var tqh = false; tqt.addEventListener("pointerenter", function () { tqh = true; }); tqt.addEventListener("pointerleave", function () { tqh = false; });
  if (!reduce) setInterval(function () { if (!tqh && inView(tqt.closest(".st"))) tqmove(1); }, 6500);

  /* ---------- wanderers ---------- */
  var taxi = $("taxi"), esc = document.querySelector(".esc");
  taxi.addEventListener("click", function () { say(D().taxi); });
  if ("IntersectionObserver" in window && !reduce) {
    new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { setTimeout(function () { esc.classList.add("go"); }, 400); o.disconnect(); } }, { threshold: .5 }).observe(esc);
  }
  $("squirrel").addEventListener("click", function () { say(D().squirrel); });
  $("cart").addEventListener("click", function () { say(D().cart); });

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
    paintLed(); paintPrice(); setHour(); setDay(sel); showSky(skSel); $("vcap").textContent = VC[lang][vi]; bmsg.textContent = BM[lang][bi];
  }
  document.querySelectorAll(".lang button").forEach(function (b) { b.addEventListener("click", function () { applyLang(b.dataset.l); }); });
  var started0 = false;
  var saved = null; try { saved = localStorage.getItem("cm-lang"); } catch (e) {}
  var start = saved || ((navigator.language || "pt").toLowerCase().indexOf("pt") === 0 ? "pt" : "en");
  measure(); cur = -1; applyLang(start); update(); started0 = true;
})();
