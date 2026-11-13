// RixGrow v2
const page = document.body.dataset.page;
const nav = [
  ["index.html", "Home", "home"],
  ["method.html", "Method", "method"],
  ["about.html", "About", "about"],
  ["contact.html", "Contact", "contact"],
];
const navLinks = nav.map(([h, t, k]) => `<a href="${h}" class="${k === page ? "on" : ""}">${t}</a>`).join("");
const arrow = `<span class="ar">&rarr;</span>`;

document.querySelector("header.nav").innerHTML = `
  <div class="progress"></div>
  <div class="wrap bar">
    <a href="index.html" class="logo"><img src="images/logo-mark.svg" alt="" width="30" height="30">RixGrow</a>
    <nav class="links">${navLinks}</nav>
    <a href="contact.html" class="btn pri">Book a call ${arrow}</a>
  </div>`;

const ic = {
  home: '<path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/>',
  method: '<path d="M4 6h16M4 12h10M4 18h6"/>',
  about: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
};
const svg = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
document.body.insertAdjacentHTML("beforeend", `
  <nav class="tabbar">
    <a href="index.html" class="${page === "home" ? "on" : ""}">${svg(ic.home)}Home</a>
    <a href="method.html" class="${page === "method" ? "on" : ""}">${svg(ic.method)}Method</a>
    <a href="about.html" class="${page === "about" ? "on" : ""}">${svg(ic.about)}About</a>
    <a href="contact.html" class="apply ${page === "contact" ? "on" : ""}"><span>${svg('<path d="M5 12h14M13 6l6 6-6 6"/>')}</span>Book</a>
  </nav>`);

document.querySelector("footer").innerHTML = `
  <div class="wrap">
    <div class="top">
      <div>
        <a href="index.html" class="logo"><img src="images/logo-mark.svg" alt="" width="30" height="30">RixGrow</a>
        <p>The clipping agency with an AI studio inside. 1B+ views and counting.</p>
      </div>
      <div class="cols">
        <div><b>Pages</b>${nav.map(([h, t]) => `<a href="${h}">${t}</a>`).join("")}</div>
        <div><b>Reach us</b><a href="mailto:hello@rixgrow.com" class="email-link">hello@rixgrow.com</a><a href="https://www.instagram.com/rixgrow.co/" target="_blank" rel="noopener">Instagram</a><a href="contact.html">Book a call</a></div>
      </div>
    </div>
    <div class="legal"><span>&copy; ${new Date().getFullYear()} RixGrow. All rights reserved.</span><span>Built for attention.</span></div>
  </div>`;

// scroll progress
const prog = document.querySelector(".progress");
addEventListener("scroll", () => {
  const h = document.documentElement;
  prog.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
}, { passive: true });

// split headline words
document.querySelectorAll(".split").forEach((el) => {
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.append(" ");
          const w = document.createElement("span"); w.className = "w";
          const i = document.createElement("span"); i.textContent = part; w.append(i); frag.append(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
    });
  };
  walk(el);
  el.querySelectorAll(".w>span").forEach((s, i) => (s.style.transitionDelay = i * 0.06 + "s"));
});

// reveal
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.12 });
document.querySelectorAll(".rv,.split").forEach((el) => io.observe(el));

// count up
const fmt = (v, el) => {
  const mode = el.dataset.fmt;
  if (mode === "full") return Math.floor(v).toLocaleString("en-US");
  if (mode === "short") return v >= 1e9 ? Math.floor(v / 1e9) + "B" : v >= 1e8 ? Math.floor(v / 1e6) + "M" : v >= 1e6 ? (Math.floor(v / 1e5) / 10).toFixed(1) + "M" : v >= 1e3 ? Math.floor(v / 1e3) + "K" : Math.floor(v);
  return Math.floor(v).toLocaleString("en-US");
};
const co = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  co.unobserve(e.target);
  const el = e.target, target = +el.dataset.count, suf = el.dataset.suffix || "";
  const dur = +(el.dataset.dur || 2400), t0 = performance.now();
  const tick = (t) => {
    const p = Math.min((t - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 5);
    el.textContent = fmt(target * eased, el) + (p === 1 ? suf : "");
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}), { threshold: 0.4 });
document.querySelectorAll("[data-count]").forEach((el) => co.observe(el));

// ceiling calculator (illustrative)
const range = document.querySelector("#hrs");
if (range) {
  const out = {
    h: document.querySelector("#hrsv"), t: document.querySelector("#them"), u: document.querySelector("#us"),
    tf: document.querySelector("#themf"), uf: document.querySelector("#usf"), m: document.querySelector("#msg"),
  };
  const upd = () => {
    const h = +range.value;
    const them = h * 8;
    const us = h * 8 + 24;
    const max = 10 * 8 + 24;
    out.h.textContent = h;
    out.t.textContent = them;
    out.u.textContent = us;
    out.tf.style.width = (them / max) * 100 + "%";
    out.uf.style.width = (us / max) * 100 + "%";
    out.m.innerHTML = h === 0
      ? "Didn't film this week? A clipping agency goes <span class='grad'>silent</span>. We keep posting."
      : h < 3
      ? "Light week on camera. AI fills the gap so your feed <span class='grad'>never cools down.</span>"
      : "Busy week? Even better. Clips <span class='grad'>plus</span> AI stories hit every format at once.";
  };
  range.addEventListener("input", upd);
  upd();
}

// clipping demo
const wave = document.querySelector(".wave");
if (wave) {
  const N = 90;
  const hits = [[12, 17], [33, 37], [55, 60], [74, 79]];
  const grads = [
    "linear-gradient(160deg,#ff8a3d,#ff2d87)",
    "linear-gradient(160deg,#8b6bff,#2dd4ff)",
    "linear-gradient(160deg,#ff2d87,#8b6bff)",
    "linear-gradient(160deg,#c8ff3d,#1fd1a5)",
  ];
  for (let i = 0; i < N; i++) {
    const b = document.createElement("i");
    b.style.height = 18 + Math.abs(Math.sin(i * 0.7) * 55 + Math.sin(i * 0.23) * 30) + "%";
    wave.append(b);
  }
  const bars = [...wave.querySelectorAll("i")];
  const line = wave.querySelector(".head-line");
  const slots = [...document.querySelectorAll(".found div")];
  const cnt = document.querySelector("#clipcount");
  const stamp = document.querySelector("#stamp");
  let pos = 0, found = 0;
  const reset = () => { pos = 0; found = 0; bars.forEach((b) => b.classList.remove("hit")); slots.forEach((s) => { s.classList.remove("on"); s.querySelector("span").textContent = "waiting"; }); cnt.textContent = "0"; };
  const step = () => {
    pos += 0.35;
    if (pos > N + 12) reset();
    const idx = Math.floor(pos);
    line.style.left = Math.min(pos / N, 1) * 100 + "%";
    const secs = Math.floor((Math.min(pos, N) / N) * 7380);
    stamp.textContent = `${Math.floor(secs / 3600)}:${String(Math.floor((secs % 3600) / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
    hits.forEach(([a, z], k) => {
      if (idx >= a && idx <= z && bars[idx]) bars[idx].classList.add("hit");
      if (idx === z && found === k) {
        found++;
        cnt.textContent = found;
        slots[k].style.setProperty("--g", grads[k]);
        slots[k].classList.add("on");
        slots[k].querySelector("span").textContent = ["Hook 01", "Story 02", "Hot take 03", "Lesson 04"][k];
      }
    });
    requestAnimationFrame(step);
  };
  reset();
  new IntersectionObserver((es) => { if (es[0].isIntersecting && !wave.dataset.go) { wave.dataset.go = 1; requestAnimationFrame(step); } }).observe(wave);
}

// AI studio demo
const studio = document.querySelector(".studio");
if (studio) {
  const formats = [
    { k: "3D story", a: "a1", p: "A broke kid builds his first online store at 2am. Pixar style, warm lamp light, cinematic push in.", c: "He had <em>$40</em> and a laptop" },
    { k: "Hyper real", a: "a2", p: "A founder walks through a neon city where every billboard shows his face. Hyper real, 35mm, rain.", c: "Your name on <em>every</em> screen" },
    { k: "AI UGC ad", a: "a6", p: "Creator holds the product up to camera, natural light, handheld, first person review energy.", c: "I did <em>not</em> expect this" },
    { k: "Faceless", a: "a4", p: "Animated explainer: why 90% of stores fail in month one. Clean motion graphics, bold captions.", c: "Why most stores <em>fail</em>" },
  ];
  const tabs = studio.parentElement.querySelector(".tabs");
  tabs.innerHTML = formats.map((f, i) => `<button data-i="${i}">${f.k}</button>`).join("");
  const txt = studio.querySelector(".txt"), bar = studio.querySelector(".render i");
  const art = studio.querySelector(".art"), cap = studio.querySelector(".cap"), tag = studio.querySelector(".tag");
  let cur = 0, timer, typing;
  const show = (i) => {
    cur = i; clearTimeout(timer); clearInterval(typing);
    tabs.querySelectorAll("button").forEach((b, j) => b.classList.toggle("on", j === i));
    const f = formats[i];
    txt.textContent = ""; bar.style.transition = "none"; bar.style.width = "0"; art.style.opacity = ".15";
    let n = 0;
    typing = setInterval(() => {
      txt.textContent = f.p.slice(0, ++n);
      if (n >= f.p.length) {
        clearInterval(typing);
        requestAnimationFrame(() => { bar.style.transition = "width 1.4s cubic-bezier(.2,.8,.2,1)"; bar.style.width = "100%"; });
        timer = setTimeout(() => {
          art.className = "art " + f.a; art.style.opacity = "1"; cap.innerHTML = f.c; tag.textContent = f.k;
          timer = setTimeout(() => show((cur + 1) % formats.length), 3200);
        }, 1400);
      }
    }, 22);
  };
  tabs.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) show(+b.dataset.i); });
  new IntersectionObserver((es) => { if (es[0].isIntersecting && !studio.dataset.go) { studio.dataset.go = 1; show(0); } }).observe(studio);
}

// receipts lightbox
const rcs = document.querySelectorAll(".rc img");
if (rcs.length) {
  const lb = document.createElement("div"); lb.className = "lightbox"; lb.innerHTML = "<img alt=''>";
  document.body.append(lb);
  rcs.forEach((im) => im.parentElement.addEventListener("click", () => { lb.firstChild.src = im.src; lb.firstChild.alt = im.alt; lb.classList.add("on"); }));
  lb.addEventListener("click", () => lb.classList.remove("on"));
  addEventListener("keydown", (e) => e.key === "Escape" && lb.classList.remove("on"));
}

// hero videos: always playing, never stopping
document.querySelectorAll(".phone.vid video").forEach((v) => {
  v.muted = true;
  const go = () => { if (v.paused) v.play().catch(() => {}); };
  v.addEventListener("pause", go);
  v.addEventListener("ended", () => { v.currentTime = 0; go(); });
  v.addEventListener("loadeddata", () => v.classList.add("on"));
  document.addEventListener("visibilitychange", go);
  go();
});

// Book a call: collect details, then open the Cal.com 30 minute booking with them filled in
// Cal.com booking page
const CAL_URL = "https://cal.com/lakshya-richie-cyfbrn/30min";
const form = document.querySelector("#brief");
if (form) form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = new FormData(form);
  const q = new URLSearchParams({
    name: d.get("name") || "",
    email: d.get("email") || "",
    notes: `Social: ${d.get("social") || ""}\nNeeds: ${d.get("need") || ""}`,
  });
  location.href = `${CAL_URL}?${q.toString()}`;
});
