const revealItems = [...document.querySelectorAll(".reveal")];
const stepCards = [...document.querySelectorAll(".step-card")];
const screenshots = [...document.querySelectorAll(".shot")];
const heroSection = document.querySelector("#top");
const firstStepCard = stepCards[0];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");

          if (entry.target === heroSection && firstStepCard) {
            firstStepCard.classList.add("is-visible");
            observer.unobserve(firstStepCard);
          }

          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.18,
      rootMargin: "0px 0px -6% 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const setActiveStep = (activeCard) => {
  stepCards.forEach((card) => card.classList.remove("step-active"));
  if (activeCard) {
    activeCard.classList.add("step-active");
  }
};

const stepObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visible.length > 0) {
      setActiveStep(visible[0].target);
    }
  },
  {
    root: null,
    threshold: [0.2, 0.45, 0.7],
    rootMargin: "-15% 0px -32% 0px",
  }
);

stepCards.forEach((card) => stepObserver.observe(card));

if (!reduceMotion) {
  let ticking = false;

  const renderParallax = () => {
    const viewportCenter = window.innerHeight / 2;

    screenshots.forEach((image) => {
      const bounds = image.getBoundingClientRect();
      const imageCenter = bounds.top + bounds.height / 2;
      const offset = (viewportCenter - imageCenter) * 0.018;
      const translateY = Math.max(-10, Math.min(10, offset));
      image.style.setProperty("--parallax", `${translateY.toFixed(2)}px`);
    });

    ticking = false;
  };

  const requestRender = () => {
    if (ticking) {
      return;
    }
    ticking = true;
    window.requestAnimationFrame(renderParallax);
  };

  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", requestRender);
  requestRender();
}

const booksTrack = document.querySelector('[data-marquee="books"] .marquee-track');
const subjectsTrack = document.querySelector('[data-marquee="subjects"] .marquee-track');

const books = [
  "# Davidson's Medicine",
  "# Bailey and Love Surgery",
  "# Robbins Pathology",
  "# DC Dutta Obstetrics",
  "# DC Dutta Gynecology",
  "# USMLE First Aid",
  "# Williams Obstetrics",
  "# Nelson Pediatrics",
  "# Apley's Orthopedics",
  "# Lange Microbiology",
  "# BD Chaurasia Anatomy",
  "# Guyton and Hall",
  "# Harrison's Medicine",
  "# Hutchison's Medicine",
  "# Macleods",
  "# Norman Browse",
  "# Brenner and Rector Nephrology",
  "# Greenberg's Neurosurgery",
];

const subjects = [
  "# Surgery",
  "# Medicine",
  "# Gynecology",
  "# Obstetrics",
  "# Anatomy",
  "# Pediatrics",
  "# USMLE",
  "# Nephrology",
  "# Pharmacology",
  "# Microbiology",
  "# Neurosurgery",
  "# Orthopedics",
];

const shuffleList = (items) => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
};

const createChip = (label, hidden = false) => {
  const chip = document.createElement("span");
  chip.className = "marquee-chip";
  chip.textContent = label;
  if (hidden) {
    chip.setAttribute("aria-hidden", "true");
  }
  return chip;
};

const createMarqueeRun = (items, hidden = false) => {
  const run = document.createElement("div");
  run.className = "marquee-run";
  if (hidden) {
    run.setAttribute("aria-hidden", "true");
  }

  items.forEach((item) => {
    run.append(createChip(item, hidden));
  });

  return run;
};

const populateMarqueeTrack = (track, list) => {
  track.textContent = "";
  const primaryItems = shuffleList(list);
  const fragment = document.createDocumentFragment();

  fragment.append(createMarqueeRun(primaryItems));

  if (!reduceMotion) {
    let secondaryItems = shuffleList(list);

    if (secondaryItems.join("|") === primaryItems.join("|")) {
      secondaryItems = shuffleList(list);
    }

    fragment.append(createMarqueeRun(secondaryItems, true));
  }

  track.append(fragment);
};

if (booksTrack && subjectsTrack) {
  populateMarqueeTrack(booksTrack, books);
  populateMarqueeTrack(subjectsTrack, subjects);
}
