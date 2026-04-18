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

  // Replace step observer logic just to handle active class if needed 
  // since we removed indicator. Or simple scroll listener
  slider.addEventListener("scroll", () => {
    let currentIndex = Math.round(slider.scrollLeft / slider.clientWidth);
    currentIndex = Math.max(0, Math.min(currentIndex, stepCards.length - 1));
    setActiveStep(currentIndex);
  }, { passive: true });

  startAutoScroll();

  slider.addEventListener('mouseenter', pauseAutoScroll);
  slider.addEventListener('mouseleave', resumeAutoScroll);
  slider.addEventListener('touchstart', pauseAutoScroll, { passive: true });
  slider.addEventListener('touchend', resumeAutoScroll, { passive: true });
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
    addBubble(remainingPool.pop());
  }

  // Rotate all bubbles sequentially every 5 seconds
  setInterval(() => {
    if (document.hidden) return; // don't animate in background

    const bubbles = Array.from(bubbleContainer.querySelectorAll('.example-bubble'));
    if (bubbles.length === 0) return;

    bubbles.forEach((targetBubble, index) => {
      setTimeout(() => {
        if (remainingPool.length === 0) {
          remainingPool = [...exampleQuestions].sort(() => Math.random() - 0.5);
        }

        targetBubble.classList.remove('show');
        targetBubble.classList.add('hide');

        setTimeout(() => {
          targetBubble.textContent = remainingPool.pop();
          targetBubble.classList.remove('hide');
          targetBubble.classList.add('show');
        }, 800); // wait for 800ms CSS fade-out transition

      }, index * 1000); // 1000ms stagger between each bubble fading out
    });

  }, 4500); // total 4.5s cycle loop
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
