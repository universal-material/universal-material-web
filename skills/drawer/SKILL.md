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
      <span slot="badge">12</span>
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
- `badge` — trailing badge **content** (plain text in a `<span slot="badge">`, e.g. a count). The drawer item styles this itself — it pins the content to the trailing edge inline with the row.

**Don't put a `<u-badge>` in the `badge` slot.** `<u-badge>` is the *floating* badge used to dot the corner of an icon (notification bell, rail item); it's `position: absolute`. Dropped into a drawer item's inline `badge` slot it floats out of place instead of sitting at the row's trailing edge. Pass the value as a `<span slot="badge">12</span>` — the drawer item provides the badge treatment. (Note this differs from `<u-navigation-rail-item>`, whose collapsed state *does* take a `<u-badge>` because the badge floats over the icon there.)

Attributes:
- `active` — highlights the item with the secondary-container pill (M3 active state).
- `href` / `target` — renders as a link instead of a button.
- `keep-drawer-open` — by default, clicking an item auto-closes the drawer on mobile; set this to disable.

## Routing

For framework routing, set `routerLink` (Angular) / `to` (Vue Router) / `href` on the item and let the framework's link directive handle navigation; the drawer item still emits a click and auto-closes the drawer.

## Sections

Group items with `<u-drawer-headline>` between them. The headline renders a small label-style title above its section.

## Background — and the trap when slotting a drawer into a pane

`<u-drawer>` paints its own background, and that color is **breakpoint-dependent**:
- below `lg`: `--u-modal-drawer-bg-color` (default `surface-container-low`) — the modal drawer surface;
- at `lg`+: `--u-standard-drawer-bg-color` (default `surface` / body) — a *standard* permanent drawer is meant to read as part of the page background, so it deliberately matches `surface`.

That default is correct for a drawer used directly inside `<u-side-navigation>`. **But if you slot a `<u-drawer>` into a `<u-pane variant="filled">` (e.g. a settings section-nav in a list-detail), the drawer's surface paints over the pane's filled background.** The visible bug: the nav column shows a background at small/medium widths, then goes flat/background-less on desktop — because at `lg`+ the drawer flips to `surface` (= the scaffold body) and erases the pane's fill. It looks like the pane "lost its background"; really the drawer is painting on top with body color.

Fix it at the drawer: when the pane is the surface, make the drawer transparent so the pane shows through at every breakpoint.

```html
<u-pane variant="filled" style="--u-modal-drawer-bg-color: transparent; --u-standard-drawer-bg-color: transparent;">
  <u-drawer>…</u-drawer>
</u-pane>
```

(The two custom properties are inherited, so setting them on the pane reaches the drawer.) Don't try to fix it by raising the *pane's* `--u-pane-filled-bg-color` — the drawer still paints over it on desktop, so the column stays flat.

## Caveats

- The drawer is a sibling of the page content inside `<u-side-navigation>`, not a child of the top bar. Don't nest it under the bar.
- On wide viewports the drawer is permanent; the toggle button still works but the drawer never closes. Use `keep-drawer-open` on items you'd otherwise want auto-closing only on mobile — it's safe either way.
