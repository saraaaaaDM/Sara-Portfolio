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
  const moveX = mouseX * 15;
  const moveY = mouseY * 15;

  const scale = currentScale;

  if (!zone) return;

  zone.style.transform =
    `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px)) scale(${scale})`;

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
// DONNÉES DES PROJETS
// ═══════════════════════════════════════

const projectsData = {

  // ─────────────────────────────────────
  // NOMA
  // ─────────────────────────────────────

  noma: {

    tag:
      "BRANDING • DIRECTION ARTISTIQUE",

    title:
      "NOMA",

    description:
      "NOMA est une marque de maillots de bain pensée pour différentes morphologies. Le projet part d’une réflexion autour des tailles standardisées et de la diversité des corps. J’ai imaginé une identité qui met en avant cette diversité plutôt que de chercher à la faire entrer dans une norme. J’ai travaillé autour de formes organiques inspirées du corps, d’un motif reconnaissable et d’une palette solaire et colorée. L’identité a ensuite été déclinée à travers le logo, la typographie, les couleurs, les motifs, les supports de communication et la direction artistique photographique.",

    year:
      "2025",

    tools:
      "Illustrator • Photoshop • InDesign",

    images: [

      "items/1.png",
      "items/2.png",
      "items/3.png",
      "items/4.png",
      "items/5.png",
      "items/6.png",
      "items/7.png",

    ]

  },


  // ─────────────────────────────────────
  // PROJET 02
  // ─────────────────────────────────────

  keycloak: {
    tag: "UX/UI • WEBDESIGN • PROTOTYPAGE",

    title: "KEYCLOAK",

    description: `Dans le cadre de mon expérience en entreprise, j’ai travaillé sur la refonte de l’interface de Keycloak, une solution permettant notamment de gérer les utilisateurs, les applications et les accès.

L’objectif était de repenser l’organisation de l’interface afin de rendre les informations plus accessibles et les différents parcours plus simples à comprendre.

J’ai réalisé plusieurs propositions de maquettes et exploré différentes versions de l’interface. J’ai également travaillé sur les parcours utilisateurs, la navigation et les interactions entre les différents écrans.

Ce projet m’a permis d’approfondir ma pratique de l’UX/UI et de réfléchir à la manière de rendre une interface complexe plus claire et intuitive.`,

    year: "2026",

    tools: "Figma • UX/UI • Prototypage",

    images: [
      "items/Keycloak.png",
      "items/keycloak-2.png",
      "items/keycloak-1.png",
      "items/keycloak-3.mp4",
      "items/keycloak-4.png"
    ]
  },


  // ─────────────────────────────────────
  // PROJET 03
  // ─────────────────────────────────────

  project3: {

    tag:
      "PROJET 03",

    title:
      "Projet 03",

    description:
      "Description du projet à venir.",

    year:
      "2025",

    tools:
      "À définir",

    images: [
      "items/chat.jpg"
    ]

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

      const project =
        projectsData[projectId];

      if (!project) return;


      // TEXTES

      modalTag.textContent =
        project.tag;

      modalTitle.textContent =
        project.title;

      modalDescription.textContent =
        project.description;

      modalYear.textContent =
        project.year;

      modalTools.textContent =
        project.tools;


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
