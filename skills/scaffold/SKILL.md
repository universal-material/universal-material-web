---
description: Lay out an app screen with u-scaffold — top app bar, scrollable content, optional navigation bar at the bottom, FAB anchored above the bar, and optional start/center/end side panes for list-detail layouts.
---

# Scaffold (page layout)

Use this when the user wants the typical Material 3 app shell: a top app bar pinned at the top, a scrollable content area, an optional navigation bar at the bottom, and a FAB that floats above the bar. For list-detail or multi-card layouts, add `<u-scaffold-pane>` children for `start`, `center` and/or `end` regions.

`<u-scaffold>` is a layout container that:
- owns the scroll — content scrolls inside the scaffold, not the page,
- publishes its internal scroll element through Lit context so descendants (`<u-top-app-bar>`, `<u-fab>`, `<u-fab-menu>`, ...) react to the right scroll target automatically,
- auto-sets `position="absolute"` on slotted `<u-top-app-bar>` / `<u-navigation-bar>` so they anchor against the scaffold (not the viewport),
- measures the navigation bar's height and offsets the FAB above it (16dp gap per M3),
- arranges optional `<u-scaffold-pane>` children into grid columns; each pane chooses its own collapse breakpoint and collapse mode independently.

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
    <u-navigation-bar-item>
      <span class="material-symbols-outlined" slot="icon">send</span>
      Sent
    </u-navigation-bar-item>
  </u-navigation-bar>

  <u-fab slot="fab" color="primary">
    <span class="material-symbols-outlined">edit</span>
  </u-fab>
</u-scaffold>
```

## List-detail with side panes

Three carded columns: navigation (start, hides under `lg`), list (center, fixed 432dp), detail (end, fullscreen overlay under `md`). The `width="1fr"` on the end pane lets it flex to fill the remaining space.

```html
<u-scaffold style="height: 100vh">
  <u-top-app-bar slot="top-bar" headline="Inbox"></u-top-app-bar>

  <u-scaffold-pane
    position="start"
    variant="filled-low"
    collapse-mode="hidden"
    collapse-breakpoint="lg"
    width="240"
  >
    <!-- nav -->
  </u-scaffold-pane>

  <u-scaffold-pane position="center" variant="filled-low" width="432">
    <!-- list -->
  </u-scaffold-pane>

  <u-scaffold-pane
    position="end"
    variant="filled-low"
    collapse-mode="fullscreen"
    collapse-breakpoint="md"
    width="1fr"
    id="detail"
  >
    <!-- detail content; open it programmatically with detail.show() -->
  </u-scaffold-pane>
</u-scaffold>
```

## `<u-scaffold-pane>` attribute reference

| Attribute | Values | Default | What it does |
| --- | --- | --- | --- |
| `position` | `start` \| `center` \| `end` | `start` | Where in the scaffold the pane lives. `center` replaces the scaffold's default slot. |
| `variant` | `transparent` \| `filled` \| `filled-low` \| `filled-lowest` | `transparent` | Surface tone. `filled` = `surface-container-highest`, `filled-low` = `surface-container-low` (recommended for list-detail), `filled-lowest` = `surface-container-lowest`. |
| `collapse-mode` | `sidebar` \| `fullscreen` \| `hidden` | `sidebar` | Below breakpoint: `sidebar` = slide-in drawer with scrim; `fullscreen` = covers the whole scaffold including the top bar; `hidden` = removed from layout, no overlay. |
| `collapse-breakpoint` | `sm` (600) \| `md` (840) \| `lg` (1200) | `lg` | Viewport min-width below which the pane collapses. |
| `width` | bare number (px) or any CSS length / `1fr` / `minmax(...)` | none | Per-pane grid-column width when expanded. Overrides the scaffold-level `--u-scaffold-{start,end}-pane-width` host vars. |

Ignored for `position="center"`: `collapse-mode`, `collapse-breakpoint` (a center pane never overlays itself).

## Programmatic control

Each pane exposes `show()`, `close()`, `toggle()` plus `open`, `expanded` boolean properties. The scaffold has `openPane(position)`, `closePane(position)`, `togglePane(position)`.

```ts
document.getElementById('detail').show();
document.querySelector('u-scaffold').openPane('start');
```

Events bubble up from the pane and re-dispatch from the scaffold:

| Pane event | Scaffold event | When |
| --- | --- | --- |
| `open` / `close` | `u-scaffold-pane-open` / `u-scaffold-pane-close` (with `detail.position`) | Pane opens/closes (mobile overlay). |
| `expand` / `collapse` | — | Viewport crosses `collapse-breakpoint`. |
| `width-change` | — | The pane's `width` attribute or property changes. |

## Slots

| Slot | Goes into |
| --- | --- |
| `top-bar` | A `<u-top-app-bar>` (auto-positioned absolute). |
| default | The scrollable page content. **Hidden when a `position="center"` pane is present.** |
| `bottom-bar` | A `<u-navigation-bar>` (auto-positioned absolute). |
| `fab` | A `<u-fab>` or `<u-fab-menu>` — anchored above the bottom bar. |
| `start-pane` | Auto-populated from `u-scaffold-pane[position=start]` children. |
| `center-pane` | Auto-populated from `u-scaffold-pane[position=center]` children. |
| `end-pane` | Auto-populated from `u-scaffold-pane[position=end]` children. |

## Parts

Scaffold: `scroll-container`, `top-bar`, `bottom-bar`, `fab`, `pane-row`, `start-pane-region`, `center-pane-region`, `end-pane-region`.

Pane: `container`, `header`, `content`, `scrim`.

## CSS custom properties

Scaffold:
- `--u-scaffold-pane-gap` (default `16px`), `--u-scaffold-pane-padding` (default `0`) — spacing in the pane row.
- `--u-scaffold-start-pane-width`, `--u-scaffold-end-pane-width` (defaults `360px`) — scaffold-wide fallback for pane column widths. Per-pane `width` attribute overrides this.
- `--u-scaffold-fab-inline-offset`, `--u-scaffold-fab-block-offset` (defaults `16px`).
- `--u-scaffold-container-color` — scaffold background.

Pane (set on the pane host):
- `--u-scaffold-pane-width` — alternative to the `width` attribute; same effect.
- `--u-scaffold-pane-filled-bg-color` — overrides the variant background.
- `--u-scaffold-pane-filled-shape-corner` — overrides the corner radius (default `medium`/12dp; the canonical list-detail layout uses 20px).
- `--u-scaffold-pane-mobile-width` (default `360px`) — sidebar drawer width when collapsed.
- `--u-scaffold-pane-scrim-color`, `--u-scaffold-pane-scrim-opacity` (default `.4`).
- `--u-scaffold-pane-z-index` (default `1030`), `--u-scaffold-pane-transition`.

## Caveats

- The scaffold must have an explicit height (`100vh`, fixed px, or flex parent). Without it the scroll area collapses to 0.
- Don't set the page `<body>` to `overflow: hidden` and the scaffold to a flex parent at the same time — let the scaffold own the scroll.
- The scaffold sets `--_u-scaffold-bottom-bar-height` from a ResizeObserver on the bottom-bar row; the FAB consumes it via `calc(16px + var(--_u-scaffold-bottom-bar-height, 0px))`.
- A `position="center"` pane hides the scaffold's default slot — put your content inside the pane or use the default slot, not both.
- When you mix a fixed-width center pane with `start`/`end` panes, give one of them `width="1fr"` so the grid fills the row. Otherwise three fixed-width columns leave empty space on the side.
- `collapse-mode="hidden"` panes still fire `open`/`close` events on `show()` / `close()`, but render nothing below the breakpoint — useful when the mobile UI provides an alternative (e.g. a bottom nav).
- The bars consume the scaffold's scroll container via Lit context. If you set `scrollContainer="window"` (or any explicit value) on a bar, that explicit value wins. When a center pane is present, the context points at the center pane's internal scroll area.
