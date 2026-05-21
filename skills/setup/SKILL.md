---
description: Set up @universal-material/web in an app — install the package, import components, wire the Material Symbols font, and the optional CSS reset.
---

# Setting up @universal-material/web

Use this whenever the user is bootstrapping a project (adding a new app, scaffolding a page from scratch) and hasn't yet imported the library.

## 1. Install

```bash
npm install @universal-material/web
```

## 2. Import the components you need

A single side-effect import registers every custom element and exposes the imperative APIs (`ThemeBuilder`, `Snackbar`, `Dialog`):

```ts
import '@universal-material/web';
```

For tree-shaken builds, import the components individually:

```ts
import '@universal-material/web/button/button.js';
import '@universal-material/web/dialog/dialog.js';
```

## 3. Add the Material Symbols font

All icons (`<span class="material-symbols-outlined">…</span>`) require the Google Material Symbols font in the document head:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0" />
```

Add a system font (Roboto recommended) for the components themselves:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700&display=swap" />
```

## 4. Optional CSS reset / typography helpers

The library ships an opinionated stylesheet with utility classes (`u-headline-l`, `u-label-m`, `u-container`, `u-grid`, etc.):

```html
<link rel="stylesheet" href="node_modules/@universal-material/web/css/universal-material.min.css" />
```

You can also `@import` the SCSS sources from `node_modules/@universal-material/web/scss/universal-material.scss` to opt into theme tokens at build time.

## Caveats

- Custom elements must be defined before they appear in HTML. If you parse HTML before the JS bundle loads, elements upgrade afterwards (Lit handles this gracefully, but property assignments before upgrade are not reactive).
- The library uses Lit context. **Provider components must register before their consumers** — `import '@universal-material/web'` already orders them correctly; if you cherry-pick imports, register `scaffold` before `top-app-bar`/`fab`.
- For the `<input type="date">` mask handling and `<dialog>` ergonomics, modern Chromium/Safari/Firefox are required.
