const scrollContainer = document.getElementById("scrollContainer");
const steps = [...document.querySelectorAll(".step-image")];
const texts = [...document.querySelectorAll(".text-item")];

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

const svg = document.getElementById("connectorSvg");
const anchors = [...document.querySelectorAll("[data-anchor]")];
const wrapper = document.querySelector(".right-scroll-wrapper");

function drawConnectors() {
  svg.innerHTML = "";

  const wrapperRect = wrapper.getBoundingClientRect();

  anchors.forEach((current, i) => {
    const next = anchors[i + 1];
    if (!next) return;

    const r1 = current.getBoundingClientRect();
    const r2 = next.getBoundingClientRect();

    // Convert viewport coords → wrapper coords
    const x1 = r1.left + r1.width / 2 - wrapperRect.left;
    const y1 = r1.top + r1.height / 2 - wrapperRect.top;

    const x2 = r2.left + r2.width / 2 - wrapperRect.left;
    const y2 = r2.top + r2.height / 2 - wrapperRect.top;

    // Smooth curve
    const cx = (x1 + x2) / 2;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`,
    );

    path.setAttribute("fill", "none");
    path.setAttribute("stroke-width", "3");
    path.setAttribute("stroke-dasharray", "8 10");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("opacity", "0.9");

    // Color per step
    const colors = ["#F5C542", "#E54C9A", "#7C6BFF"];
    path.setAttribute("stroke", colors[i] || "#fff");

    svg.appendChild(path);
  });
}

// Initial draw
drawConnectors();

// Recalculate on scroll + resize
window.addEventListener("scroll", drawConnectors);
window.addEventListener("resize", drawConnectors);
