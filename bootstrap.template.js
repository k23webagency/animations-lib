// ===================================================================
// ANIMASTER — Bootstrap (Embed Code)
// Это НЕ часть библиотеки animations.js — это шаблон, который
// вставляется отдельно в каждый проект (embed code) и может
// редактироваться под конкретный проект.
//
// Что вырезано по сравнению с оригинальным main.js каталога:
//  - progress-bar (#progress-bar)      — было спецификой каталога-документации
//  - scrollspy-навигация (.scrollspy-nav) — было спецификой каталога-документации
//
// Блок Custom Cursor оставлен, но он полностью опционален:
// если на странице нет #custom-cursor, блок просто ничего не делает.
// Смело удаляйте его, если в проекте нет кастомного курсора.
// ===================================================================

// --- Плавный скролл (Lenis) ---
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// --- Связка Lenis + ScrollTrigger ---
gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

window.addEventListener('load', () => {
  // Снимаем блокировку FOUC (требует также <script> в <head>,
  // который ставит класс js-loading ДО рендера — см. README)
  document.documentElement.classList.remove('js-loading');

  // Запуск анимаций из animations.js
  if (typeof initAnimations === 'function') {
    initAnimations();
  }

  // Запуск физики (Matter.js), если на странице есть .physics-container
  if (typeof initPhysics === 'function' && document.querySelector('.physics-container')) {
    initPhysics();
  }

  // --- Custom Cursor (опционально, удалите если не нужен в проекте) ---
  const cursor = document.getElementById('custom-cursor');
  const cursorText = cursor ? cursor.querySelector('.cursor-text') : null;

  if (cursor) {
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    let xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3" }),
        yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3" });

    window.addEventListener('mousemove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });

    document.querySelectorAll('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        const text = el.getAttribute('data-cursor');
        if (cursorText) cursorText.textContent = text;
        cursor.classList.add('active');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        if (cursorText) cursorText.textContent = '';
      });
    });
  }

  // Пересчёт ScrollTrigger после полной загрузки (важно для SplitType и Pin)
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);
});
