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

if (slider) {
  const autoScrollDuration = document.title.includes("Meddy") ? 1800 : 2000;
  let autoScrollTimer;
  let timeRemaining = autoScrollDuration;
  let lastStartTime = Date.now();
  let isInteracting = false;
  let isVisible = false;

  const startAutoScroll = () => {
    if (isInteracting || !isVisible) return;
    clearTimeout(autoScrollTimer);
    lastStartTime = Date.now();
    autoScrollTimer = setTimeout(autoScrollStep, timeRemaining);
  };

  const pauseAutoScroll = () => {
    if (isInteracting && !isVisible) return; // already paused
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
    if (!isInteracting && isVisible) startAutoScroll();
  };

  const autoScrollStep = () => {
    if (isInteracting || !isVisible) return;
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

  slider.addEventListener("scroll", () => {
    let currentIndex = Math.round(slider.scrollLeft / slider.clientWidth);
    currentIndex = Math.max(0, Math.min(currentIndex, stepCards.length - 1));
    setActiveStep(currentIndex);
  }, { passive: true });

  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isVisible = true;
        startAutoScroll();
      } else {
        isVisible = false;
        clearTimeout(autoScrollTimer);
      }
    });
  }, { threshold: 0.1 });

  visibilityObserver.observe(slider);

  slider.addEventListener('mouseenter', pauseAutoScroll);
  slider.addEventListener('mouseleave', resumeAutoScroll);
  slider.addEventListener('touchstart', pauseAutoScroll, { passive: true });
  slider.addEventListener('touchend', resumeAutoScroll, { passive: true });

  const nextBtn = document.querySelector(".slider-nav-btn.next");
  const prevBtn = document.querySelector(".slider-nav-btn.prev");

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      if (slider.scrollLeft >= maxScroll - 5) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollBy({ left: slider.clientWidth, behavior: "smooth" });
      }
      resetAutoScroll(true);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      if (slider.scrollLeft <= 5) {
        slider.scrollTo({ left: maxScroll, behavior: "smooth" });
      } else {
        slider.scrollBy({ left: -slider.clientWidth, behavior: "smooth" });
      }
      resetAutoScroll(true);
    });
  }
}

const exampleQuestions = [
  "Tokyo guidelines for cholecystitis?",
  "Pathophysiology of SLE?",
  "Define PPH?",
  "Complications of adenoids?",
  "Lab diagnosis of E. coli?",
  "When to do a CT scan in a head injury patient?",
  "Treatment of preterm labor?",
  "Mechanism of action of Diazepam?",
  "Bones of the upper limb?",
  "What is the Trendelenburg sign?",
  "Cohort vs case-control study?",
  "What are the stages of shock?",
  "First-line treatment for Tuberculosis?",
  "Causes of left shift in oxyhemoglobin curve?",
  "Management of Diabetic Ketoacidosis?",
  "Clinical features of acute appendicitis?",
  "Mechanism of action of Penicillin?",
  "What is the triad of Meniere's disease?",
  "Signs of retinal detachment?",
  "Stages of labor?",
  "Causes of Postpartum Hemorrhage?",
  "Pathophysiology of Myocardial Infarction?",
  "Types of hypersensitivity reactions?",
  "Gram stain of Staphylococcus aureus?",
  "Symptoms of primary open-angle glaucoma?",
  "Management of acute epistaxis?",
  "Complications of Peptic Ulcer Disease?",
  "Diagnosis of Polycystic Ovary Syndrome?",
  "What is the Bishop score used for?",
  "Risk factors for Deep Vein Thrombosis?"
];

const bubbleContainer = document.getElementById("examples-container");

if (bubbleContainer) {
  let remainingPool = [...exampleQuestions].sort(() => Math.random() - 0.5);
  let isBubblesVisible = false;

  const addBubble = (text) => {
    const bubble = document.createElement('div');
    bubble.className = "example-bubble";
    bubble.textContent = text;
    bubbleContainer.appendChild(bubble);

    // trigger reflow
    void bubble.offsetWidth;
    bubble.classList.add('show');
    return bubble;
  };

  // Initially show 3 random questions
  for (let i = 0; i < 3; i++) {
    if (remainingPool.length === 0) {
      remainingPool = [...exampleQuestions].sort(() => Math.random() - 0.5);
    }
    addBubble(remainingPool.pop());
  }

  const rotateBubbles = () => {
    if (document.hidden || !isBubblesVisible) return;

    const bubbles = Array.from(bubbleContainer.querySelectorAll('.example-bubble'));
    if (bubbles.length === 0) return;

    // Phase 1: Fade out all together
    bubbles.forEach(bubble => {
      bubble.classList.remove('show');
      bubble.classList.add('hide');
    });

    // Phase 2: Update text and fade back in
    setTimeout(() => {
      bubbles.forEach(bubble => {
        if (remainingPool.length === 0) {
          remainingPool = [...exampleQuestions].sort(() => Math.random() - 0.5);
        }
        bubble.textContent = remainingPool.pop();
        bubble.classList.remove('hide');
        bubble.classList.add('show');
      });
    }, 400);
  };

  const bubbleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isBubblesVisible = entry.isIntersecting;
    });
  }, { threshold: 0.1 });

  bubbleObserver.observe(bubbleContainer);

  setInterval(rotateBubbles, 2500);
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
