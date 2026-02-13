gsap.registerPlugin(ScrollTrigger, Observer);

const container = document.getElementById("main-scroll-container");
const sections = gsap.utils.toArray(".section");
const logoLink = document.getElementById("logo-link");

const texts = gsap.utils.toArray(
  ".left-side-container .text-wrapper .data-text .text-item",
);

const scrollContainer = document.querySelector(".right-scroll-container");
const images = gsap.utils.toArray(".right-scroll-container .step-image");
const leftSticky = document.getElementById("left-sticky-wrapper");
/** Section height = scroll container height so snapping works with 100dvh/100% (mobile-friendly). */
function getSectionHeight() {
  const h = container?.clientHeight;
  return h && h > 0 ? h : window.innerHeight;
}
const imageHeight = (window.innerHeight * 40) / 100;

let currentSection = 0;
let currentImage = 0;
let isAnimating = false;

let scrollLocked = false;
const SCROLL_LOCK_TIME = 250; // ms (tweak 350–600)

const MD_BREAKPOINT = 768; // Tailwind md (≤768 = mobile)
const MD_BREAKPOINT_LEFT_STICKY = 1025; // Tailwind md (≤768 = mobile)
const MOBILE_SNAP_OFFSET_BELOW_CENTER = 0.35;
const DESKTOP_SNAP_OFFSET_ABOVE_CENTER = 0.12; // snap target just above center
const MOBILE_PADDING_OFFSET_RATIO = 0.12;

logoLink.addEventListener("click", () => {
  if (isAnimating || scrollLocked) return;
  isAnimating = true;
  scrollLocked = true;
  gsap
    .timeline()
    .to(scrollContainer, {
      scrollTop: 0,
      duration: 0.4,
    })
    .to(container, {
      scrollTop: 0,
      duration: 0.4,
      ease: "power2.inOut",
    })
    .call(() => {
      currentImage = 0;
      currentSection = 0;
      isAnimating = false;
      scrollLocked = false;
      updateClasses(0);
      setTimeout(() => {
        scrollLocked = false;
      }, SCROLL_LOCK_TIME);
    });
});

function isMobile() {
  return window.matchMedia(`(max-width: ${MD_BREAKPOINT}px)`).matches;
}

function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

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
    scrollTop: index * getSectionHeight(),
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
      } else if (currentSection === 2) {
        updateClasses(3);
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

function scrollToImage(index, callback) {
  if (isAnimating || scrollLocked) return;

  isAnimating = true;
  scrollLocked = true;

  updateClasses(index);

  const targetImage = images[index];

  // Image center position inside scroll container
  const imageRect = targetImage.getBoundingClientRect();
  const containerRect = scrollContainer.getBoundingClientRect();
  const currentScroll = scrollContainer.scrollTop;

  // position of image center relative to container
  const imageCenter =
    imageRect.top - containerRect.top + currentScroll + imageRect.height / 2;

  const clientHeight = scrollContainer.clientHeight;
  const isMobileView = window.matchMedia(
    `(max-width: ${MD_BREAKPOINT}px)`,
  ).matches;

  // where the viewport center should be
  // Desktop: snap to vertical center. Mobile: snap slightly below center.
  const snapTargetY = isMobileView
    ? clientHeight / 2 + clientHeight * MOBILE_PADDING_OFFSET_RATIO
    : clientHeight / 2;

  const finalScroll = imageCenter - snapTargetY;

  gsap.to(scrollContainer, {
    scrollTop: finalScroll,
    duration: 0.7,
    ease: "power3.inOut",
    onComplete: () => {
      currentImage = index;
      isAnimating = false;
      setTimeout(() => (scrollLocked = false), SCROLL_LOCK_TIME);
      if (callback) callback();
    },
  });
}

// On mobile touch, many browsers report scroll deltas opposite to wheel (finger up → onDown).
// Detect touch via Observer's self.event and invert direction so: drag up = next, drag down = prev.
function isTouchEvent(observerInstance) {
  const e = observerInstance?.event;
  return e && typeof e.type === "string" && e.type.startsWith("touch");
}

// On touch devices: if native scroll ever takes over, snap main container back to current section
const SECTION_SNAP_TOLERANCE = 3;
let scrollSnapRaf = null;
function enforceSectionScrollPosition() {
  if (!container || !isTouchDevice()) return;
  if (scrollSnapRaf) return;
  scrollSnapRaf = requestAnimationFrame(() => {
    scrollSnapRaf = null;
    if (isAnimating || scrollLocked) return;
    const expected = currentSection * getSectionHeight();
    const current = container.scrollTop;
    if (Math.abs(current - expected) > SECTION_SNAP_TOLERANCE) {
      container.scrollTop = expected;
    }
  });
}
if (container) {
  container.addEventListener("scroll", enforceSectionScrollPosition, {
    passive: true,
  });
}

Observer.create({
  // target: container,
  target: window,
  type: "wheel,touch",
  //tolerance: 30, // slightly higher
  //wheelSpeed: 1.5, // dampen trackpads
  preventDefault: true,

  onDown(self) {
    const goNext = () => {
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
    };
    const goPrev = () => {
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
    };
    if (isTouchEvent(self)) {
      goPrev();
    } else {
      goNext();
    }
  },

  onUp(self) {
    const goNext = () => {
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
    };
    const goPrev = () => {
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
    };
    if (isTouchEvent(self)) {
      goNext();
    } else {
      goPrev();
    }
  },
});

const firstStep = scrollContainer.querySelector("[data-anchor]");

function setRightPadding() {
  if (!scrollContainer) return;

  // detect md screens
  const mdQuery = window.matchMedia(`(min-width: ${MD_BREAKPOINT}px)`);
  const vh = window.innerHeight;
  const stepHeight = firstStep.getBoundingClientRect().height;
  const centerPadding = vh / 2 - stepHeight / 2;

  if (mdQuery.matches) {
    // Desktop: center the first image
    scrollContainer.style.paddingTop = `${centerPadding}px`;
    scrollContainer.style.paddingBottom = `${centerPadding}px`;
    return;
  }

  // Mobile: first image sits below center (same position as snap target)
  const offset = vh * MOBILE_PADDING_OFFSET_RATIO;
  const paddingTop = centerPadding + offset;
  let paddingBottom = centerPadding;
  // paddingBottom = paddingBottom * 0.75;
  scrollContainer.style.paddingTop = `${Math.max(0, paddingTop)}px`;
  scrollContainer.style.paddingBottom = `${Math.max(0, paddingBottom)}px`;
}

function setLeftPadding() {
  if (!leftSticky) return;
  const mdQuery = window.matchMedia(
    `(max-width: ${MD_BREAKPOINT_LEFT_STICKY}px)`,
  );
  if (!mdQuery.matches) {
    // console.log("setting left padding to 0px");
    leftSticky.style.paddingTop = "0px";
    return;
  }
  const vh = window.innerHeight;
  const clientHeight = leftSticky.clientHeight;
  const isMobileView = window.matchMedia(
    `(max-width: ${MD_BREAKPOINT_LEFT_STICKY}px)`,
  ).matches;
  const leftHeight = leftSticky.getBoundingClientRect().height;
  const snapTargetY = isMobileView
    ? clientHeight / 2 - clientHeight * MOBILE_SNAP_OFFSET_BELOW_CENTER
    : clientHeight / 2 - clientHeight * DESKTOP_SNAP_OFFSET_ABOVE_CENTER;
  leftSticky.style.paddingTop = `${snapTargetY}px`;
}

// function setRealViewportHeight() {
//   const vh = window.visualViewport
//     ? window.visualViewport.height
//     : window.innerHeight;
//   console.log("real viewPort height: ",vh);
//   document.documentElement.style.setProperty("--vh", `${vh}px`);
// }

function setHeaderHeight() {
  const header = document.getElementById("global-header");
  if (header) {
    const h = header.getBoundingClientRect().height;
    console.log("header height: ", h);

    document.documentElement.style.setProperty("--header-height", `${h}px`);
  }
}
setHeaderHeight();
// setRealViewportHeight();

// window.addEventListener("resize", setRealViewportHeight);
// window.addEventListener("orientationchange", setRealViewportHeight);
window.addEventListener("resize", setHeaderHeight);
window.addEventListener("load", setLeftPadding);
window.addEventListener("resize", setLeftPadding);

// ------ BELOW CODE IS FOR CONNECTORS -----

const LeaderLine =
  typeof window !== "undefined" &&
  (window.LeaderLine?.default ?? window.LeaderLine);
const hasLeaderLine = typeof LeaderLine === "function";
let leaderLines = [];

const connectorColors = ["#FDCB1D", "#EB59B2", "#A576C7"];

function createLeaderLines() {
  if (!hasLeaderLine) return;
  leaderLines.forEach((line) => line.remove());
  leaderLines = [];

  const imageContainers = document.querySelectorAll(".step-image");
  for (let i = 0; i < imageContainers.length - 1; i++) {
    const line = new LeaderLine(imageContainers[i], imageContainers[i + 1], {
      color: connectorColors[i],
      size: 3,
      path: "magnet",
      startPlug: "behind",
      endPlug: "behind",
      startSocket: "bottom",
      endSocket: "top",
      dash: { len: 14, gap: 10, animation: true },
    });
    leaderLines.push(line);
  }
  positionLeaderLines();
}

function positionLeaderLines() {
  if (!hasLeaderLine) return;
  leaderLines.forEach((line) => line.position());
}

function initLeaderLines() {
  setRightPadding();
  if (!hasLeaderLine) return;
  createLeaderLines();
  requestAnimationFrame(() => {
    requestAnimationFrame(positionLeaderLines);
  });
}

window.addEventListener("load", initLeaderLines);
window.addEventListener("resize", () => {
  setRightPadding();
  positionLeaderLines();
});
requestAnimationFrame(() => setRightPadding());

// Update line positions on scroll
let scrollRaf = null;
function onScroll() {
  if (scrollRaf) return;
  scrollRaf = requestAnimationFrame(() => {
    positionLeaderLines();
    scrollRaf = null;
  });
}

container.addEventListener("scroll", onScroll, { passive: true });
scrollContainer.addEventListener("scroll", onScroll, { passive: true });