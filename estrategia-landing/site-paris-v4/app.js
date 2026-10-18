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
  var visSet = new Set(), live = document.querySelectorAll(".blk,.zoo");
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

  /* ---------- top bar (current section) ---------- */
  var ledt = $("ledt"), ledn = $("ledn");
  var sts = Array.prototype.slice.call(document.querySelectorAll(".blk[data-st]"));
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
    setLed(idx); barUpdate();
  }
  var bar = $("buybar"), precoSec = document.getElementById("preco"), seenPrice = false;
  function barUpdate() {
    var pi = sts.indexOf(precoSec), show = cur >= 4 && cur < pi;
    bar.classList.toggle("on", show);
    if (!seenPrice && inView(precoSec)) { seenPrice = true; track("view_price"); }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", update);
  window.addEventListener("load", update);

  /* ---------- regions: photo tiles + panel ---------- */
  var sel = -1;
  function setDay(i) {
    sel = i;
    var d = D().days[i];
    document.querySelectorAll("#btns button").forEach(function (b, q) { b.setAttribute("aria-selected", String(q === i)); });
    $("phook").textContent = d.h; $("ptt").textContent = d.t;
    d.imgs.forEach(function (s, q) { var im = $("pg" + q); if (im.getAttribute("src") !== s) { im.src = s; var f = im.parentNode; f.classList.remove("drop"); void f.offsetWidth; f.classList.add("drop"); } });
    $("pls").innerHTML = d.s.map(function (n) { return "<li>" + n + "</li>"; }).join("") + '<li class="tipli">' + d.tip + "</li>";
  }
  document.querySelectorAll("#btns button").forEach(function (b) { b.addEventListener("click", function () { setDay(+b.dataset.i); }); });
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

  /* ---------- price (follows the language) ---------- */
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
    setTimeout(function () { window.location.href = BUY[lang]; busy = false; }, 1300);
  });

  /* ---------- stories (included) ---------- */
  var hls = Array.prototype.slice.call(document.querySelectorAll("#hls .hl-b")), story = $("story"), bars = $("bars"), si = -1, st0 = 0, sraf = 0, SDUR = 6000, hold = false, heldAt = 0, opener = null;
  bars.innerHTML = hls.map(function () { return "<i><b></b></i>"; }).join("");
  var barEls = Array.prototype.slice.call(bars.querySelectorAll("b"));
  function paintStory() {
    var b = hls[si];
    $("sph").src = "img/st" + (si + 1) + ".webp";
    $("stt").textContent = b.querySelector(".bt").textContent; $("std").textContent = b.querySelector(".bd").textContent;
    barEls.forEach(function (e, k) { e.style.transform = "scaleX(" + (k < si ? 1 : 0) + ")"; });
    st0 = performance.now();
  }
  function tickStory(now) {
    if (si < 0) return;
    if (!hold) { var p = Math.min(1, (now - st0) / SDUR); barEls[si].style.transform = "scaleX(" + p + ")"; if (p >= 1) { goStory(si + 1); } }
    sraf = requestAnimationFrame(tickStory);
  }
  function openStory(i) {
    opener = document.activeElement; story.hidden = false; document.body.classList.add("noscroll"); si = i; paintStory();
    if (!reduce) { cancelAnimationFrame(sraf); sraf = requestAnimationFrame(tickStory); }
    $("sclose").focus(); track("open_story", { item: i });
  }
  function closeStory() { si = -1; cancelAnimationFrame(sraf); story.hidden = true; document.body.classList.remove("noscroll"); if (opener) opener.focus(); }
  function goStory(i) { if (i < 0) i = 0; if (i >= hls.length) { closeStory(); return; } si = i; paintStory(); }
  hls.forEach(function (b, i) { b.addEventListener("click", function () { openStory(i); }); });
  $("sclose").addEventListener("click", closeStory);
  $("snext").addEventListener("click", function () { goStory(si + 1); });
  $("sprev").addEventListener("click", function () { goStory(si - 1); });
  story.addEventListener("click", function (e) { if (e.target === story) closeStory(); });
  document.addEventListener("keydown", function (e) {
    if (story.hidden) return;
    if (e.key === "Escape") closeStory(); else if (e.key === "ArrowRight") goStory(si + 1); else if (e.key === "ArrowLeft") goStory(si - 1);
  });
  var sbox = $("sbox");
  sbox.addEventListener("pointerdown", function () { hold = true; heldAt = performance.now(); });
  function release() { if (hold) { hold = false; st0 += performance.now() - heldAt; } }
  sbox.addEventListener("pointerup", release); sbox.addEventListener("pointercancel", release); sbox.addEventListener("pointerleave", release);

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
  if (!reduce) vt = setInterval(function () { if (inView($("viewer").closest(".blk"))) setV(vi + 1); }, 4500);

  /* ---------- update sign messages ---------- */
  var BM = { pt: ["Sempre que eu conhecer um lugar novo, você vai saber.", "Você recebe pelo mesmo link do guia.", "Sem pagar nada a mais."], en: ["Whenever I discover a new place, you'll know.", "You get it through the same guide link.", "At no extra cost."] };
  var bi = 0, bmsg = $("bmsg"), bbl = document.querySelectorAll(".mrow .dotm");
  function bulb() { bbl.forEach(function (b, k) { b.classList.toggle("on", k === bi); }); }
  bulb();
  if (!reduce) setInterval(function () {
    if (!inView(document.querySelector(".band"))) return;
    bi = (bi + 1) % 3; bulb(); bmsg.classList.add("sw");
    setTimeout(function () { bmsg.textContent = BM[lang][bi]; bmsg.classList.remove("sw"); }, 220);
  }, 3800);

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
    paintLed(); paintPrice(); setDay(sel); $("vcap").textContent = VC[lang][vi]; bmsg.textContent = BM[lang][bi];
  }
  document.querySelectorAll(".lang button").forEach(function (b) { b.addEventListener("click", function () { applyLang(b.dataset.l); }); });
  var started0 = false;
  var saved = null; try { saved = localStorage.getItem("cm-lang"); } catch (e) {}
  var start = saved || ((navigator.language || "pt").toLowerCase().indexOf("pt") === 0 ? "pt" : "en");
  cur = -1; applyLang(start); update(); started0 = true;
})();
