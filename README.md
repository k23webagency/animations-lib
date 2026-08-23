# Animaster — библиотека scroll-анимаций

Личная библиотека анимаций на GSAP + ScrollTrigger + SplitType + Lenis + Matter.js,
управляемая через `data-*` атрибуты — без написания JS под каждый эффект.

Полная документация по всем 84 эффектам и API — в отдельном каталоге `docs/` проекта
(см. `api-reference.md`, `effects/*.md`, `style-reference.md`).

## Состав репозитория

- **`animations.js`** — сама библиотека. Ничего не запускает сама по себе,
  только объявляет `initAnimations()` и `initPhysics()`. Подключается по ссылке
  (jsDelivr), не копируется руками.
- **`animations.css`** — обязательный спутник `animations.js`. Часть эффектов создаёт
  элементы через JS и стилизует их инлайново (самодостаточны), но два эффекта опираются
  на внешний CSS-класс: `data-hover-reveal` (плавающая за курсором картинка) и
  `data-animate="typewriter"` (мигающий курсор). Без этого файла эти два эффекта
  будут работать "сломанно" — картинка появится нестилизованным блобом на весь экран
  вместо анимированного превью у курсора. Подключается так же по ссылке.
- **`webflow-embed.html`** — то же самое, что в блоке ниже, отдельным файлом (на случай,
  если удобнее скопировать из файла, а не из README).

## Подключение в Webflow — через виджет Embed

Два виджета **Embed** (Add panel → Embed, `</>`), оба вставляются руками, копипастой.

### Виджет 1 — в самый верх страницы (первый элемент в body)

Прячет анимированные элементы до полной инициализации, чтобы не было вспышки
неанимированного контента. Можно положить в глобальный Navbar-компонент, чтобы
не повторять на каждой странице.

```html
<script>document.documentElement.classList.add('js-loading');</script>
<style>
  html.js-loading [data-animate] { opacity: 0 !important; visibility: hidden !important; }
</style>
```

Без этого виджета всё будет работать, просто иногда будет короткий визуальный
дёрг перед анимацией — не критично, можно пропустить для скорости.

### Виджет 2 — в самый низ страницы (последний элемент в body, например в глобальном Footer-компоненте)

CDN-подключения + ссылка на библиотеку + обрезанный `main.js` (инициализация
Lenis/ScrollTrigger и вызов `initAnimations()`/`initPhysics()`) — копировать
весь блок целиком:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/split-type"></script>
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"></script>

<!-- Библиотека анимаций (версия зафиксирована тегом релиза) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/k23webagency/animations-lib@v1.0.0/animations.css">
<script src="https://cdn.jsdelivr.net/gh/k23webagency/animations-lib@v1.0.0/animations.js"></script>

<script>
(function () {
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

  gsap.registerPlugin(ScrollTrigger);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  window.addEventListener('load', () => {
    document.documentElement.classList.remove('js-loading');

    if (typeof initAnimations === 'function') {
      initAnimations();
    }

    if (typeof initPhysics === 'function' && document.querySelector('.physics-container')) {
      initPhysics();
    }

    // --- Custom Cursor (опционально, удалите блок если не нужен в проекте) ---
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

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  });
})();
</script>
```

Если в проекте нет Matter.js-физики или SplitType-текстов — соответствующие
CDN-теги внутри можно удалить, `animations.js` проверяет их наличие перед использованием.
Блок Custom Cursor тоже можно удалить, если курсор в проекте не нужен.

### 3. Сами эффекты — без кода

В Webflow Designer: элемент → Settings (⚙) → **Custom Attributes** →
`data-animate` = `fade-up` (или любое другое значение из `docs/api-reference.md`).

## Версионирование

- `@v1.0.0` (или другой тег) в jsDelivr-ссылке — зафиксированная версия, безопасно для прода.
- `@main` — всегда последняя версия из ветки main (после пуша jsDelivr кэширует
  до ~7 дней, форсировать обновление: `https://purge.jsdelivr.net/gh/USERNAME/REPO@main/animations.js`).

При выпуске новой версии: закоммитить изменения в `animations.js`, поставить новый тег
(`git tag vX.Y.Z && git push --tags`), обновить ссылку в проектах, где нужно обновление.
