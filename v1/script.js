/* =========================================================
   Crousty Crew, Béziers
   ========================================================= */
(() => {
  "use strict";

  requestAnimationFrame(() => document.body.classList.add("loaded"));

  /* Menu mobile */
  const burger = document.getElementById("burger");
  const links = document.getElementById("navLinks");
  const setMenu = (open) => {
    links.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  };
  burger.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* Header : se cache en descendant, revient en remontant */
  const header = document.getElementById("header");
  let lastY = scrollY;
  addEventListener("scroll", () => {
    const y = scrollY;
    header.classList.toggle("hidden", !links.classList.contains("open") && y > lastY && y > 240);
    lastY = y;
  }, { passive: true });

  /* Lien actif dans le menu */
  const navAnchors = [...links.querySelectorAll("a")];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) navAnchors.forEach((a) => a.classList.toggle("active", a.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["croustys", "sides", "infos"].forEach((id) => spy.observe(document.getElementById(id)));

  /* Apparition au scroll */
  const revealEls = [...document.querySelectorAll("[data-reveal]")];
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
  revealEls.forEach((el) => revealObs.observe(el));
  addEventListener("scroll", () => {
    revealEls.forEach((el) => {
      if (!el.classList.contains("in") && el.getBoundingClientRect().top < innerHeight) {
        el.classList.add("in");
        revealObs.unobserve(el);
      }
    });
  }, { passive: true });

  /* Horaires : jour en cours + ouvert / fermé (heure de Paris) */
  const schedule = {
    1: [[690, 870], [1080, 1440]], 2: [[690, 870], [1080, 1440]], 3: [[690, 870], [1080, 1440]], 4: [[690, 870], [1080, 1440]],
    5: [[675, 780], [1080, 1440]],
    6: [[690, 1440]], 0: [[690, 1440]],
  };
  const days = { dim: 0, lun: 1, mar: 2, mer: 3, jeu: 4, ven: 5, sam: 6 };
  const status = document.getElementById("openStatus");
  const update = () => {
    const parts = new Intl.DateTimeFormat("fr-FR", {
      timeZone: "Europe/Paris", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    const day = days[get("weekday").replace(".", "").toLowerCase()];
    const mins = Number(get("hour")) * 60 + Number(get("minute"));
    const open = schedule[day].some(([a, b]) => mins >= a && mins < b);
    document.querySelectorAll("#hours tr").forEach((tr) => tr.classList.toggle("today", tr.dataset.days.split(" ").includes(String(day))));
    status.textContent = open ? "Ouvert en ce moment" : "Fermé en ce moment";
    status.className = `open ${open ? "is-open" : "is-closed"}`;
  };
  update();
  setInterval(update, 60_000);

  /* Plan Google Maps chargé seulement au clic */
  document.getElementById("loadMap").addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.title = "Plan d'accès : Crousty Crew, 15B boulevard de Strasbourg, Béziers";
    iframe.src = "https://www.google.com/maps?q=15B+boulevard+de+Strasbourg,+34500+B%C3%A9ziers&z=16&output=embed";
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    document.getElementById("map").replaceChildren(iframe);
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
