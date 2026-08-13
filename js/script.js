// SigloPedia — site vitrine
// Aucune donnée personnelle collectée : ce script ne fait ni tracking ni
// appel réseau. Il gère uniquement des interactions purement visuelles.

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------------------------------------------------------- */
  /* Année courante dans le footer                                    */
  /* ---------------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------------------------------------------------------------- */
  /* Menu mobile                                                      */
  /* ---------------------------------------------------------------- */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  if (header && toggle) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    header.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------------------------------------------------------- */
  /* Révélation au défilement                                         */
  /* ---------------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------------------------------------------------------- */
  /* Carte de dictionnaire qui feuillette de vraies entrées            */
  /* (élément signature du hero — voir index.html #dictCard)           */
  /* ---------------------------------------------------------------- */
  var ENTRIES = [
    { acr: "RGPD", cat: "Droit & Vie privée", name: "Règlement Général sur la Protection des Données", def: "Règlement européen encadrant la collecte et le traitement des données personnelles." },
    { acr: "IA", cat: "Informatique & Logiciels", name: "Intelligence Artificielle", def: "Ensemble de techniques permettant à une machine d'imiter des capacités cognitives humaines." },
    { acr: "ONU", cat: "Relations internationales", name: "Organisation des Nations Unies", def: "Organisation internationale fondée en 1945 pour maintenir la paix et la sécurité mondiales." },
    { acr: "PIB", cat: "Économie & Finance", name: "Produit Intérieur Brut", def: "Somme des richesses produites par un pays sur une période donnée, indicateur économique clé." },
    { acr: "HTTP", cat: "Internet & Réseaux", name: "HyperText Transfer Protocol", def: "Protocole de communication utilisé pour transférer des pages web sur internet." },
    { acr: "OVNI", cat: "Culture générale", name: "Objet Volant Non Identifié", def: "Phénomène aérien observé dont l'origine n'a pas été formellement identifiée." },
    { acr: "ADN", cat: "Sciences & Santé", name: "Acide Désoxyribonucléique", def: "Molécule support de l'information génétique présente dans toutes les cellules vivantes." },
    { acr: "CDI", cat: "Travail & Droit", name: "Contrat à Durée Indéterminée", def: "Contrat de travail sans date de fin prévue à l'avance, la forme standard en France." }
  ];

  var card = document.getElementById("dictCard");
  if (card) {
    var acrEl = card.querySelector(".dict-card-acr");
    var catEl = card.querySelector(".dict-card-cat");
    var nameEl = card.querySelector(".dict-card-name");
    var defEl = card.querySelector(".dict-card-def");
    var idxEl = card.querySelector(".dict-card-index");
    var dots = card.querySelectorAll(".dict-card-dots span");
    var i = 0;

    function render(index) {
      var e = ENTRIES[index];
      card.style.opacity = "0";
      window.setTimeout(function () {
        acrEl.textContent = e.acr;
        catEl.textContent = e.cat;
        nameEl.textContent = e.name;
        defEl.textContent = e.def;
        idxEl.textContent = "N° " + String(index + 1).padStart(2, "0") + " / " + String(ENTRIES.length).padStart(2, "0");
        dots.forEach(function (d, di) { d.classList.toggle("active", di === index); });
        card.style.opacity = "1";
      }, prefersReducedMotion ? 0 : 180);
    }

    render(0);

    if (!prefersReducedMotion) {
      var timer = window.setInterval(function () {
        i = (i + 1) % ENTRIES.length;
        render(i);
      }, 3400);

      // Pause au survol / focus pour laisser le temps de lire
      card.addEventListener("mouseenter", function () { window.clearInterval(timer); });
      card.addEventListener("mouseleave", function () {
        timer = window.setInterval(function () {
          i = (i + 1) % ENTRIES.length;
          render(i);
        }, 3400);
      });
    }

    card.style.transition = "opacity .18s ease";

    dots.forEach(function (d, di) {
      d.style.cursor = "pointer";
      d.setAttribute("role", "button");
      d.setAttribute("tabindex", "0");
      d.setAttribute("aria-label", "Voir l'entrée " + (di + 1));
      d.addEventListener("click", function () { i = di; render(i); });
      d.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); i = di; render(i); }
      });
    });
  }
})();
