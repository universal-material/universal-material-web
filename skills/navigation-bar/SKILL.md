---
description: Build a Material 3 navigation bar — destinations with icon + label, vertical or horizontal layout, active indicator pill.
---

# Navigation bar

`<u-navigation-bar>` hosts 3–5 top-level destinations at the bottom of a screen. Use `<u-navigation-bar-item>` for each destination — they render the active indicator pill, icon, and label per M3 expressive tokens.

## Default (vertical) layout

```html
<u-navigation-bar>
  <u-navigation-bar-item active>
    <span class="material-symbols-outlined" slot="icon">home</span>
    Home
  </u-navigation-bar-item>
  <u-navigation-bar-item>
    <span class="material-symbols-outlined" slot="icon">explore</span>
    Browse
  </u-navigation-bar-item>
  <u-navigation-bar-item>
    <span class="material-symbols-outlined" slot="icon">radio</span>
    Radio
  </u-navigation-bar-item>
  <u-navigation-bar-item>
    <span class="material-symbols-outlined" slot="icon">library_music</span>
    Library
  </u-navigation-bar-item>
</u-navigation-bar>
```

M3 tokens applied automatically:
- container: 64dp height, `surface-container` color, level-2 elevation
- active indicator pill: 56×32dp, `secondary-container`
- icon: 24dp, `on-secondary-container` (active) / `on-surface-variant` (inactive)
- label: label-medium, `secondary` (active) / `on-surface-variant` (inactive)

## Horizontal variant

For wider items where icon and label sit side-by-side inside a 40dp pill:

```html
<u-navigation-bar>
  <u-navigation-bar-item variant="horizontal" active>
    <span class="material-symbols-outlined" slot="icon">home</span>
    Home
  </u-navigation-bar-item>
  <u-navigation-bar-item variant="horizontal">
    <span class="material-symbols-outlined" slot="icon">explore</span>
    Browse
  </u-navigation-bar-item>
</u-navigation-bar>
```

## Slots on `<u-navigation-bar-item>`

| Slot | Content |
| --- | --- |
| default | Destination label (text). |
| `icon` | 24dp icon (`<span class="material-symbols-outlined">…</span>`). |
| `badge` | Optional `<u-badge>` — auto-positions over the icon. |

## Tracking selection

```html
<u-navigation-bar id="nav">…</u-navigation-bar>

<script>
  const nav = document.getElementById('nav');
  nav.addEventListener('click', (e) => {
    const item = e.target.closest('u-navigation-bar-item');
    if (!item) return;
    [...nav.children].forEach(i => i.active = i === item);
  });
</script>
```

In Angular/React, bind `[active]="route === 'home'"` on each item and switch the route on click.

## Positioning

Same model as `<u-top-app-bar>`: `position="fixed"` by default (viewport bottom), or `position="absolute"` when slotted in a `<u-scaffold>` (auto-set). The internal `.spacing` filler reserves the bar's height in the scrolled flow so content isn't obscured.

## Caveats

- Each item should have an icon AND a label per M3 spec; icon-only items look broken at 64dp.
- Don't use `<u-icon-button>` instead of `<u-navigation-bar-item>` — you'll lose the active indicator pill, label, and badge slot.
