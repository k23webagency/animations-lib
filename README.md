# Animaster — библиотека scroll-анимаций

Личная библиотека анимаций на GSAP + ScrollTrigger + SplitType + Lenis + Matter.js,
управляемая через `data-*` атрибуты — без написания JS под каждый эффект.

Полная документация по всем 84 эффектам и API — в отдельном каталоге `docs/` проекта
(см. `api-reference.md`, `effects/*.md`, `style-reference.md`).

## Состав репозитория

- **`animations.js`** — сама библиотека. Ничего не запускает сама по себе,
  только объявляет `initAnimations()` и `initPhysics()`.
- **`bootstrap.template.js`** — НЕ часть библиотеки. Шаблон embed-кода,
  который инициализирует Lenis/ScrollTrigger и вызывает `initAnimations()`/`initPhysics()`.
  Копируется в конкретный проект и может редактироваться под его нужды
  (например, безопасно удалить блок Custom Cursor, если он не нужен).

## Подключение (например, в Webflow — Custom Code)

Порядок скриптов важен.

### 1. Head code (до всех остальных скриптов)

Предотвращает вспышку неанимированного контента (FOUC) — прячет элементы
с `[data-animate]` до полной инициализации:

```html
<script>document.documentElement.classList.add('js-loading');</script>
<style>
  html.js-loading [data-animate] { opacity: 0 !important; visibility: hidden !important; }
</style>
```

### 2. Footer code (перед `</body>`)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/split-type"></script>
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"></script>

<!-- Библиотека анимаций — версия зафиксирована тегом релиза -->
<script src="https://cdn.jsdelivr.net/gh/USERNAME/REPO@v1.0.0/animations.js"></script>

<!-- Bootstrap: вставить содержимое bootstrap.template.js (адаптированное под проект) -->
<script>
  /* ...содержимое bootstrap.template.js... */
</script>
```

Если в проекте нет Matter.js-физики или SplitType-текстов — соответствующие
CDN-теги можно не подключать, `animations.js` проверяет их наличие перед использованием.

### 3. Сами эффекты — без кода

В Webflow Designer: элемент → Settings (⚙) → **Custom Attributes** →
`data-animate` = `fade-up` (или любое другое значение из `docs/api-reference.md`).

## Версионирование

- `@v1.0.0` (или другой тег) в jsDelivr-ссылке — зафиксированная версия, безопасно для прода.
- `@main` — всегда последняя версия из ветки main (после пуша jsDelivr кэширует
  до ~7 дней, форсировать обновление: `https://purge.jsdelivr.net/gh/USERNAME/REPO@main/animations.js`).

При выпуске новой версии: закоммитить изменения в `animations.js`, поставить новый тег
(`git tag vX.Y.Z && git push --tags`), обновить ссылку в проектах, где нужно обновление.
