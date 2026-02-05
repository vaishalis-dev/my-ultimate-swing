const leftSticky = document.getElementById("left-sticky-wrapper");
const rightScroll = document.getElementById("right-scroll-container");
const firstStep = rightScroll.querySelector("[data-anchor]");
const scrollContainer = document.getElementById("scrollContainer");
const steps = [...document.querySelectorAll(".step-image")];
const texts = [...document.querySelectorAll(".text-item")];

function setRightPadding() {
  const vh = window.innerHeight;
  const stepHeight = firstStep.getBoundingClientRect().height;

  const centerPadding = vh / 2 - stepHeight / 2;

  rightScroll.style.paddingTop = `${centerPadding}px`;
  // rightScroll.style.paddingBottom = `${centerPadding}px`;
  // rightScroll.style.paddingBottom = `${centerPadding + vh / 2}px`;

  const leftHeight = leftSticky.getBoundingClientRect().height;
  leftSticky.style.top = `${vh / 2 - leftHeight / 2}px`;
}

// initial
setRightPadding();

// on resize
// window.addEventListener("resize", setRightPadding);

let resizeRAF;

window.addEventListener("resize", () => {
  if (resizeRAF) return;

  resizeRAF = requestAnimationFrame(() => {
    setRightPadding();
    resizeRAF = null;
  });
});

// function catchScroll() {
//   console.log("scrolling......");
//   const scrollTop = scrollContainer.scrollTop; // current scroll position
//   const scrollHeight = scrollContainer.scrollHeight; // total scrollable height
//   const clientHeight = scrollContainer.clientHeight; // visible height

//   // console.log(scrollTop, scrollHeight, clientHeight);
// }

let activeIndex = 0;

function setActiveText(index) {
  // if (index === activeIndex) return;

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

function onScroll() {
  console.log("scrolling.....");
  const containerRect = scrollContainer.getBoundingClientRect();
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

  setActiveText(closestIndex);
}

scrollContainer.addEventListener("scroll", onScroll, { passive: true });
// let ticking = false;
// scrollContainer.addEventListener("scroll", () => {
//   if (!ticking) {
//     requestAnimationFrame(() => {
//       onScroll();
//       ticking = false;
//     });
//     ticking = true;
//   }
// });
