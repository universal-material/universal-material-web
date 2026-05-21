---
description: Lay out an app screen with u-scaffold — top app bar, scrollable content, optional navigation bar at the bottom, FAB anchored above the bar.
---

# Scaffold (page layout)

Use this when the user wants the typical Material 3 app shell: a top app bar pinned at the top, a scrollable content area, an optional navigation bar at the bottom, and a FAB that floats above the bar.

`<u-scaffold>` is a layout container that:
- owns the scroll — content scrolls inside the scaffold, not the page,
- publishes its internal scroll element through Lit context so descendants (`<u-top-app-bar>`, `<u-fab>`, `<u-fab-menu>`, ...) react to the right scroll target automatically,
- auto-sets `position="absolute"` on slotted `<u-top-app-bar>` / `<u-navigation-bar>` so they anchor against the scaffold (not the viewport),
- measures the navigation bar's height and offsets the FAB above it (16dp gap per M3).

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

## Slots

| Slot | Goes into |
| --- | --- |
| `top-bar` | A `<u-top-app-bar>` (auto-positioned absolute). |
| default | The scrollable page content. |
| `bottom-bar` | A `<u-navigation-bar>` (auto-positioned absolute). |
| `fab` | A `<u-fab>` or `<u-fab-menu>` — anchored above the bottom bar. |

## Parts

`scroll-container`, `top-bar`, `bottom-bar`, `fab` — style them via `::part()` from outside the shadow DOM.

## Caveats

- The scaffold must have an explicit height (`100vh`, fixed px, or flex parent). Without it the scroll area collapses to 0.
- Don't set the page `<body>` to `overflow: hidden` and the scaffold to a flex parent at the same time — let the scaffold own the scroll.
- The scaffold sets `--_u-scaffold-bottom-bar-height` from a ResizeObserver on the bottom-bar wrapper; the FAB consumes it via `calc(16px + var(--_u-scaffold-bottom-bar-height, 0px))`. If you swap the bottom bar at runtime, the FAB offset updates automatically.
- To override the FAB offsets: `--u-scaffold-fab-inline-offset` and `--u-scaffold-fab-block-offset` (default `16px` each).
- The bars consume the scaffold's scroll container via Lit context. If you set `scrollContainer="window"` (or any explicit value) on a bar, that explicit value wins.
