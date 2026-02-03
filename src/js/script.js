const rightScrollContainer = document.getElementById("scrollContainer");
const steps = [...rightScrollContainer.querySelectorAll(".step-image")];
const texts = [...document.querySelectorAll(".text-item")];

let activeIndex = 0;

function setActiveText(index) {
  texts.forEach((text, i) => {
    text.classList.remove("active", "prev", "next");

    if (i === index) {
      text.classList.add("active");
    } else if (i < index) {
      text.classList.add("prev");
    } else {
      text.classList.add("next");
    }
  });

  steps.forEach((step, i) => {
    step.classList.remove("active", "prev", "next");

    if (i === index) {
      step.classList.add("active");
    } else if (i < index) {
      step.classList.add("prev");
    } else {
      step.classList.add("next");
    }
  });

  activeIndex = index;
}

function onRightScroll() {
  const containerRect = rightScrollContainer.getBoundingClientRect();
  const containerCenter = containerRect.top + containerRect.height / 2;

  let closestIndex = 0;
  let minDistance = Infinity;

  steps.forEach((step, index) => {
    const rect = step.getBoundingClientRect();
    const stepCenter = rect.top + rect.height / 2;

    const distance = Math.abs(stepCenter - containerCenter);

    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = index;
    }
  });

  if (closestIndex !== activeIndex) {
    setActiveText(closestIndex);
  }
}

// Listen ONLY to right container scroll
rightScrollContainer.addEventListener("scroll", onRightScroll, {
  passive: true,
});

// Initial state when entering section
setActiveText(0);

const leftSticky = document.getElementById("left-sticky-wrapper");
const rightScroll = document.getElementById("right-scroll-container");
const firstStep = rightScroll.querySelector("[data-anchor]");

function setRightPadding() {
  const viewportHeight = window.innerHeight;
  const stepHeight = firstStep.offsetHeight;

  const paddingY = viewportHeight / 2 - stepHeight / 2;

  rightScroll.style.paddingTop = `${paddingY}px`;
  // rightScroll.style.paddingBottom = `${paddingY + vh / 2}px`;
  rightScroll.style.paddingBottom = `${paddingY}px`;

  const leftHeight = leftSticky.offsetHeight;
  const top = viewportHeight / 2 - leftHeight / 2;

  leftSticky.style.top = `${top}px`;
}

// function setRightPadding() {
//   const vh = window.innerHeight;
//   const stepHeight = firstStep.offsetHeight;

//   // Center step
//   const centerPadding = vh / 2 - stepHeight / 2;

//   // Apply to right scroll
//   rightScroll.style.paddingTop = `${centerPadding}px`;

//   // IMPORTANT PART 👇
//   // Give last image time before snap
//   rightScroll.style.paddingBottom = `${centerPadding + vh / 2}px`;

//   // Left stays centered
//   const leftHeight = leftSticky.offsetHeight;
//   leftSticky.style.top = `${vh / 2 - leftHeight / 2}px`;
// }


// initial
setRightPadding();

// on resize
window.addEventListener("resize", setRightPadding);
