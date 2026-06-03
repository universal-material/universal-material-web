---
description: Add a top app bar to a screen — small/medium/large sizes, leading and trailing icons, scroll-driven collapse.
---

# Top app bar

`<u-top-app-bar>` is the Material 3 top app bar: persistent strip at the top of a screen with headline, leading icon (menu/back), and trailing actions.

## Basic small bar

```html
<u-top-app-bar headline="Inbox">
  <u-icon-button slot="leading-icon">
    <span class="material-symbols-outlined">menu</span>
  </u-icon-button>
  <u-icon-button slot="trailing-icon">
    <span class="material-symbols-outlined">search</span>
  </u-icon-button>
</u-top-app-bar>
```

## Size variants

```html
<u-top-app-bar size="small"  headline="Small"></u-top-app-bar>
<u-top-app-bar size="medium" headline="Medium"></u-top-app-bar>
<u-top-app-bar size="large"  headline="Large"></u-top-app-bar>
```

- `small` (64dp) — default.
- `medium` (112dp) and `large` (152dp) — render an "extended" headline area that fades out as the user scrolls.

## Positioning

| Mode | Anchored to | When to use |
| --- | --- | --- |
| `fixed` (default) | Viewport top. Slides with `--u-app-bar-offset` when a `u-side-navigation` drawer opens. | Standalone pages, side-navigation layouts. |
| `absolute` | Nearest positioned ancestor. | Inside a `u-scaffold` (auto-set), or any custom container. |
| `static` | In-flow, no special positioning. | Rare — when the bar should scroll with content. |

Inside a `<u-scaffold>` the scaffold flips `position` to `absolute` automatically and feeds the bar its scroll container via context, so the scroll-driven collapse works without manual wiring.

## Scroll-driven collapse

For `medium`/`large` bars, the extended headline fades out as the user scrolls past it. The bar finds its scroll target in this order:

1. Explicit `scrollContainer` attribute (`HTMLElement`, element id, `"window"`, or `"none"` to disable).
2. The scroll container provided by an ancestor `<u-scaffold>` via Lit context.
3. `window` (default).

## Customizing colors

```css
u-top-app-bar {
  --u-top-app-bar-container-color: var(--u-color-surface);
  --u-top-app-bar-on-scroll-container-color: var(--u-color-surface-container);
  --u-top-app-bar-text-color: var(--u-color-on-surface);
}
```

## Caveats

- Don't put the headline inside the `leading-icon` / `trailing-icon` slots — those are reserved for `<u-icon-button>`s. Use the `headline` attribute or the default slot.
- When inside `<u-scaffold>`, do **not** set `position="fixed"` — the scaffold's container clips the bar to itself, and fixed-to-viewport would escape the layout.
