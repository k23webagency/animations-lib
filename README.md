# Animaster — библиотека scroll-анимаций

Личная библиотека анимаций на GSAP + ScrollTrigger + SplitType + Lenis + Matter.js,
управляемая через `data-*` атрибуты — без написания JS под каждый эффект.

Полная документация по всем 84 эффектам и API — в отдельном каталоге `docs/` проекта
(см. `api-reference.md`, `effects/*.md`, `style-reference.md`).

## Состав репозитория

- **`animations.js`** — сама библиотека. Ничего не запускает сама по себе,
  только объявляет `initAnimations()` и `initPhysics()`. Подключается по ссылке
  (jsDelivr), не копируется руками.
- **`webflow-embed.html`** — НЕ часть библиотеки. Готовый embed-код для конкретного
  проекта: CDN-подключения (GSAP, ScrollTrigger, SplitType, Lenis, Matter.js) +
  ссылка на `animations.js` + обрезанный `main.js` (инициализация Lenis/ScrollTrigger
  и вызов `initAnimations()`/`initPhysics()`). Копируется в проект целиком и может
  редактироваться под его нужды (например, безопасно удалить блок Custom Cursor,
  если он не нужен).

## Подключение (например, в Webflow)

### 1. Head code — одна маленькая вставка отдельно (важно!)

Это единственное, что технически не может быть частью общего embed-кода:
скрипт должен выполниться ДО рендера страницы, а `webflow-embed.html` вставляется
в конце (перед `</body>`) и к этому моменту будет уже поздно. Без этой вставки
ничего не сломается функционально — но будет короткая вспышка неанимированного
контента (элементы на миг покажутся в конечном виде, потом дёрнутся в анимацию).

Project Settings → Custom Code → **Head Code**:

```html
<script>document.documentElement.classList.add('js-loading');</script>
<style>
  html.js-loading [data-animate] { opacity: 0 !important; visibility: hidden !important; }
</style>
```

### 2. Всё остальное — один embed на проект

Содержимое `webflow-embed.html` вставляется целиком одним куском:
Project Settings → Custom Code → **Footer Code** (Before `</body>` tag).

Если в проекте нет Matter.js-физики или SplitType-текстов — соответствующие
CDN-теги внутри можно удалить, `animations.js` проверяет их наличие перед использованием.

### 3. Сами эффекты — без кода

В Webflow Designer: элемент → Settings (⚙) → **Custom Attributes** →
`data-animate` = `fade-up` (или любое другое значение из `docs/api-reference.md`).

## Версионирование

- `@v1.0.0` (или другой тег) в jsDelivr-ссылке — зафиксированная версия, безопасно для прода.
- `@main` — всегда последняя версия из ветки main (после пуша jsDelivr кэширует
  до ~7 дней, форсировать обновление: `https://purge.jsdelivr.net/gh/USERNAME/REPO@main/animations.js`).

При выпуске новой версии: закоммитить изменения в `animations.js`, поставить новый тег
(`git tag vX.Y.Z && git push --tags`), обновить ссылку в проектах, где нужно обновление.
