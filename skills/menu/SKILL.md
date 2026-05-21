---
description: Open contextual menus — u-menu and u-menu-item for popovers anchored to a trigger, plus u-overflow-menu for action bars that auto-collapse on narrow widths.
---

# Menus

## `<u-menu>` + `<u-menu-item>` — popover

A floating surface anchored to a trigger. Open with `.show()`/`.toggle()`/`.close()` (or by setting `open`):

```html
<u-icon-button (click)="menu.toggle()">
  <span class="material-symbols-outlined">more_vert</span>
</u-icon-button>

<u-menu #menu>
  <u-menu-item>
    <span class="material-symbols-outlined" slot="leading-icon">edit</span>
    Edit
  </u-menu-item>
  <u-menu-item>
    <span class="material-symbols-outlined" slot="leading-icon">content_copy</span>
    Duplicate
  </u-menu-item>
  <u-menu-item>
    <span class="material-symbols-outlined" slot="leading-icon">delete</span>
    Delete
  </u-menu-item>
</u-menu>
```

By default the menu anchors to its parent element. Set `anchorElement` explicitly when needed:

```ts
menu.anchorElement = triggerButton;
```

## Positioning

- **`anchor-corner`** — which corner of the anchor the menu attaches to. Supports `start-start`, `start-end`, `end-start`, `end-end`, plus `auto-start` / `auto-end` (auto picks top vs bottom based on space).
- **`direction`** — which way the menu grows: `up-start`, `up-end`, `down-start`, `down-end` (default).

For a dropdown right under the trigger, the defaults work. For a "more" menu in a top app bar, use `anchor-corner="end-end"`:

```html
<u-menu anchor-corner="end-end" direction="down-start">…</u-menu>
```

## Clipped containers

If the menu lives inside a `overflow: hidden` or scrollable wrapper, set `positioning="fixed"` so it escapes:

```html
<u-menu positioning="fixed">…</u-menu>
```

## Auto-close

- `autoclose="outside"` (default-ish) — closes on outside clicks but not on clicks inside the menu.
- `autoclose="true"` — closes on any click anywhere.
- `autoclose="false"` — never auto-closes; you manage it.

## `<u-overflow-menu>` — responsive action bar

A horizontal row of `<u-overflow-menu-item>`s that automatically collapses items into a "more" menu when there isn't enough horizontal space:

```html
<u-overflow-menu>
  <u-overflow-menu-item label="Bold">
    <span class="material-symbols-outlined">format_bold</span>
  </u-overflow-menu-item>
  <u-overflow-menu-item label="Italic">
    <span class="material-symbols-outlined">format_italic</span>
  </u-overflow-menu-item>
  <u-overflow-menu-item label="Underline">
    <span class="material-symbols-outlined">format_underlined</span>
  </u-overflow-menu-item>
  <u-overflow-menu-item label="Strikethrough">
    <span class="material-symbols-outlined">format_strikethrough</span>
  </u-overflow-menu-item>

  <!-- Items marked collapse="always" never render inline -->
  <u-overflow-menu-item label="Delete" collapse="always">
    <span class="material-symbols-outlined">delete</span>
  </u-overflow-menu-item>
</u-overflow-menu>
```

Inside a clipped wrapper (e.g. a card with `overflow: hidden`), set `menuPositioning="fixed"` so the popover can escape:

```html
<u-overflow-menu menuPositioning="fixed">…</u-overflow-menu>
```

## Caveats

- A `<u-menu>` is not modal — it doesn't trap focus or scrim the background. Use `<u-dialog>` for modal flows.
- The overflow menu watches its anchor size with a `ResizeObserver`. If you swap the anchor or animate the container, it re-runs the layout pass automatically.
- `manualFocus` on `<u-menu>` disables the default auto-focus of the first item on open — useful when the menu wraps a calendar or other custom popover content.
