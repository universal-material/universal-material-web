---
description: Build a Material 3 responsive navigation rail — hidden on mobile, collapsed 96dp rail on medium with primary items, permanent expanded rail (220–360dp) on large with the full menu (including headlines). Two slots crossfade between the two states.
---

# Navigation rail

`<u-navigation-rail>` is a responsive primary navigation surface with two independently configurable destination sets — one short list for the collapsed state, and an optional longer/grouped list for the expanded state. The two share the same on-screen area and the rail crossfades between them as it grows or shrinks.

## Responsive behavior

- **Mobile (< 840px)**: rail is hidden. Provide a different nav pattern (e.g. `<u-navigation-bar>`) for small screens.
- **Medium (840–1199px)**: rail is a permanent 96dp **collapsed** sidebar showing `slot="rail"` items.
- **Large (≥ 1200px)**: rail is permanently **expanded** (220–360dp, default 360dp), showing `slot="expanded"` items grouped by `<u-navigation-rail-headline>`s. `toggle-drawer` collapses it back to the 96dp width and crossfades to the `slot="rail"` list. If `slot="expanded"` is empty, the rail keeps showing `slot="rail"` items even when expanded.

## Basic usage

```html
<u-navigation-rail id="nav">
  <!-- Collapsed: short list of primary destinations -->
  <u-navigation-rail-item slot="rail" active>
    <span class="material-symbols-outlined" slot="icon">home</span>
    Home
  </u-navigation-rail-item>
  <u-navigation-rail-item slot="rail">
    <span class="material-symbols-outlined" slot="icon">explore</span>
    Browse
  </u-navigation-rail-item>
  <u-navigation-rail-item slot="rail">
    <span class="material-symbols-outlined" slot="icon">library_music</span>
    Library
  </u-navigation-rail-item>

  <!-- Expanded: full menu, grouped with headlines -->
  <u-navigation-rail-headline slot="expanded">Library</u-navigation-rail-headline>
  <u-navigation-rail-item slot="expanded" active>
    <span class="material-symbols-outlined" slot="icon">home</span>
    Home
  </u-navigation-rail-item>
  <u-navigation-rail-item slot="expanded">
    <span class="material-symbols-outlined" slot="icon">explore</span>
    Browse
  </u-navigation-rail-item>

  <u-navigation-rail-headline slot="expanded">Recents</u-navigation-rail-headline>
  <u-navigation-rail-item slot="expanded">
    <span class="material-symbols-outlined" slot="icon">favorite</span>
    Favorites
  </u-navigation-rail-item>

  <u-scaffold>
    <u-top-app-bar slot="top-bar" headline="Mail">
      <u-icon-button slot="leading-icon"
        onclick="const r = this.closest('u-navigation-rail'); r.toggleDrawer = !r.toggleDrawer;">
        <span class="material-symbols-outlined">menu</span>
      </u-icon-button>
    </u-top-app-bar>
    <div>Page content</div>
  </u-scaffold>
</u-navigation-rail>
```

## Slots on `<u-navigation-rail>`

| Slot | Content | Shown when |
| --- | --- | --- |
| `rail` | Primary destinations (`<u-navigation-rail-item>`s). | Collapsed state (mobile is hidden; md is permanent; lg shows when `toggle-drawer` is set). |
| `expanded` | Full destination list — items + `<u-navigation-rail-headline>`s. | Expanded state (lg without `toggle-drawer`). Falls back to `rail` when empty. |
| `rail-top` | Menu button, brand mark, or other top-pinned content. | Always (within visible rail). |
| `rail-bottom` | FAB or secondary action pinned to the bottom. | Always (within visible rail). |
| default | Page content (typically `<u-scaffold>`). | Always. |

The rail crossfades (200ms) between the `rail` and `expanded` layers when its state changes.

## `<u-navigation-rail-item>`

The rail sets the item's `variant` automatically based on which slot it lives in:

- Inside `slot="rail"`: `variant="collapsed"` (vertical icon + label, 56×32dp pill around the icon, label-medium).
- Inside `slot="expanded"`: `variant="expanded"` (horizontal icon + label inside a content-sized 56dp pill aligned to the leading edge with 16dp inset; label-large).

Slots: default (label), `icon` (24dp icon), `badge` (optional `<u-badge>`).

```html
<u-navigation-rail-item slot="expanded" active>
  <span class="material-symbols-outlined" slot="icon">inbox</span>
  Inbox
  <u-badge slot="badge">12</u-badge>
</u-navigation-rail-item>
```

## `<u-navigation-rail-headline>`

Section header for grouping destinations inside `slot="expanded"`. Renders title-small typography in `on-surface-variant`, with M3-correct padding. Only visible while the rail is expanded — headlines never appear in the narrow collapsed form, since the collapsed `slot="rail"` is a separate, headline-free list.

```html
<u-navigation-rail-headline slot="expanded">Recents</u-navigation-rail-headline>
```

## Tokens applied (M3 expressive spec)

Sources: `md.comp.nav-rail`, `md.comp.nav-rail-collapsed`, `md.comp.nav-rail-expanded`, `md.comp.nav-rail-item`, `md.comp.nav-rail-item-vertical`, `md.comp.nav-rail-item-horizontal`.

- **Rail container**: 96dp width (collapsed default; 80dp narrow opt-in) / 220–360dp width (expanded); `surface` color; level-0 elevation; `corner-none`; 44dp top space; 20dp vertical-trailing space.
- **Item container**: 64dp height (default); 4dp gap between items (collapsed) / 0dp (expanded).
- **Active indicator**: `secondary-container` background; `corner-full` shape; 56×32dp pill (collapsed/vertical) / content-sized 56dp pill (expanded/horizontal) aligned to the 16dp leading edge.
- **Icon**: 24dp; `on-secondary-container` (active) / `on-surface-variant` (inactive).
- **Label**: label-medium 12sp (collapsed) / label-large 14sp (expanded). Active color is `secondary` (collapsed/vertical) or `on-secondary-container` (expanded/horizontal); inactive is `on-surface-variant`. Active items use `weight-prominent` (700 / bold).
- **State layer**: `on-secondary-container` color; hover 8%, focus 10%, pressed 10% — applied **only inside the active-indicator pill**. Click target remains the entire item, ripples confined to the pill via `u-ripple` inside the indicator.

## Caveats

- Don't slot a `<u-drawer>`: the expanded rail is a distinct M3 surface with its own pill-shaped items, not a drawer.
- Mobile (< 840px) hides the rail entirely — give small screens a different nav (`<u-navigation-bar>`, modal etc).
- `slot="rail-top"` / `slot="rail-bottom"` children are sized intrinsically (not stretched), and align horizontally based on the rail state — centered when collapsed, leading-aligned with 16dp inset when expanded.
- The expanded layer scrolls when its content overflows the rail height; the collapsed layer does too if you slot more than ~5 items.
