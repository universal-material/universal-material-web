---
description: Lay out an app screen with u-scaffold — top app bar, flex-row body that accepts plain content and any number of u-pane children, an optional navigation bar at the bottom, and a FAB anchored above the bar. Panes behave per a mode attribute (fixed / collapsible / sidebar / fullscreen) that can vary by Material 3 breakpoint.
---

# Scaffold (page layout)

`<u-scaffold>` is a layout container that hosts a top app bar, a flex-row body, an optional navigation bar and a floating FAB. The body accepts plain content and any number of `<u-pane>` children as siblings — panes are flex items in DOM order; non-pane children flex to fill the remaining space.

## Basic usage

```html
<u-scaffold style="height: 100vh">
  <u-top-app-bar slot="top-bar" size="large" headline="Inbox">
    <u-icon-button slot="leading-icon">
      <span class="material-symbols-outlined">menu</span>
    </u-icon-button>
  </u-top-app-bar>

  <main style="padding: 16px 24px; overflow: auto">
    <!-- scrollable page content -->
  </main>

  <u-navigation-bar slot="bottom-bar">
    <u-navigation-bar-item active>
      <span class="material-symbols-outlined" slot="icon">inbox</span>
      Inbox
    </u-navigation-bar-item>
  </u-navigation-bar>

  <u-fab slot="fab" color="primary">
    <span class="material-symbols-outlined">edit</span>
  </u-fab>
</u-scaffold>
```

The scaffold:
- arranges panes and non-pane content in a flex row with a 16dp gap,
- auto-sets `position="absolute"` on slotted `<u-top-app-bar>` / `<u-navigation-bar>` so they anchor against the scaffold (not the viewport),
- measures the navigation bar's height and offsets the FAB above it (16dp gap per M3),
- writes `data-align="start|end"` on each `<u-pane>` child based on whether it appears before or after the first non-pane child — used by sidebar/fullscreen modes to pick the slide direction,
- exposes itself as a named CSS container (`container-type: inline-size; container-name: u-scaffold`) so panes can opt into `query-context="container"`.

## Multi-pane layout via flex

Drop panes around the body content; DOM order is visual order. Panes default to `mode="fixed"` (always visible flex item) — they keep their content's intrinsic width unless you style them.

```html
<u-scaffold style="height: 100vh">
  <u-pane variant="filled" style="width: 240px">
    <!-- navigation pane -->
  </u-pane>

  <main style="padding: 16px 24px; overflow: auto">
    <!-- body content; flex: 1 1 0 is applied for you -->
  </main>

  <u-pane variant="filled" style="width: 320px">
    <!-- supporting pane -->
  </u-pane>
</u-scaffold>
```

The middle `<main>` automatically grows to fill the remaining row space (the scaffold applies `flex: 1 1 0` to every non-pane child via `::slotted(:not(u-pane))`). If you want a pane to grow instead, style it with `style="flex: 1 1 0"`.

## Modes and breakpoints

Each pane picks a `mode` (default `fixed`). Optional `mode-sm` / `mode-md` / `mode-lg` / `mode-xl` attributes override the mode from that Material 3 breakpoint upward. The largest matching breakpoint wins — all resolution is CSS, no `matchMedia`.

| Mode | Behaviour |
| --- | --- |
| `fixed` (default) | In-flow flex item, always visible. `open` is ignored. |
| `collapsible` | In-flow when `open=true`, removed from the row when `open=false` (animated). |
| `sidebar` | Modal drawer overlay against the scaffold when `open=true`. Slides from the leading or trailing edge per DOM order. Closed by default. |
| `fullscreen` | Like `sidebar` but full-width and sits above the top app bar (no scrim). Closed by default. |

```html
<u-scaffold style="height: 100vh">
  <!-- Navigation: sidebar on mobile, collapsible at md+, permanent at lg+ -->
  <u-pane
    id="nav"
    mode="sidebar"
    mode-md="collapsible"
    mode-lg="fixed"
    variant="filled"
    style="width: 240px">
    <!-- navigation -->
  </u-pane>

  <main style="overflow: auto">…</main>

  <!-- Inspector: fullscreen on mobile, permanent at md+ -->
  <u-pane
    id="inspector"
    mode="fullscreen"
    mode-md="fixed"
    variant="filled"
    style="width: 320px">
    <!-- details -->
  </u-pane>
</u-scaffold>

<script>
  document.getElementById('nav').show();   // open
  document.getElementById('nav').toggle(); // flip
  document.getElementById('inspector').close();
</script>
```

The default value of `open` follows the base `mode`: `true` for `fixed` / `collapsible`, `false` for `sidebar` / `fullscreen`. Once you write to `open` (attribute or property), your value sticks regardless of mode changes.

## Container queries

Switch a pane to react to the scaffold's own width rather than the viewport with `query-context="container"`. Useful when a scaffold is embedded in a narrower outer layout.

```html
<u-pane mode="sidebar" mode-md="fixed" query-context="container">
  <!-- mode-md kicks in at md *of the scaffold's box*, not the viewport -->
</u-pane>
```

## Hosting a drawer or rail

`<u-drawer>` and `<u-navigation-rail>` are first-class body siblings or pane contents — there's no special slot.

```html
<u-scaffold>
  <u-top-app-bar slot="top-bar" headline="Mail">
    <u-icon-button slot="leading-icon">
      <span class="material-symbols-outlined">menu</span>
    </u-icon-button>
  </u-top-app-bar>

  <!-- Permanent drawer below lg, modal sidebar above -->
  <u-pane id="nav" mode="sidebar" mode-lg="fixed" style="width: 360px">
    <u-drawer>
      <u-drawer-headline>Mail</u-drawer-headline>
      <u-drawer-item>Inbox</u-drawer-item>
      <u-drawer-item>Sent</u-drawer-item>
    </u-drawer>
  </u-pane>

  <main>…</main>
</u-scaffold>
```

For a rail at all sizes, drop it directly in the body row:

```html
<u-scaffold>
  <u-navigation-rail>…</u-navigation-rail>
  <main>…</main>
</u-scaffold>
```

## Scroll behaviour

The scaffold doesn't own the scroll. Non-pane body content needs its own `overflow: auto` (the scaffold applies `min-height: 0` so the rule works). Pane content scrolls inside the pane's own `.content` part.

The top app bar, FAB and FAB menu listen to `window` by default. Use the bar's `scrollContainer` attribute to point it at a specific element:

```html
<u-top-app-bar slot="top-bar" scrollContainer="body-scroll" headline="…"></u-top-app-bar>

<div id="body-scroll" style="overflow: auto">…</div>
```

## `<u-pane>` attribute reference

| Attribute | Values | Default | What it does |
| --- | --- | --- | --- |
| `variant` | `transparent` \| `filled` | `transparent` | `filled` gives a `surface-container-low` background + 12dp corner. Modal-mode overlays use `surface-container-low` (sidebar) or `surface-container-lowest` (fullscreen) automatically. |
| `mode` | `fixed` \| `collapsible` \| `sidebar` \| `fullscreen` | `fixed` | Base behaviour. |
| `mode-sm` / `mode-md` / `mode-lg` / `mode-xl` | same values | unset | Per-breakpoint override (≥ 600 / 840 / 1200 / 1600 px). Larger breakpoints win. |
| `query-context` | `media` \| `container` | `media` | Whether breakpoint overrides query the viewport or the scaffold's container. |
| `open` | boolean | `true` for `fixed`/`collapsible`, `false` for `sidebar`/`fullscreen` | Programmatic open state. Ignored in `fixed`. |
| `animation` | `none` \| `exit` \| `exit-start` \| `exit-end` \| `fade` | `exit` | How the pane transitions in/out. `exit` (default) slides off-screen and infers the edge from `data-align` (start → leading, end → trailing). `exit-start`/`exit-end` force a side. `fade` swaps the slide for an opacity transition. `none` disables the transition. |
| `animation-sm` / `animation-md` / `animation-lg` / `animation-xl` | same values | unset | Per-breakpoint override for `animation`. Larger breakpoints win. |

### `--u-pane-width` (collapsible slide distance)

In `collapsible` mode the pane slides off via a negative `margin-inline-start` (or `margin-inline-end` when `data-align=end`). The slide distance defaults to `100%` of the body row — for the math to match the pane's actual open width, set `--u-pane-width` to that width.

```html
<!-- Sets both the visible width and the slide distance -->
<u-pane mode-md="collapsible" style="width: 280px; --u-pane-width: 280px;">…</u-pane>
```

## Programmatic control

Each pane exposes `show()`, `close()`, `toggle()`, plus the `open` boolean property. The pane fires `open` and `close` events when the consumer writes to `open`; `expand` / `collapse` events no longer exist (mode resolution is CSS-only).

```ts
const pane = document.getElementById('nav');
pane.show();
pane.close();
pane.toggle();
pane.open = true;
```

## Slots

`<u-scaffold>`:

| Slot | Goes into |
| --- | --- |
| `top-bar` | A `<u-top-app-bar>` (auto-positioned absolute). |
| default | Panes (`<u-pane>`) and the page content as siblings. Non-pane children flex to fill the remaining space. |
| `bottom-bar` | A `<u-navigation-bar>` (auto-positioned absolute). |
| `fab` | A `<u-fab>` or `<u-fab-menu>` — anchored above the bottom bar. |

`<u-pane>`:

| Slot | Goes into |
| --- | --- |
| `header` | Sticks to the top of the pane. |
| default | The pane content (scrolls inside the pane's `.content` part). |

## Parts

Scaffold: `top-bar`, `bottom-bar`, `fab`, `body-row`.

Pane: `container`, `header`, `content`, `scrim`.

## CSS custom properties

Scaffold:
- `--u-pane-gap` (default `16px`), `--u-pane-padding` (default `0` below md, `16px` at md+) — spacing in the body row.
- `--u-scaffold-fab-inline-offset`, `--u-scaffold-fab-block-offset` (defaults `16px`).
- `--u-scaffold-container-color` — scaffold background.

Pane (set on the pane host):
- `--u-pane-filled-bg-color`, `--u-pane-filled-shape-corner` — in-flow filled variant.
- `--u-pane-overlay-bg-color`, `--u-pane-overlay-corner-shape` — sidebar/fullscreen overlay.
- `--u-pane-mobile-width` (default `360px`) — sidebar drawer width.
- `--u-pane-scrim-color`, `--u-pane-scrim-opacity` (default `.4`).
- `--u-pane-z-index` (default `1030`, sidebar), `--u-pane-fullscreen-z-index` (default `1040`).
- `--u-pane-transition` (default `300ms` ease).

## Caveats

- The scaffold must have an explicit height (`100vh`, fixed px, or flex parent). Without it the body row collapses to 0.
- Non-pane body content does not get an automatic scroll container — apply `overflow: auto` yourself if you want the column to scroll independently of the page.
- The top app bar / FAB default to `window` scroll. To make them react to in-scaffold scroll, set `scrollContainer="..."` to the id of a scrolling element or pass an `HTMLElement` directly to the property.
- `<u-pane mode="sidebar">` slides from the leading edge by default. Place the pane *after* your body content in DOM order to slide from the trailing edge — the scaffold writes `data-align="end"` on it automatically.
- `query-context="container"` requires the scaffold ancestor (which sets `container-type`). If you use a pane outside a `<u-scaffold>`, container queries won't resolve.
- The standalone `u-side-navigation` is `@deprecated` — use a `<u-pane>` with a slotted `<u-drawer>` / `<u-navigation-rail>` instead.
