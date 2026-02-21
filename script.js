import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion =
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initGlobalAnimations() {
  if (prefersReducedMotion) return;

  gsap.from(".skill-card", {
    duration: 0.5,
    opacity: 0,
    y: 30,
    stagger: 0.12,
    ease: "power1.out",
    scrollTrigger: {
      trigger: ".skills-grid",
      start: "top 85%",
    },
  });

  gsap.from(".hero-title", { duration: 0.8, opacity: 0, y: -18, ease: "power2.out" });
  gsap.from(".hero-subtitle", {
    duration: 0.8,
    delay: 0.15,
    opacity: 0,
    y: -10,
    ease: "power2.out",
  });
}

// ---------- helpers (dots / autoplay / swipe) ----------
function createDots(dotsEl, count, onSelect) {
  if (!dotsEl) return [];
  dotsEl.innerHTML = "";
  const dots = [];

  for (let i = 0; i < count; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "dot";
    btn.setAttribute("aria-label", `Ir para o slide ${i + 1}`);
    btn.addEventListener("click", () => onSelect(i));
    dotsEl.appendChild(btn);
    dots.push(btn);
  }

  return dots;
}

function setActiveDot(dots, index) {
  if (!dots || dots.length === 0) return;
  dots.forEach((d) => d.classList.remove("active"));
  if (dots[index]) dots[index].classList.add("active");
}

function attachSwipe(container, onPrev, onNext) {
  if (!container) return;

  let startX = 0;
  let startY = 0;
  let isDown = false;

  const threshold = 40;

  container.addEventListener(
    "touchstart",
    (e) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      isDown = true;
    },
    { passive: true }
  );

  container.addEventListener(
    "touchend",
    (e) => {
      if (!isDown) return;
      isDown = false;

      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      // evita conflito com scroll vertical
      if (Math.abs(dy) > Math.abs(dx)) return;

      if (dx > threshold) onPrev();
      else if (dx < -threshold) onNext();
    },
    { passive: true }
  );
}

function makeAutoplay({ container, next, intervalMs = 6500 }) {
  if (!container || prefersReducedMotion) return { stop() {}, start() {} };

  let timer = null;

  const start = () => {
    stop();
    timer = window.setInterval(() => next(), intervalMs);
  };

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
  };

  // pausa quando usuário interage
  container.addEventListener("mouseenter", stop);
  container.addEventListener("mouseleave", start);
  container.addEventListener("focusin", stop);
  container.addEventListener("focusout", start);
  container.addEventListener("touchstart", stop, { passive: true });
  container.addEventListener("touchend", start, { passive: true });

  return { start, stop };
}

// ---------- App Carousel ----------
let appSlides = [];
let currentAppSlide = 0;
let appDots = [];

const appSlidesContainer = document.querySelector(".app-carousel-slides");
const prevAppButton = document.getElementById("prev-slide");
const nextAppButton = document.getElementById("next-slide");
const appCarouselContainer = document.querySelector(".app-carousel-container");
const appDotsEl = document.getElementById("app-dots");

function showAppSlide(index) {
  if (!appSlides || appSlides.length === 0) return;

  appSlides.forEach((slide) => slide.classList.remove("active"));

  if (index >= appSlides.length) currentAppSlide = 0;
  else if (index < 0) currentAppSlide = appSlides.length - 1;
  else currentAppSlide = index;

  appSlides[currentAppSlide].classList.add("active");
  setActiveDot(appDots, currentAppSlide);
}

function initAppCarousel() {
  appSlides = appSlidesContainer.querySelectorAll(".app-slide");

  if (appSlides.length > 0) {
    nextAppButton?.addEventListener("click", () => showAppSlide(currentAppSlide + 1));
    prevAppButton?.addEventListener("click", () => showAppSlide(currentAppSlide - 1));

    appDots = createDots(appDotsEl, appSlides.length, (i) => showAppSlide(i));
    showAppSlide(0);

    attachSwipe(
      appCarouselContainer,
      () => showAppSlide(currentAppSlide - 1),
      () => showAppSlide(currentAppSlide + 1)
    );

    const autoplay = makeAutoplay({
      container: appCarouselContainer,
      next: () => showAppSlide(currentAppSlide + 1),
      intervalMs: 6500,
    });
    autoplay.start();

    if (!prefersReducedMotion) {
      gsap.from(appCarouselContainer, {
        duration: 0.8,
        opacity: 0,
        y: 50,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#aplicativo",
          start: "top 75%",
        },
      });
    }
  } else {
    appSlidesContainer.innerHTML =
      '<p style="color: var(--vermelho); text-align: center;">Erro ao carregar slides do aplicativo.</p>';
  }
}

// ---------- Web Carousel ----------
let webSlides = [];
let currentWebSlide = 0;
let webDots = [];

const webSlidesContainer = document.querySelector(".web-carousel-slides");
const prevWebButton = document.getElementById("prev-web-slide");
const nextWebButton = document.getElementById("next-web-slide");
const webCarouselContainer = document.querySelector(".web-carousel-container");
const webDotsEl = document.getElementById("web-dots");

function showWebSlide(index) {
  if (!webSlides || webSlides.length === 0) return;

  webSlides.forEach((slide) => slide.classList.remove("active"));

  if (index >= webSlides.length) currentWebSlide = 0;
  else if (index < 0) currentWebSlide = webSlides.length - 1;
  else currentWebSlide = index;

  webSlides[currentWebSlide].classList.add("active");
  setActiveDot(webDots, currentWebSlide);
}

function initWebCarousel() {
  webSlides = webSlidesContainer.querySelectorAll(".web-slide");

  if (webSlides.length > 0) {
    nextWebButton?.addEventListener("click", () => showWebSlide(currentWebSlide + 1));
    prevWebButton?.addEventListener("click", () => showWebSlide(currentWebSlide - 1));

    webDots = createDots(webDotsEl, webSlides.length, (i) => showWebSlide(i));
    showWebSlide(0);

    attachSwipe(
      webCarouselContainer,
      () => showWebSlide(currentWebSlide - 1),
      () => showWebSlide(currentWebSlide + 1)
    );

    const autoplay = makeAutoplay({
      container: webCarouselContainer,
      next: () => showWebSlide(currentWebSlide + 1),
      intervalMs: 7000,
    });
    autoplay.start();

    if (!prefersReducedMotion) {
      gsap.from(webCarouselContainer, {
        duration: 0.8,
        opacity: 0,
        y: 50,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#aplicativo-web",
          start: "top 75%",
        },
      });
    }
  } else {
    webSlidesContainer.innerHTML =
      '<p style="color: var(--vermelho); text-align: center;">Erro ao carregar slides da web.</p>';
  }
}

// ---------- Content Loading ----------
async function loadCarouselContent() {
  try {
    const [appRes, webRes] = await Promise.all([
      fetch("app-carousel-content.html"),
      fetch("web-carousel-content.html"),
    ]);

    if (!appRes.ok || !webRes.ok) {
      throw new Error(`HTTP error! status: App ${appRes.status}, Web ${webRes.status}`);
    }

    const [appHtml, webHtml] = await Promise.all([appRes.text(), webRes.text()]);

    appSlidesContainer.innerHTML = appHtml;
    webSlidesContainer.innerHTML = webHtml;

    return true;
  } catch (error) {
    if (appSlidesContainer)
      appSlidesContainer.innerHTML = `<p style="color: var(--vermelho); text-align: center;">Falha ao carregar conteúdo do app: ${error.message}</p>`;
    if (webSlidesContainer)
      webSlidesContainer.innerHTML = `<p style="color: var(--vermelho); text-align: center;">Falha ao carregar conteúdo da web: ${error.message}</p>`;
    return false;
  }
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", async () => {
  initGlobalAnimations();

  const contentLoaded = await loadCarouselContent();
  if (contentLoaded) {
    initAppCarousel();
    initWebCarousel();
  }
});