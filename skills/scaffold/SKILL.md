---
description: Lay out an app screen with u-scaffold — top app bar, scrollable content, optional navigation bar at the bottom, FAB anchored above the bar, and optional navigation/center/side panes for list-detail or supporting layouts.
---

# Scaffold (page layout)

Use this when the user wants the typical Material 3 app shell: a top app bar pinned at the top, a scrollable content area, an optional navigation bar at the bottom, and a FAB that floats above the bar. For list-detail / supporting layouts, add `<u-scaffold-pane>` children for `navigation`, `center` and/or `side` regions.

`<u-scaffold>` is a layout container that:
- owns the scroll — content scrolls inside the scaffold, not the page,
- publishes its internal scroll element through Lit context so descendants (`<u-top-app-bar>`, `<u-fab>`, `<u-fab-menu>`, ...) react to the right scroll target automatically,
- auto-sets `position="absolute"` on slotted `<u-top-app-bar>` / `<u-navigation-bar>` so they anchor against the scaffold (not the viewport),
- measures the navigation bar's height and offsets the FAB above it (16dp gap per M3),
- arranges optional `<u-scaffold-pane>` children into grid columns based on the `layout` attribute and the panes' own collapse breakpoints,
- writes `--u-app-bar-leading-icon-width` matching the navigation column width so a slotted `u-top-app-bar` can min-width its leading area and visually align its headline with the start of the center column.

## Basic usage

```html
<u-scaffold style="height: 100vh">
  <u-top-app-bar slot="top-bar" size="large" headline="Inbox">
    <u-icon-button slot="leading-icon">
      <span class="material-symbols-outlined">menu</span>
    </u-icon-button>
  </u-top-app-bar>

  <main style="padding: 16px 24px">
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

## List-detail layout

Three carded columns: navigation (left), list (center, fixed width), detail (right, flexes). Below `lg` the navigation collapses to overlay; below `md` the detail covers everything.

```html
<u-scaffold
  layout="list-detail"
  style="height: 100vh; --u-pane-navigation-width: 240px; --u-pane-fixed-width: 432px"
>
  <u-top-app-bar slot="top-bar" headline="Inbox"></u-top-app-bar>

  <u-scaffold-pane
    position="navigation"
    variant="filled-low"
    collapse-mode="hidden"
    collapse-breakpoint="lg"
  >
    <!-- nav -->
  </u-scaffold-pane>

  <u-scaffold-pane position="center" variant="filled-low">
    <!-- list -->
  </u-scaffold-pane>

  <u-scaffold-pane
    position="side"
    variant="filled-low"
    collapse-mode="fullscreen"
    collapse-breakpoint="md"
    id="detail"
  >
    <!-- detail; open programmatically with detail.show() -->
  </u-scaffold-pane>
</u-scaffold>
```

## Supporting layout

The center column flexes and the side column is fixed — e.g. an editor with a fixed-width supporting / inspector panel.

```html
<u-scaffold layout="supporting" style="--u-pane-fixed-width: 320px">
  <u-scaffold-pane position="side" variant="filled-low">
    <!-- supporting panel -->
  </u-scaffold-pane>

  <main>...</main>
</u-scaffold>
```

## Navigation pane absorbs `u-side-navigation`

A `position="navigation"` pane can host a `<u-drawer>` and/or `<u-navigation-rail>` via named slots. The pane resolves its own width based on what's slotted and writes it to the scaffold's `--u-pane-navigation-width` so the grid track and `--u-app-bar-leading-icon-width` follow automatically.

```html
<u-scaffold>
  <u-top-app-bar slot="top-bar" headline="Mail">
    <u-icon-button slot="leading-icon">
      <span class="material-symbols-outlined">menu</span>
    </u-icon-button>
  </u-top-app-bar>

  <u-scaffold-pane position="navigation" id="nav">
    <u-drawer slot="drawer">
      <u-drawer-headline>Mail</u-drawer-headline>
      <u-drawer-item>Inbox</u-drawer-item>
      <u-drawer-item>Sent</u-drawer-item>
    </u-drawer>
  </u-scaffold-pane>

  <main>...</main>
</u-scaffold>

<script>
  // Slide the drawer off (column collapses to 0 if no rail is also slotted).
  document.getElementById('nav').toggleDrawer = true;
</script>
```

### Width resolution matrix (navigation pane only)

| Slotted | ≥ lg | md (840–1199) | < md |
| --- | --- | --- | --- |
| drawer, not toggled | 360dp (M3 drawer width) | 0 (overlay via collapse-mode) | 0 |
| drawer, toggled | 0 | 0 | 0 |
| rail, not toggled | 96dp (rail collapsed) | 96dp | 0 |
| rail, toggled (expanded panel) | 360dp | overlay | overlay |
| drawer + rail, not toggled | 360dp (drawer over rail) | 96dp | overlay |
| drawer + rail, toggled | 96dp (rail visible) | 96dp | overlay |
| custom content (no slots) | `var(--u-pane-navigation-width)` (consumer-set) | same | overlay |

## `<u-scaffold>` attribute reference

| Attribute | Values | Default | What it does |
| --- | --- | --- | --- |
| `layout` | `list-detail` \| `supporting` | `list-detail` | Picks which column gets `--u-pane-fixed-width`. `list-detail`: center fixed, side flexes. `supporting`: center flexes, side fixed. |

## `<u-scaffold-pane>` attribute reference

| Attribute | Values | Default | What it does |
| --- | --- | --- | --- |
| `position` | `navigation` \| `center` \| `side` | `navigation` | Where in the scaffold the pane lives. `center` replaces the scaffold's default slot. |
| `variant` | `transparent` \| `filled` \| `filled-low` \| `filled-lowest` | `transparent` | Surface tone. `filled` = `surface-container-highest`, `filled-low` = `surface-container-low` (recommended for list-detail), `filled-lowest` = `surface-container-lowest`. |
| `collapse-mode` | `sidebar` \| `fullscreen` \| `hidden` | `sidebar` | Below breakpoint: `sidebar` = slide-in drawer with scrim; `fullscreen` = covers the whole scaffold including the top bar; `hidden` = removed from layout, no overlay. |
| `collapse-breakpoint` | `sm` (600) \| `md` (840) \| `lg` (1200) | `lg` | Viewport min-width below which the pane collapses. |
| `toggle-drawer` | boolean | `false` | (navigation pane only) When `true`, slides the slotted drawer off and collapses the column to the rail width (or 0 if no rail). |

Ignored for `position="center"`: `collapse-mode`, `collapse-breakpoint`, `toggle-drawer` (a center pane never overlays itself).

## Programmatic control

Each pane exposes `show()`, `close()`, `toggle()` plus `open`, `expanded`, `toggleDrawer` boolean properties. The scaffold has `openPane(position)`, `closePane(position)`, `togglePane(position)`.

```ts
document.getElementById('detail').show();
document.querySelector('u-scaffold').openPane('navigation');
navPane.toggleDrawer = true;
```

Events bubble from the pane and re-dispatch from the scaffold:

| Pane event | Scaffold event | When |
| --- | --- | --- |
| `open` / `close` | `u-scaffold-pane-open` / `u-scaffold-pane-close` (with `detail.position`) | Pane opens/closes (mobile overlay). |
| `expand` / `collapse` | — | Viewport crosses `collapse-breakpoint`. |
| `navigation-width-change` | — | Navigation pane's resolved width changes (drawer/rail/toggle change). Internal — scaffold uses it to re-sync the app-bar var. |

## Slots

| Slot | Goes into |
| --- | --- |
| `top-bar` | A `<u-top-app-bar>` (auto-positioned absolute). |
| default | The scrollable page content. **Hidden when a `position="center"` pane is present.** |
| `bottom-bar` | A `<u-navigation-bar>` (auto-positioned absolute). |
| `fab` | A `<u-fab>` or `<u-fab-menu>` — anchored above the bottom bar. |
| `navigation-pane` | Auto-populated from `u-scaffold-pane[position=navigation]` children. |
| `center-pane` | Auto-populated from `u-scaffold-pane[position=center]` children. |
| `side-pane` | Auto-populated from `u-scaffold-pane[position=side]` children. |

`<u-scaffold-pane position="navigation">` additionally accepts:

| Slot | Goes into |
| --- | --- |
| `drawer` | A `<u-drawer>` — pane sizes its column to the M3 drawer width. |
| `rail` | A `<u-navigation-rail>` — pane sizes to the rail collapsed / expanded width. |
| `header` | Sticks to the top of the pane (when used without drawer/rail). |
| default | Custom navigation content (when no drawer/rail is slotted). |

## Parts

Scaffold: `scroll-container`, `top-bar`, `bottom-bar`, `fab`, `pane-row`, `navigation-pane`, `center-pane`, `side-pane`.

Pane: `container`, `header`, `content`, `scrim`.

## CSS custom properties

Scaffold:
- `--u-pane-navigation-width` — width of the navigation column when a custom-content navigation pane is present (no drawer/rail slotted). When the pane *does* host a drawer/rail, the pane overrides this with its resolved width. Default `360px`.
- `--u-pane-fixed-width` — width of the column marked as "fixed" by the current `layout` (`center` under `list-detail`, `side` under `supporting`). Default `360px`.
- `--u-app-bar-leading-icon-width` — written by the scaffold; consumed by a slotted `u-top-app-bar` at `lg+` to min-width its `.leading-icon`. You don't normally set this yourself.
- `--u-scaffold-pane-gap` (default `16px`), `--u-scaffold-pane-padding` (default `0`) — spacing in the pane row.
- `--u-scaffold-fab-inline-offset`, `--u-scaffold-fab-block-offset` (defaults `16px`).
- `--u-scaffold-container-color` — scaffold background.

Pane (set on the pane host):
- `--u-scaffold-pane-filled-bg-color` — overrides the variant background.
- `--u-scaffold-pane-filled-shape-corner` — overrides the corner radius (default `medium`/12dp; the canonical list-detail layout uses 20px).
- `--u-scaffold-pane-mobile-width` (default `360px`) — sidebar drawer width when collapsed.
- `--u-scaffold-pane-scrim-color`, `--u-scaffold-pane-scrim-opacity` (default `.4`).
- `--u-scaffold-pane-z-index` (default `1030`), `--u-scaffold-pane-transition`.

## Migration from round 2

`position="start"`/`"end"` were renamed to `"navigation"`/`"side"`. **No aliases.** The per-pane `width` attribute and `--u-scaffold-pane-width` CSS var are gone — set widths on the scaffold via `--u-pane-navigation-width` and `--u-pane-fixed-width` (plus pick the right `layout`).

## Caveats

- The scaffold must have an explicit height (`100vh`, fixed px, or flex parent). Without it the scroll area collapses to 0.
- Don't set the page `<body>` to `overflow: hidden` and the scaffold to a flex parent at the same time — let the scaffold own the scroll.
- The scaffold sets `--_u-scaffold-bottom-bar-height` from a ResizeObserver on the bottom-bar row; the FAB consumes it via `calc(16px + var(--_u-scaffold-bottom-bar-height, 0px))`.
- A `position="center"` pane hides the scaffold's default slot — put your content inside the pane or use the default slot, not both.
- Under `layout="list-detail"`, the center column is *fixed* at `--u-pane-fixed-width`. If you don't slot a center pane, the default-slot scroll-container still takes that fixed width — usually you want `layout="supporting"` for the navigation+content+side pattern.
- `collapse-mode="hidden"` panes still fire `open`/`close` events on `show()` / `close()`, but render nothing below the breakpoint — useful when the mobile UI provides an alternative (e.g. a bottom nav).
- The standalone `u-side-navigation` is `@deprecated`. Inside a scaffold, use the navigation pane with `drawer` / `rail` slots instead.
- The bars consume the scaffold's scroll container via Lit context. If you set `scrollContainer="window"` (or any explicit value) on a bar, that explicit value wins. When a center pane is present, the context points at the center pane's internal scroll area.
