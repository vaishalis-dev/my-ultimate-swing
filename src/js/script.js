document.addEventListener("DOMContentLoaded", () => {
  const scrollContainer = document.getElementById("scrollContainer");
  const mainContent = document.getElementById("main-content");
  const textItems = document.querySelectorAll(".text-item");

  const totalItems = textItems.length;

  let sectionActive = false;
  let lastScrollTop = 0;
  let currentIndex = 0;

  // Just detect section presence — DO NOTHING else
  const observer = new IntersectionObserver(
    ([entry]) => {
      sectionActive = entry.isIntersecting;
    },
    {
      root: scrollContainer,
      threshold: 0.1,
    }
  );

  observer.observe(mainContent);

  scrollContainer.addEventListener("scroll", () => {
    if (!sectionActive) return;

    const scrollTop = scrollContainer.scrollTop;
    const delta = scrollTop - lastScrollTop;

    // Ignore micro scroll
    if (Math.abs(delta) < 10) return;

    // Scroll DOWN → next text
    if (delta > 0 && currentIndex < totalItems - 1) {
      currentIndex++;
      updateTextItems(currentIndex);
    }

    // (optional) Scroll UP → previous text
    if (delta < 0 && currentIndex > 0) {
      currentIndex--;
      updateTextItems(currentIndex);
    }

    lastScrollTop = scrollTop;
  });

  function updateTextItems(index) {
    textItems.forEach((item, i) => {
      item.classList.remove("active", "prev");

      if (i === index) {
        item.classList.add("active");
      } else if (i < index) {
        item.classList.add("prev");
      }
    });
  }
});
