---
description: Add a floating action button — u-fab (single primary action), u-fab-menu (expandable speed-dial with multiple items).
---

# FAB and FAB menu

## `<u-fab>` — single primary action

```html
<u-fab>
  <span class="material-symbols-outlined">edit</span>
</u-fab>
```

Colors: `primary` (default), `secondary`, `tertiary`, `surface`, `branded`.
Sizes: `small`, `medium` (default), `large`.

Extended FAB (with label):

```html
<u-fab label="Compose">
  <span class="material-symbols-outlined">edit</span>
</u-fab>
```

Lowered elevation:

```html
<u-fab lowered>
  <span class="material-symbols-outlined">add</span>
</u-fab>
```

## Positioning

Inside a `<u-scaffold>`, drop the FAB in the `fab` slot — it's anchored to the scaffold's bottom-right with the correct M3 16dp gap, and offsets above the navigation bar automatically:

```html
<u-scaffold>
  <!-- … top-bar, content, bottom-bar … -->
  <u-fab slot="fab" color="primary">
    <span class="material-symbols-outlined">edit</span>
  </u-fab>
</u-scaffold>
```

For ad-hoc placement, wrap the FAB in a positioned container.

## `<u-fab-menu>` — speed-dial

A FAB that toggles into multiple `<u-fab-menu-item>`s when clicked:

```html
<u-fab-menu color="primary">
  <span class="material-symbols-outlined" slot="icon">add</span>

  <u-fab-menu-item label="New doc">
    <span class="material-symbols-outlined">description</span>
  </u-fab-menu-item>
  <u-fab-menu-item label="New folder">
    <span class="material-symbols-outlined">folder</span>
  </u-fab-menu-item>
  <u-fab-menu-item label="Upload">
    <span class="material-symbols-outlined">upload</span>
  </u-fab-menu-item>
</u-fab-menu>
```

Slots on `<u-fab-menu>`:
- `icon` — the closed-state icon (e.g. `add`),
- `close-icon` — the open-state icon (defaults to an "×").

The toggle FAB animates between the two icons; menu items animate in/out around it.

## Caveats

- `<u-fab-menu>` keeps `pointer-events: none` on its host so the invisible menu-items area (when closed) passes clicks through to whatever is behind it. Don't blanket-override slotted children with `pointer-events: auto`.
- When slotted into `<u-scaffold>` the scaffold neutralizes the FAB menu's internal `--u-fab-menu-toggle-margin` so the visible toggle aligns with the wrapper box (otherwise it would sit too close to the bottom bar).
- A FAB does not auto-react to scroll yet — the `scrollContainer` attribute is reserved for future hide-on-scroll behavior.
