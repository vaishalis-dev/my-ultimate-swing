gsap.registerPlugin(ScrollTrigger, Observer);

const container = document.getElementById("main-scroll-container");
const sections = gsap.utils.toArray(".section");

const texts = gsap.utils.toArray(
  ".left-side-container .text-wrapper .data-text .text-item",
);

const scrollContainer = document.querySelector(".right-scroll-container");
const images = gsap.utils.toArray(".right-scroll-container .step-image");

const sectionHeight = window.innerHeight;
const imageHeight = (window.innerHeight * 40) / 100;

let currentSection = 0;
let currentImage = 0;
let isAnimating = false;

let scrollLocked = false;
const SCROLL_LOCK_TIME = 250; // ms (tweak 350–600)

// ---------------- SECTION SCROLL ----------------

function scrollToSection(index) {
  if (isAnimating || scrollLocked) return;

  isAnimating = true;
  scrollLocked = true;

  // gsap.to(container, {
  //   scrollTop: index * sectionHeight,
  //   duration: 0.8,
  //   ease: "power2.inOut",
  //   onComplete: () => {
  //     console.log("section scrolled from", currentSection);
  //     currentSection = index;
  //     console.log("section scrolled to", index);
  //     isAnimating = false;
  //     if (index === 1) {
  //       console.log("updating classes for image 1");
  //       // updateClasses(0);
  //       setTimeout(() => {
  //         updateClasses(0);
  //       }, 2000);
  //     }
  //     // unlock AFTER momentum dies
  //     setTimeout(() => {
  //       scrollLocked = false;
  //     }, SCROLL_LOCK_TIME);
  //   },
  // });
  let triggered75 = false;

  gsap.to(container, {
    scrollTop: index * sectionHeight,
    duration: 0.8,
    ease: "power2.inOut",

    onStart: () => {
      // reset for each new scroll animation
      triggered75 = false;
    },

    onUpdate: function () {
      const progress = this.progress();

      // fire ONLY once when animation crosses 75%
      if (!triggered75 && progress >= 0.75 && index === 1) {
        triggered75 = true;
        // console.log("updating classes for image 1 at 75%");
        updateClasses(0);
      }
    },

    onComplete: () => {
      // console.log("section scrolled from", currentSection);
      currentSection = index;
      // console.log("section scrolled to", index);
      isAnimating = false;

      // unlock AFTER momentum dies
      setTimeout(() => {
        scrollLocked = false;
      }, SCROLL_LOCK_TIME);
    },
  });
}

// ---------------- IMAGE SCROLL ----------------

function updateClasses(index) {
  texts.forEach((text, i) => {
    text.classList.remove("active", "prev", "next", "hidden");

    if (i === index) {
      text.classList.add("active");
    } else if (i === index - 1) {
      text.classList.add("prev");
    } else if (i === index + 1) {
      text.classList.add("next");
    }
  });

  images.forEach((img, i) => {
    img.classList.remove("active", "prev", "next");

    if (i === index) {
      img.classList.add("active");
    } else if (i === index - 1) {
      img.classList.add("prev");
    } else if (i === index + 1) {
      img.classList.add("next");
    }
  });
}

// function scrollToImage(index) {
//   if (isAnimating || scrollLocked) return;

//   isAnimating = true;
//   scrollLocked = true;

//   //update classes on text and images
//   updateClasses(index);

//   // texts.forEach((text, i) => {
//   //   if (i === index) {
//   //     text.classList.add("active");
//   //     text.classList.remove("hidden");
//   //     gsap.fromTo(text, { opacity: 0, blur: "8px" }, { opacity: 1, blur: "0px", duration: 0.8, ease: "power2.inOut" });
//   //   } else {
//   //     text.classList.remove("active");
//   //     text.classList.add("hidden");
//   //   }
//   // });

//   images.forEach((img, i) => {
//     if (i === index) {
//       gsap.to(images[i], {
//         scale: 1.1,
//         duration: 0.6,
//         ease: "power2.inOut",
//       });
//     } else {
//       gsap.to(images[i], {
//         scale: 0.9,
//         duration: 0.2,
//         ease: "power2.inOut",
//       });
//     }
//   });

//   gsap.to(scrollContainer, {
//     scrollTop: index !== 3 ? index * imageHeight : index * imageHeight + imageHeight / 1.5,
//     duration: 0.6,
//     ease: "power2.inOut",
//     onComplete: () => {
//       currentImage = index;
//       isAnimating = false;

//       // critical for touchpads
//       setTimeout(() => {
//         scrollLocked = false;
//       }, SCROLL_LOCK_TIME);
//     },
//   });
// }

// ---------------- OBSERVER ----------------

function scrollToImage(index) {
  if (isAnimating || scrollLocked) return;

  isAnimating = true;
  scrollLocked = true;

  updateClasses(index);

  const targetImage = images[index];

  // Image center position inside scroll container
  const imageRect = targetImage.getBoundingClientRect();
  const containerRect = scrollContainer.getBoundingClientRect();

  // current scroll
  const currentScroll = scrollContainer.scrollTop;

  // position of image center relative to container
  const imageCenter =
    imageRect.top - containerRect.top + currentScroll + imageRect.height / 2;

  // where the viewport center should be
  const containerCenter = scrollContainer.clientHeight / 2;

  const finalScroll = imageCenter - containerCenter;

  gsap.to(scrollContainer, {
    scrollTop: finalScroll,
    duration: 0.7,
    ease: "power3.inOut",
    onComplete: () => {
      currentImage = index;
      isAnimating = false;
      setTimeout(() => (scrollLocked = false), SCROLL_LOCK_TIME);
    },
  });
}

Observer.create({
  // target: container,
  target: window,
  type: "wheel,touch",
  //tolerance: 30, // slightly higher
  //wheelSpeed: 1.5, // dampen trackpads
  preventDefault: true,

  onDown() {
    // IMAGE SECTION
    if (currentSection === 1) {
      if (currentImage < images.length - 1) {
        scrollToImage(currentImage + 1);
      } else {
        scrollToSection(2);
      }
      return;
    }

    if (currentSection < sections.length - 1) {
      scrollToSection(currentSection + 1);
    }
  },

  onUp() {
    // IMAGE SECTION
    if (currentSection === 1) {
      if (currentImage > 0) {
        scrollToImage(currentImage - 1);
      } else {
        scrollToSection(0);
      }
      return;
    }

    if (currentSection > 0) {
      scrollToSection(currentSection - 1);
    }
  },
});


const MD_BREAKPOINT = 768; // Tailwind md
const firstStep = scrollContainer.querySelector("[data-anchor]");

function setRightPadding() {
  if (!scrollContainer) return;

  // detect md screens
  const mdQuery = window.matchMedia(`(min-width: ${MD_BREAKPOINT}px)`);
  // If screen is SMALLER than md → remove padding
  if (!mdQuery.matches) {
    scrollContainer.style.paddingTop = "";
    scrollContainer.style.paddingBottom = "";
    return;
  }
  const vh = window.innerHeight;
  const stepHeight = firstStep.getBoundingClientRect().height;

  const centerPadding = vh / 2 - stepHeight / 2;

  scrollContainer.style.paddingTop = `${centerPadding}px`;
  scrollContainer.style.paddingBottom = `${centerPadding}px`;
}
window.addEventListener("load", setRightPadding);
window.addEventListener("resize", setRightPadding);
