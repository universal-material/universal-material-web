---
description: Add a side navigation drawer to an app — sections with headlines, drawer items with icons and badges, toggleable on mobile.
---

# Side navigation drawer

`<u-side-navigation>` wraps a page with a left-side drawer (`<u-drawer>`) that toggles open/closed. Inside the drawer, group items with `<u-drawer-headline>` and use `<u-drawer-item>` for each link.

## Basic usage

```html
<u-side-navigation #nav>
  <u-top-app-bar headline="My app">
    <u-icon-button slot="leading-icon" type="button"
      (click)="nav.toggleDrawer = !nav.toggleDrawer">
      <span class="material-symbols-outlined">menu</span>
    </u-icon-button>
  </u-top-app-bar>

  <u-drawer slot="drawer">
    <u-drawer-headline>Library</u-drawer-headline>
    <u-drawer-item active>
      <span class="material-symbols-outlined" slot="icon">home</span>
      Home
    </u-drawer-item>
    <u-drawer-item>
      <span class="material-symbols-outlined" slot="icon">favorite</span>
      Favorites
      <u-badge slot="badge">12</u-badge>
    </u-drawer-item>

    <u-drawer-headline>Account</u-drawer-headline>
    <u-drawer-item>
      <span class="material-symbols-outlined" slot="icon">settings</span>
      Settings
    </u-drawer-item>
  </u-drawer>

  <!-- the main page content goes here as light DOM -->
  <div class="u-container">
    Page body
  </div>
</u-side-navigation>
```

The side-navigation:
- responsively shows the drawer permanently on wide viewports and toggles it as an overlay on narrow ones,
- sets `--u-app-bar-offset` so the slotted top app bar slides with the drawer,
- exposes `.toggleDrawer` (boolean) for programmatic control.

## Drawer items

`<u-drawer-item>` slots:
- default — the label,
- `icon` — leading icon (24dp),
- `badge` — trailing `<u-badge>`.

Attributes:
- `active` — highlights the item with the secondary-container pill (M3 active state).
- `href` / `target` — renders as a link instead of a button.
- `keep-drawer-open` — by default, clicking an item auto-closes the drawer on mobile; set this to disable.

## Routing

For framework routing, set `routerLink` (Angular) / `to` (Vue Router) / `href` on the item and let the framework's link directive handle navigation; the drawer item still emits a click and auto-closes the drawer.

## Sections

Group items with `<u-drawer-headline>` between them. The headline renders a small label-style title above its section.

## Caveats

- The drawer is a sibling of the page content inside `<u-side-navigation>`, not a child of the top bar. Don't nest it under the bar.
- On wide viewports the drawer is permanent; the toggle button still works but the drawer never closes. Use `keep-drawer-open` on items you'd otherwise want auto-closing only on mobile — it's safe either way.
