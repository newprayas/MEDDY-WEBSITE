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

const setActiveStep = (index) => {
  stepCards.forEach((card, i) => {
    if (i === index) {
      card.classList.add("step-active");
    } else {
      card.classList.remove("step-active");
    }
  });
};

const slider = document.getElementById("steps-slider");
const prevBtn = document.getElementById("prev-step");
const nextBtn = document.getElementById("next-step");
const sliderIndicator = document.getElementById("slider-indicator");

if (slider && prevBtn && nextBtn && sliderIndicator) {
  const updateButtons = () => {
    const scrollLeft = slider.scrollLeft;
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    const itemWidth = slider.clientWidth;
    
    // Calculate current index (0 to length - 1)
    let currentIndex = Math.round(scrollLeft / itemWidth);
    currentIndex = Math.max(0, Math.min(currentIndex, stepCards.length - 1));
    
    sliderIndicator.textContent = `${currentIndex + 1} / ${stepCards.length}`;
    
    if (scrollLeft <= 0) {
      prevBtn.disabled = true;
    } else {
      prevBtn.disabled = false;
    }
    
    if (scrollLeft >= maxScroll - 5) {
      // Loop around if button is pushed or keep disabled? The user wanted auto-scroll so button can just be disabled.
      nextBtn.disabled = true;
    } else {
      nextBtn.disabled = false;
    }

    setActiveStep(currentIndex);
  };

  slider.addEventListener("scroll", () => {
    if (!reduceMotion) {
      window.requestAnimationFrame(updateButtons);
    } else {
      updateButtons();
    }
  }, { passive: true });

  // Auto-scroll logic
  const autoScrollDuration = 1500;
  let autoScrollTimer;
  let timeRemaining = autoScrollDuration;
  let lastStartTime = Date.now();
  let isInteracting = false;

  const startAutoScroll = () => {
    if (isInteracting) return;
    clearTimeout(autoScrollTimer);
    lastStartTime = Date.now();
    autoScrollTimer = setTimeout(autoScrollStep, timeRemaining);
  };

  const pauseAutoScroll = () => {
    if (isInteracting) return;
    clearTimeout(autoScrollTimer);
    timeRemaining -= (Date.now() - lastStartTime);
    if (timeRemaining < 0) timeRemaining = 0;
    isInteracting = true;
  };

  const resumeAutoScroll = () => {
    if (!isInteracting) return;
    isInteracting = false;
    startAutoScroll();
  };

  const resetAutoScroll = (force = false) => {
    timeRemaining = autoScrollDuration;
    if (force) isInteracting = false;
    if (!isInteracting) startAutoScroll();
  };

  const autoScrollStep = () => {
    if (isInteracting) return;
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    
    if (slider.scrollLeft >= maxScroll - 5) {
      slider.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      let currentIndex = Math.round(slider.scrollLeft / slider.clientWidth);
      let nextIndex = (currentIndex + 1) % stepCards.length;
      slider.scrollTo({ left: nextIndex * slider.clientWidth, behavior: "smooth" });
    }
    
    resetAutoScroll();
  };

  startAutoScroll();

  slider.addEventListener('mouseenter', pauseAutoScroll);
  slider.addEventListener('mouseleave', resumeAutoScroll);
  slider.addEventListener('touchstart', pauseAutoScroll, { passive: true });
  slider.addEventListener('touchend', resumeAutoScroll, { passive: true });

  prevBtn.addEventListener("click", () => {
    slider.scrollBy({ left: -slider.clientWidth, behavior: "smooth" });
    resetAutoScroll(true); // forces timer to restart without waiting
  });

  nextBtn.addEventListener("click", () => {
    slider.scrollBy({ left: slider.clientWidth, behavior: "smooth" });
    resetAutoScroll(true); // forces timer to restart without waiting
  });

  // Initial update
  updateButtons();
}

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
