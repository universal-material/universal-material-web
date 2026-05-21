---
description: Use u-chip, u-chip-set (groups), and u-chip-field (chip input) — including toggle vs clickable semantics for selectors.
---

# Chips

Three pieces:
- `<u-chip>` — a compact element representing an attribute, filter, or action.
- `<u-chip-set>` — groups chips with consistent spacing/wrapping.
- `<u-chip-field>` — text field that renders each entered value as a chip.

## Single chip

```html
<u-chip>Default</u-chip>

<u-chip>
  <span class="material-symbols-outlined" slot="leading-icon">label</span>
  With icon
</u-chip>

<u-chip elevated>Elevated</u-chip>

<u-chip removable (remove)="onRemove($event)">Removable</u-chip>
```

## Selection: `clickable` vs `toggle`

This distinction matters and is easy to get wrong:

- **`clickable`** — chip fires `click` and shows ripple/hover. Use for **radio-like** patterns: combine with `[selected]="x === value"` + `(click)="x = value"` so one is always selected.
- **`toggle`** — chip flips its own `selected` state on click and emits `change`. Use for **independent boolean filters** where multiple can be on/off.

Radio-like (one of several):

```html
<u-chip-set>
  <u-chip clickable [selected]="format === 'short'" (click)="format = 'short'">
    <span class="material-symbols-outlined" slot="icon-selected">done</span>
    Short
  </u-chip>
  <u-chip clickable [selected]="format === 'long'" (click)="format = 'long'">
    <span class="material-symbols-outlined" slot="icon-selected">done</span>
    Long
  </u-chip>
</u-chip-set>
```

Independent filters:

```html
<u-chip-set>
  <u-chip toggle [(selected)]="showImages">Images</u-chip>
  <u-chip toggle [(selected)]="showVideos">Videos</u-chip>
  <u-chip toggle [(selected)]="showAudio">Audio</u-chip>
</u-chip-set>
```

A plain `<u-chip>` (no `clickable`, no `toggle`) is a static informational chip — no ripple, no hover.

## `<u-chip-set>`

Spaces and wraps chips for you. No props needed for the basics.

## `<u-chip-field>` — chip input

A text field where each typed value (separated by Enter or comma) becomes a removable chip:

```html
<u-chip-field label="Tags" #tags></u-chip-field>

<script>
  document.querySelector('u-chip-field').value = ['ts', 'lit'];
  document.querySelector('u-chip-field').addEventListener('change', e => {
    console.log(e.target.value); // string[]
  });
</script>
```

For object-valued chips (e.g. typeahead-driven), set `.value` to `Array<{ value, label }>` and the field renders the label.

## Caveats

- Always include `<span slot="icon-selected">done</span>` on `clickable`/`toggle` chips so users see the check when selected.
- Don't use `toggle` for radio-like selectors — the user could deselect the only choice and the UI ends up in an invalid empty state.
- `<u-chip-field>` is form-associated; pair with a `<form>` for native submit.
