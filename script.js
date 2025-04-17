import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function initGlobalAnimations() {
    gsap.from(".skill-card", {
        duration: 0.5,
        opacity: 0,
        y: 30,
        stagger: 0.2,
        ease: "power1.out",
        scrollTrigger: {
            trigger: ".skills-grid",
            start: "top 80%",
        }
    });

    gsap.from("header h1", { duration: 0.8, opacity: 0, y: -20, ease: "power2.out" });
    gsap.from("header p", { duration: 0.8, delay: 0.2, opacity: 0, y: -10, ease: "power2.out" });

    console.log("Global animations initialized!");
}

// --- App Carousel Logic ---
let appSlides = [];
let currentAppSlide = 0;
const appSlidesContainer = document.querySelector('.app-carousel-slides');
const prevAppButton = document.getElementById('prev-slide');
const nextAppButton = document.getElementById('next-slide');
const appCarouselContainer = document.querySelector('.app-carousel-container');

function showAppSlide(index) {
    if (!appSlides || appSlides.length === 0) return;

    appSlides.forEach(slide => slide.classList.remove('active'));

    if (index >= appSlides.length) {
        currentAppSlide = 0;
    } else if (index < 0) {
        currentAppSlide = appSlides.length - 1;
    } else {
        currentAppSlide = index;
    }

    appSlides[currentAppSlide].classList.add('active');
}

function initAppCarousel() {
    appSlides = appSlidesContainer.querySelectorAll('.app-slide');
    if (appSlides.length > 0) {
        nextAppButton.addEventListener('click', () => showAppSlide(currentAppSlide + 1));
        prevAppButton.addEventListener('click', () => showAppSlide(currentAppSlide - 1));
        showAppSlide(0);
        console.log("App carousel initialized!");

        gsap.from(appCarouselContainer, {
            duration: 0.8,
            opacity: 0,
            y: 50,
            ease: "power2.out",
            scrollTrigger: {
                trigger: "#aplicativo",
                start: "top 70%",
            }
        });
    } else {
        console.error("No app slides found after loading.");
        appSlidesContainer.innerHTML = '<p style="color: var(--vermelho); text-align: center;">Erro ao carregar slides do aplicativo.</p>';
    }
}

let webSlides = [];
let currentWebSlide = 0;
const webSlidesContainer = document.querySelector('.web-carousel-slides');
const prevWebButton = document.getElementById('prev-web-slide');
const nextWebButton = document.getElementById('next-web-slide');
const webCarouselContainer = document.querySelector('.web-carousel-container');

function showWebSlide(index) {
    if (!webSlides || webSlides.length === 0) return; // Guard clause

    webSlides.forEach(slide => slide.classList.remove('active'));

    if (index >= webSlides.length) {
        currentWebSlide = 0;
    } else if (index < 0) {
        currentWebSlide = webSlides.length - 1;
    } else {
        currentWebSlide = index;
    }
    webSlides[currentWebSlide].classList.add('active');
}

function initWebCarousel() {
    webSlides = webSlidesContainer.querySelectorAll('.web-slide');
    if (webSlides.length > 0) {
        nextWebButton.addEventListener('click', () => showWebSlide(currentWebSlide + 1));
        prevWebButton.addEventListener('click', () => showWebSlide(currentWebSlide - 1));
        showWebSlide(0);
        console.log("Web carousel initialized!");
        gsap.from(webCarouselContainer, {
            duration: 0.8,
            opacity: 0,
            y: 50,
            ease: "power2.out",
            scrollTrigger: {
                trigger: "#aplicativo-web",
                start: "top 70%",
            }
        });
    } else {
        console.error("No web slides found after loading.");
        webSlidesContainer.innerHTML = '<p style="color: var(--vermelho); text-align: center;">Erro ao carregar slides da web.</p>';
    }
}

// --- Content Loading ---
async function loadCarouselContent() {
    try {
        const [appRes, webRes] = await Promise.all([
            fetch('app-carousel-content.html'),
            fetch('web-carousel-content.html')
        ]);

        if (!appRes.ok || !webRes.ok) {
            throw new Error(`HTTP error! status: App ${appRes.status}, Web ${webRes.status}`);
        }

        const [appHtml, webHtml] = await Promise.all([
            appRes.text(),
            webRes.text()
        ]);

        appSlidesContainer.innerHTML = appHtml;
        webSlidesContainer.innerHTML = webHtml;

        console.log("Carousel content loaded successfully!");
        return true; // Indicate success

    } catch (error) {
        console.error("Failed to load carousel content:", error);
        // Optionally display error messages in the containers
        if (appSlidesContainer) appSlidesContainer.innerHTML = `<p style="color: var(--vermelho); text-align: center;">Falha ao carregar conteúdo do app: ${error.message}</p>`;
        if (webSlidesContainer) webSlidesContainer.innerHTML = `<p style="color: var(--vermelho); text-align: center;">Falha ao carregar conteúdo da web: ${error.message}</p>`;
        return false; // Indicate failure
    }
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
    initGlobalAnimations(); // Run animations that don't depend on fetched content

    const contentLoaded = await loadCarouselContent();

    if (contentLoaded) {
        // Initialize components that depend on the fetched content
        initAppCarousel();
        initWebCarousel();
    }

    console.log("Portfólio interativo carregado!");
});