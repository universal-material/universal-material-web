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

  <u-pane variant="transparent" style="flex: 1 1 0">
    <!-- main body content; transparent = no background, scrolls inside .content -->
  </u-pane>

  <u-pane variant="filled" style="width: 320px">
    <!-- supporting pane -->
  </u-pane>
</u-scaffold>
```

The scaffold applies `flex: 1 1 0` to every non-pane child via `::slotted(:not(u-pane))`, so a plain `<main>` would also flex correctly — but see the recommendation below for why panes are preferred when other panes are present.

### Recommendation: be consistent — if you use panes, use them for every body sibling

When any body child of a scaffold is a `<u-pane>`, prefer making **all** body children panes (even the central content). Mixing `<u-pane>` with raw `<main>` / `<aside>` creates three forms of inconsistency:

1. **Surface**: panes pick up Material 3 surface tokens (filled = `surface-container-low` + 12dp corner; transparent = no bg). Raw `<main>` sits on `surface` without that shape. Side-by-side, the pane looks like a "real panel" and the main looks like loose content.
2. **Scrolling**: panes scroll inside their internal `.content` part — set the pane's height and overflow is handled automatically. Raw `<main>` needs `overflow: auto` set explicitly and `min-height: 0` to work right inside the flex row.
3. **Responsive modes**: panes accept `mode` / `mode-sm` / `mode-md` / `mode-lg` / `mode-xl` for breakpoint-driven layout changes. Raw `<main>` doesn't — you'd have to write `@media` rules to mirror the same behavior.

Use the `transparent` variant for the central content area when you want it to read as the page surface rather than a raised panel:

```html
<u-scaffold style="height: 100vh">
  <u-pane mode="sidebar" mode-md="fixed" variant="filled" style="width: 240px">…sub-nav…</u-pane>
  <u-pane variant="transparent" style="flex: 1 1 0">…page content…</u-pane>
</u-scaffold>
```

The rule is "be deliberate about the mix": use raw `<main>` when no panes exist in the layout at all (simpler), and use panes everywhere when any pane is present (consistent).

## Canonical patterns

Two layouts come up over and over in real apps. Use these as the starting point and tune from there.

### Pattern A — "Settings / section nav" (settings, profile, admin)

A settings screen **is a list-detail**: the section nav is the *list* and the section's content is the *detail*. Don't model it as "a modal sidebar + always-on content" — that hides the nav on mobile and forces a redundant mobile picker. Instead:

- **Section nav = the list**: `mode="fixed"` (always visible). On mobile it fills the viewport (it's the only thing shown until you pick a section); on md+ it's a fixed-width column. Drive the width with a class, not inline style, so a media query can switch it.
- **Section content = the detail**: `mode="fullscreen" mode-md="fixed"`. On mobile, picking a section opens the content as a fullscreen overlay with a back button; on md+ both sit side by side.

```html
<u-scaffold style="height: 100vh">
  <u-top-app-bar slot="top-bar" headline="Settings">…</u-top-app-bar>

  <!-- Nav (the list): fills the screen on mobile, fixed column on md+ -->
  <u-pane id="nav" mode="fixed" variant="filled" class="settings-nav">
    <u-drawer>
      <u-drawer-item active data-section="general" keep-drawer-open>General</u-drawer-item>
      <u-drawer-item data-section="security" keep-drawer-open>Security</u-drawer-item>
    </u-drawer>
  </u-pane>

  <!-- Content (the detail): fullscreen overlay on mobile, fixed on md+ -->
  <u-pane id="content" mode="fullscreen" mode-md="fixed" variant="transparent" style="flex: 1 1 0; min-width: 0;">
    <div slot="header" class="settings-back"><!-- shown only on mobile -->
      <u-icon-button onclick="document.getElementById('content').close()">
        <span class="material-symbols-outlined">arrow_back</span>
      </u-icon-button>
      <span class="u-title-s">Settings</span>
    </div>
    <!-- sections, forms, etc. -->
  </u-pane>
</u-scaffold>

<style>
  .settings-nav { flex: 1 1 0; }                 /* mobile: nav fills viewport */
  @media (min-width: 840px) { .settings-nav { flex: 0 0 320px; } }  /* md+: fixed column */
  .settings-back { display: none; align-items: center; gap: 8px; padding: 8px 12px; }
  @media (max-width: 839.98px) { .settings-back { display: flex; } }  /* back only on mobile */
</style>

<script>
  // Picking a section reveals it AND opens the detail (no-op at md+ where it's fixed).
  document.querySelectorAll('u-drawer-item[data-section]').forEach(it =>
    it.addEventListener('click', () => {
      showSection(it.dataset.section);
      document.getElementById('content').show();
    }));
</script>
```

Two cascade traps this pattern walks into (both bit real builds):
- **`display` on the mobile-only back header**: put it in a class with the media query, never `style="display:flex"` inline — inline beats the class's `display:none` and the header leaks onto desktop.
- **Pane width**: `mode="fixed"` panes set their own `flex` internally; override it from a document-scope **class** (not the component's `:host`) so a media query can flip `flex: 1 1 0` ↔ `flex: 0 0 320px`.

### Pattern B — "List-detail" (mail, messaging, file managers, CRM contacts)

Three panes: a small top-level nav, a list of items, and a detail view. The detail collapses to a fullscreen overlay on mobile so it can take over the viewport when the user picks an item, then slides back out when they hit back.

```html
<u-scaffold style="height: 100vh">
  <u-top-app-bar slot="top-bar" headline="Mail">
    <u-icon-button slot="leading-icon" onclick="document.getElementById('mailnav').toggle()">
      <span class="material-symbols-outlined">menu</span>
    </u-icon-button>
  </u-top-app-bar>

  <!-- Nav: modal on mobile/medium, fixed at lg -->
  <u-pane id="mailnav" mode="sidebar" mode-lg="fixed" variant="filled" style="width: 240px;">
    <u-drawer>
      <u-drawer-item active>
        <span slot="icon" class="material-symbols-outlined">inbox</span>
        Inbox
        <span slot="badge">12</span>
      </u-drawer-item>
      <u-drawer-item>
        <span slot="icon" class="material-symbols-outlined">send</span>
        Sent
      </u-drawer-item>
    </u-drawer>
  </u-pane>

  <!-- List: always in-flow. Filled gives it a distinct surface. -->
  <u-pane variant="filled" mode="fixed" style="width: 360px;">
    <div slot="header" style="padding: 8px 12px; display: flex; align-items: center; gap: 8px;">
      <strong>Primary · 5 messages</strong>
    </div>
    <u-list>
      <u-list-item selectable onclick="openMessage(...)">…</u-list-item>
      <!-- ... -->
    </u-list>
  </u-pane>

  <!-- Detail: fullscreen overlay on mobile, fixed in-flow on md+. THIS is the key. -->
  <u-pane id="detail" mode="fullscreen" mode-md="fixed" variant="filled" style="flex: 1 1 0; min-width: 0;">
    <div slot="header" style="display: flex; align-items: center; gap: 4px; padding: 8px 12px;">
      <u-icon-button onclick="document.getElementById('detail').close()" aria-label="Back">
        <span class="material-symbols-outlined">arrow_back</span>
      </u-icon-button>
      <span style="flex: 1"></span>
      <u-icon-button aria-label="Archive"><span class="material-symbols-outlined">archive</span></u-icon-button>
    </div>
    <div style="padding: 0 24px 24px;">
      <!-- subject, sender, body -->
    </div>
  </u-pane>
</u-scaffold>

<script>
  function openMessage(id) {
    // populate detail content...
    document.getElementById('detail').show();  // opens fullscreen overlay on mobile, no-op at md+ where it's already fixed
  }
</script>
```

What makes this work:

- **Nav pane**: `mode="sidebar" mode-lg="fixed"` — closed-by-default modal until lg, where it docks in-flow. (`mode-md="collapsible"` is another option if you want it visible at md but collapsible.)
- **List pane**: `mode="fixed"` — always visible. `filled` so it has its own surface, distinct from the detail.
- **Detail pane**: `mode="fullscreen" mode-md="fixed"` — **this is the linchpin of the list-detail pattern**. At mobile sizes the detail slides in OVER the list when opened; the back button calls `pane.close()` to dismiss. At md+ it's a fixed flex item beside the list. The mode change is pure CSS; the `open` property persists across breakpoints (once you set it, it sticks).
- **Header slot**: each pane uses `slot="header"` for its toolbar so it stays pinned while the list/detail content scrolls.

There's a working version of this in the docs site under `docs/src/app/screens/scaffold-list-detail/` (a Mail clone) — read it whenever you need the full responsive choreography.

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
- **A `<u-drawer>` slotted into a `filled` pane paints over the pane's own background.** The drawer renders its own surface, and at `lg`+ that surface becomes `surface`/body (the "standard drawer" treatment for a permanent side-nav) — identical to the scaffold background. So a filled nav pane shows its background at small/medium widths and then *loses it on desktop*, exactly where the drawer flips to body color. The pane background is there; the drawer is painting on top. Fix at the drawer, not the pane: neutralize the drawer's surface so the pane shows through — `--u-modal-drawer-bg-color: transparent; --u-standard-drawer-bg-color: transparent;` (set on the pane; they inherit to the drawer). See the drawer skill for detail.
