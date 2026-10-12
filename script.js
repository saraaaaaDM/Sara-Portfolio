// ─────────────────────────────────────────────
// ZONE SCALE SYSTEM (HOME RESPONSIVE)
// ─────────────────────────────────────────────

const ZONE_W = 1200;
const ZONE_H = 600;

const zone = document.querySelector(".center-zone");
const homeSection = document.querySelector(".home-section");

function getZoneScale() {
  if (window.innerWidth < 768) {
    return window.innerWidth / ZONE_W;
  } else {
    const scaleX = (window.innerWidth - 80) / ZONE_W;
    const scaleY = (window.innerHeight - 80) / ZONE_H;
    return Math.min(scaleX, scaleY, 1);
  }
}

let currentScale = 1;
let mouseX = 0;
let mouseY = 0;

function applyScale() {
  currentScale = getZoneScale();

  const isMobile = window.innerWidth < 768;

  zone.dataset.scale = currentScale;

  if (isMobile) {
    zone.style.top = "0";
    zone.style.left = "0";
    zone.style.transform = `scale(${currentScale})`;
    zone.style.transformOrigin = "top left";

    homeSection.style.height = (ZONE_H * currentScale * 2.5) + "px";
  } else {
    zone.style.top = "50%";
    zone.style.left = "50%";
    zone.style.transform = `translate(-50%, -50%) scale(${currentScale})`;
    zone.style.transformOrigin = "center center";

    homeSection.style.height = "100vh";
  }
}

applyScale();
window.addEventListener("resize", applyScale);


// ─────────────────────────────────────────────
// GLOBAL MOUSE TRACKING (PARALLAX)
// ─────────────────────────────────────────────

document.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5);
  mouseY = (e.clientY / window.innerHeight - 0.5);
});

function updateParallax() {
  if (!zone) return;

  const moveX = mouseX * 15;
  const moveY = mouseY * 15;
  const scale = currentScale;
  const isMobile = window.innerWidth < 768;

  // Sur mobile, la zone doit rester ancrée en haut à gauche :
  // la translation centrée la déplaçait hors de l'écran et masquait les objets.
  if (isMobile) {
    zone.style.top = "0";
    zone.style.left = "0";
    zone.style.transform = `translate(${moveX * 0.2}px, ${moveY * 0.2}px) scale(${scale})`;
    zone.style.transformOrigin = "top left";
  } else {
    zone.style.top = "50%";
    zone.style.left = "50%";
    zone.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px)) scale(${scale})`;
    zone.style.transformOrigin = "center center";
  }

  requestAnimationFrame(updateParallax);
}

updateParallax();


// ─────────────────────────────────────────────
// DRAG SYSTEM (HOME OBJECTS)
// ─────────────────────────────────────────────

const items = document.querySelectorAll(".item");

items.forEach(item => {
  let isDragging = false;
  let startX = 0, startY = 0;
  let mouseStartX = 0, mouseStartY = 0;

  function startDrag(clientX, clientY) {
    isDragging = true;

    startX = parseFloat(item.style.left) || item.offsetLeft;
    startY = parseFloat(item.style.top) || item.offsetTop;

    mouseStartX = clientX;
    mouseStartY = clientY;

    item.style.cursor = "grabbing";
    item.style.zIndex = "100";

    item.classList.add("dragging");
  }

  function moveDrag(clientX, clientY) {
    if (!isDragging) return;

    const scale = currentScale;

    item.style.left = (startX + (clientX - mouseStartX) / scale) + "px";
    item.style.top = (startY + (clientY - mouseStartY) / scale) + "px";
  }

  function endDrag() {
    if (!isDragging) return;

    isDragging = false;
    item.style.cursor = "grab";
    item.style.zIndex = "";

    item.classList.remove("dragging");
  }

  // Mouse
  item.addEventListener("mousedown", e => startDrag(e.clientX, e.clientY));
  document.addEventListener("mousemove", e => moveDrag(e.clientX, e.clientY));
  document.addEventListener("mouseup", endDrag);

  // Touch
  item.addEventListener("touchstart", e => {
    startDrag(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });

  item.addEventListener("touchmove", e => {
    e.preventDefault();
    moveDrag(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });

  item.addEventListener("touchend", endDrag);
});


// ─────────────────────────────────────────────
// CURSOR CUSTOM
// ─────────────────────────────────────────────

const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", (e) => {
  if (!cursor) return;

  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

// hover grow cursor
document.querySelectorAll("a, .item, .project-card").forEach(el => {
  el.addEventListener("mouseenter", () => {
    if (cursor) cursor.style.transform = "scale(2)";
  });

  el.addEventListener("mouseleave", () => {
    if (cursor) cursor.style.transform = "scale(1)";
  });
});


// ─────────────────────────────────────────────
// SCROLL REVEAL (SECTIONS + CARDS)
// ─────────────────────────────────────────────

const reveals = document.querySelectorAll(".section, .project-card, .about-content");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, {
  threshold: 0.15
});

reveals.forEach(el => {
  el.classList.add("reveal");
  observer.observe(el);
});

// ═══════════════════════════════════════
// POP-UP PROJETS
// ═══════════════════════════════════════

const projectModal =
  document.getElementById("projectModal");

const modalOverlay =
  document.querySelector(".modal-overlay");

const modalClose =
  document.querySelector(".modal-close");

const modalMainImage =
  document.getElementById("modalMainImage");

const modalTag =
  document.getElementById("modalTag");

const modalTitle =
  document.getElementById("modalTitle");

const modalDescription =
  document.getElementById("modalDescription");

const modalYear =
  document.getElementById("modalYear");

const modalTools =
  document.getElementById("modalTools");

const galleryThumbnails =
  document.getElementById("galleryThumbnails");


// ═══════════════════════════════════════
// LANGUAGE SWITCH (FR / EN)
// ═══════════════════════════════════════
let currentLanguage = "fr";

const interfaceTranslations = {
  fr: {
    "nav-home": "ACCUEIL", "nav-about": "À PROPOS", "nav-projects": "PROJETS", "nav-contact": "CONTACT",
    "about-title": "À PROPOS", "projects-title": "PROJETS", "contact-title": "CONTACT",
    "about-copy": "Je m’appelle Sara Desruels-Marciniak.\nJ’aime créer des projets qui se situent entre le design, l’image et le numérique. Je suis particulièrement attirée par les univers visuels qui ont une identité forte, les interfaces qui racontent quelque chose et les projets qui permettent d’expérimenter.\n\nJe ne cherche pas seulement à faire quelque chose de « beau » : j’aime comprendre pourquoi un projet fonctionne, tester différentes idées, jouer avec les formes, les couleurs, la typographie et les interactions jusqu’à trouver la bonne direction.\n\nCurieuse et toujours en train d’explorer de nouvelles choses, je passe facilement du graphisme à l’UI/UX, du développement à la direction artistique. Ce qui m’intéresse surtout, c’est de pouvoir apprendre, expérimenter et donner une vraie personnalité à ce que je crée.\n\nCe portfolio rassemble donc une partie de mes projets, mais surtout ma manière de chercher, d’expérimenter et de créer.\n\nN’hésitez pas à me contacter pour échanger ou collaborer sur des projets créatifs !",
    "noma-tag": "BRANDING • DIRECTION ARTISTIQUE", "noma-summary": "Swimwear for every body — création d’une identité visuelle pensée autour de la diversité des morphologies.",
    "keycloak-tag": "WEBDESIGN • UX/UI • PROTOTYPAGE", "keycloak-summary": "Refonte de l’interface Keycloak pour la rendre plus accessible, facile à comprendre et intuitive.",
    "cd-tag": "DIRECTION ARTISTIQUE • GRAPHISME • ÉDITION", "cd-summary": "Création d’une identité visuelle autour d’un album de notre choix.",
    "modal-year": "ANNÉE", "modal-tools": "OUTILS", "close-modal": "Fermer"
  },
  en: {
    "nav-home": "HOME", "nav-about": "ABOUT", "nav-projects": "PROJECTS", "nav-contact": "CONTACT",
    "about-title": "ABOUT", "projects-title": "PROJECTS", "contact-title": "CONTACT",
    "about-copy": "My name is Sara Desruels-Marciniak.\nI enjoy creating projects at the intersection of design, imagery and digital experiences. I’m especially drawn to strong visual identities, interfaces that tell a story, and projects that leave room for experimentation.\n\nI’m not just looking to make something “beautiful”: I like understanding why a project works, testing different ideas, and playing with shapes, colours, typography and interactions until I find the right direction.\n\nCurious by nature and always exploring, I move easily between graphic design and UI/UX, development and art direction. What matters most to me is learning, experimenting and giving a distinctive personality to everything I create.\n\nThis portfolio brings together a selection of my projects, but above all reflects the way I explore, experiment and create.\n\nFeel free to get in touch to talk about creative ideas or collaborations!",
    "noma-tag": "BRANDING • ART DIRECTION", "noma-summary": "Swimwear for every body — a visual identity celebrating a diversity of body shapes.",
    "keycloak-tag": "WEB DESIGN • UX/UI • PROTOTYPING", "keycloak-summary": "Redesigning the Keycloak interface to make it more accessible, clear and intuitive.",
    "cd-tag": "ART DIRECTION • GRAPHIC DESIGN • EDITORIAL DESIGN", "cd-summary": "Creating a visual identity inspired by an album of our choice.",
    "modal-year": "YEAR", "modal-tools": "TOOLS", "close-modal": "Close"
  }
};

function setLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.dataset.i18n;
    if (interfaceTranslations[language][key]) element.textContent = interfaceTranslations[language][key];
  });
  const toggle = document.getElementById("languageToggle");
  if (toggle) {
    toggle.textContent = language === "fr" ? "EN" : "FR";
    toggle.setAttribute("aria-label", language === "fr" ? "Switch to English" : "Passer en français");
    toggle.setAttribute("title", language === "fr" ? "Switch to English" : "Passer en français");
  }
  const about = document.querySelector('[data-i18n="about-copy"]');
  if (about) { about.textContent = interfaceTranslations[language]["about-copy"]; }
  const close = document.querySelector(".modal-close");
  if (close) close.setAttribute("aria-label", interfaceTranslations[language]["close-modal"]);
  // Update an already-open project modal immediately when the language changes.
  const activeProjectCard = document.querySelector(".project-card.is-current");
  if (activeProjectCard && projectModal.classList.contains("active")) {
    const project = projectsData[activeProjectCard.dataset.project];
    if (project) {
      modalTag.textContent = project.tag[language];
      modalTitle.textContent = project.title;
      modalDescription.textContent = project.description[language];
      modalYear.textContent = project.year;
      modalTools.textContent = project.tools[language];
    }
  }
}

document.getElementById("languageToggle")?.addEventListener("click", () => {
  setLanguage(currentLanguage === "fr" ? "en" : "fr");
});

// ═══════════════════════════════════════
// DONNÉES DES PROJETS
// ═══════════════════════════════════════

const projectsData = {
  noma: {
    tag: {
      fr: "BRANDING • DIRECTION ARTISTIQUE",
      en: "BRANDING • ART DIRECTION"
    },
    title: "NOMA",
    description: {
      fr: "NOMA est une marque de maillots de bain pensée pour différentes morphologies. Le projet part d’une réflexion autour des tailles standardisées et de la diversité des corps. J’ai imaginé une identité qui met en avant cette diversité plutôt que de chercher à la faire entrer dans une norme. J’ai travaillé autour de formes organiques inspirées du corps, d’un motif reconnaissable et d’une palette solaire et colorée. L’identité a ensuite été déclinée à travers le logo, la typographie, les couleurs, les motifs, les supports de communication et la direction artistique photographique.",
      en: "NOMA is a swimwear brand designed for a wide range of body shapes. The project began with a reflection on standardised sizing and body diversity. I created a visual identity that celebrates these differences rather than trying to fit every body into a single standard. Inspired by the human body, I explored organic shapes, a distinctive pattern and a bright, sun-soaked colour palette. The identity was then developed across the logo, typography, colours, patterns, communication materials and photographic art direction."
    },
    year: "2025",
    tools: { fr: "Illustrator • Photoshop • InDesign", en: "Illustrator • Photoshop • InDesign" },
    images: ["items/1.png", "items/8.png", "items/2.png", "items/3.png", "items/4.png", "items/5.png", "items/6.png", "items/7.png"]
  },
  keycloak: {
    tag: { fr: "WEBDESIGN • UX/UI • PROTOTYPAGE", en: "WEB DESIGN • UX/UI • PROTOTYPING" },
    title: "KEYCLOAK",
    description: {
      fr: "Dans le cadre de mon expérience en entreprise, j’ai travaillé sur la refonte de l’interface de Keycloak, une solution permettant notamment de gérer les utilisateurs, les applications et les accès.\n\nL’objectif était de repenser l’organisation de l’interface afin de rendre les informations plus accessibles et les différents parcours plus simples à comprendre.\n\nJ’ai réalisé plusieurs propositions de maquettes et exploré différentes versions de l’interface. J’ai également travaillé sur les parcours utilisateurs, la navigation et les interactions entre les différents écrans.\n\nCe projet m’a permis d’approfondir ma pratique de l’UX/UI et de réfléchir à la manière de rendre une interface complexe plus claire et intuitive.",
      en: "As part of my professional experience, I worked on redesigning the Keycloak interface, a solution used to manage users, applications and access permissions.\n\nThe goal was to rethink the interface structure to make information easier to find and user journeys easier to understand.\n\nI created several design proposals and explored different versions of the interface. I also worked on user flows, navigation and interactions between screens.\n\nThis project helped me deepen my UX/UI practice and explore how a complex interface can be made clearer and more intuitive."
    },
    year: "2026",
    tools: { fr: "Figma • UX/UI • Prototypage", en: "Figma • UX/UI • Prototyping" },
    images: ["items/Keycloak.png", "items/keycloak-2.png", "items/keycloak-3.gif", "items/keycloak-4.png"]
  },
  cd: {
    tag: { fr: "DIRECTION ARTISTIQUE • GRAPHISME • ÉDITION", en: "ART DIRECTION • GRAPHIC DESIGN • EDITORIAL DESIGN" },
    title: "AFTER HOURS",
    description: {
      fr: "Pour ce projet, j’ai réalisé une nouvelle interprétation graphique de l’album After Hours de The Weeknd.\n\nL’objectif était de créer une identité visuelle autour de l’univers sombre et nocturne de l’album, tout en proposant une direction artistique personnelle.\n\nJ’ai travaillé autour d’une palette dominée par le rouge et le noir, en utilisant des photographies, des compositions graphiques, de la typographie et différents éléments visuels inspirés de l’univers de l’artiste.\n\nLe projet comprend la conception de la pochette, la mise en page de la tracklist ainsi que différents supports permettant d’imaginer le rendu final du CD et de son packaging.",
      en: "For this project, I created a new graphic interpretation of The Weeknd’s album After Hours.\n\nThe aim was to develop a visual identity inspired by the album’s dark, nocturnal atmosphere while bringing my own art direction to it.\n\nI worked with a colour palette dominated by red and black, combining photography, graphic compositions, typography and visual elements inspired by the artist’s world.\n\nThe project includes the cover artwork, tracklist layout and a range of materials exploring the final CD and packaging design."
    },
    year: "2025",
    tools: { fr: "Photoshop • Illustrator • InDesign", en: "Photoshop • Illustrator • InDesign" },
    images: ["items/after-hours-1.png", "items/after-hours-2.png"]
  }
};

// ═══════════════════════════════════════
// OUVERTURE DU POP-UP
// ═══════════════════════════════════════

document
  .querySelectorAll(".project-card")
  .forEach(card => {

    card.addEventListener("click", () => {

      const projectId =
        card.dataset.project;

      document.querySelectorAll(".project-card").forEach(c => c.classList.remove("is-current"));
      card.classList.add("is-current");

      const project =
        projectsData[projectId];

      if (!project) return;


      // TEXTES

      modalTag.textContent =
        project.tag[currentLanguage];

      modalTitle.textContent =
        project.title;

      modalDescription.textContent =
        project.description[currentLanguage];

      modalYear.textContent =
        project.year;

      modalTools.textContent =
        project.tools[currentLanguage];


      // ═══════════════════════════════
      // GALERIE
      // ═══════════════════════════════

      galleryThumbnails.innerHTML = "";


      project.images.forEach(
        (image, index) => {

          const thumbnail =
            document.createElement("img");

          thumbnail.src =
            image;

          thumbnail.alt =
            project.title +
            " — image " +
            (index + 1);


          if (index === 0) {
            thumbnail.classList.add("active");
          }


          thumbnail.addEventListener(
            "click",
            event => {

              event.stopPropagation();


              // petit fondu

              modalMainImage.style.opacity =
                "0";


              setTimeout(() => {

                modalMainImage.src =
                  image;

                modalMainImage.style.opacity =
                  "1";

              }, 150);


              // active

              document
                .querySelectorAll(
                  ".gallery-thumbnails img"
                )
                .forEach(img => {

                  img.classList.remove(
                    "active"
                  );

                });


              thumbnail.classList.add(
                "active"
              );

            }
          );


          galleryThumbnails.appendChild(
            thumbnail
          );

        }
      );


      // première image

      modalMainImage.src =
        project.images[0];

      modalMainImage.alt =
        project.title;


      // ouverture

      projectModal.classList.add(
        "active"
      );

      document.body.classList.add(
        "modal-open"
      );

    });

  });


// ═══════════════════════════════════════
// FERMETURE
// ═══════════════════════════════════════

function closeProjectModal() {

  projectModal.classList.remove(
    "active"
  );

  document.body.classList.remove(
    "modal-open"
  );

}


modalClose.addEventListener(
  "click",
  closeProjectModal
);


modalOverlay.addEventListener(
  "click",
  closeProjectModal
);


// ═══════════════════════════════════════
// TOUCHE ESC
// ═══════════════════════════════════════

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape" &&
      projectModal.classList.contains("active")
    ) {

      closeProjectModal();

    }

  }
);

// Initialise all translated interface labels in the default language.
setLanguage("fr");
