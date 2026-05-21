---
description: Use Material 3 common buttons — u-button (filled, tonal, elevated, outlined, text), u-icon-button, u-button-set for grouping.
---

# Common buttons

## `<u-button>` — text + optional icon

Five variants (`filled` default, `tonal`, `elevated`, `outlined`, `text`) and four colors (`primary` default, `secondary`, `tertiary`, `error`):

```html
<u-button>Save</u-button>
<u-button variant="tonal">Save</u-button>
<u-button variant="elevated">Save</u-button>
<u-button variant="outlined">Save</u-button>
<u-button variant="text">Save</u-button>

<u-button color="error">Delete</u-button>
```

With an icon (default position: before the label):

```html
<u-button>
  <span class="material-symbols-outlined" slot="icon">save</span>
  Save
</u-button>
```

Trailing icon:

```html
<u-button trailing-icon>
  Open
  <span class="material-symbols-outlined" slot="icon">arrow_outward</span>
</u-button>
```

## Sizes and shapes

```html
<u-button size="extra-small">XS</u-button>
<u-button size="small">S</u-button>
<u-button size="medium">M</u-button>
<u-button size="large">L</u-button>
<u-button size="extra-large">XL</u-button>

<u-button shape="square">Square</u-button>
<u-button shape="round">Round (default)</u-button>
```

## Toggling

```html
<u-button toggle [selected]="favorited" (change)="favorited = $event.target.selected">
  <span class="material-symbols-outlined" slot="icon">favorite_border</span>
  <span class="material-symbols-outlined" slot="icon-selected">favorite</span>
  Favorite
</u-button>
```

Use `toggle-shape` to morph between `round` and `square` when toggled.

## Forms

`<u-button>` is form-associated. It submits the parent `<form>` by default (`type="submit"`). Override with `type="button"` or `type="reset"`.

## `<u-icon-button>` — icon only

```html
<u-icon-button>
  <span class="material-symbols-outlined">favorite</span>
</u-icon-button>

<u-icon-button variant="filled" color="primary">
  <span class="material-symbols-outlined">add</span>
</u-icon-button>
```

Variants: `standard` (default), `filled`, `tonal`, `outlined`. Widths: `default`, `narrow`, `wide`.

For toggle icon buttons, use the `selected` slot for the "active" icon:

```html
<u-icon-button toggle>
  <span class="material-symbols-outlined">favorite_border</span>
  <span class="material-symbols-outlined" slot="selected">favorite</span>
</u-icon-button>
```

## `<u-button-set>` — grouping

Standardizes spacing and alignment for a row of action buttons. Default alignment is `end` (right-aligned), which matches dialog/form action rows.

```html
<u-button-set>
  <u-button variant="text">Cancel</u-button>
  <u-button>Save</u-button>
</u-button-set>

<u-button-set alignment="start">…</u-button-set>
<u-button-set alignment="center">…</u-button-set>
<u-button-set alignment="end">…</u-button-set>

<u-button-set stack>
  <u-button>Continue</u-button>
  <u-button variant="outlined">Sign in instead</u-button>
  <u-button variant="text">Cancel</u-button>
</u-button-set>
```

## Caveats

- For alignment to be visible the button-set must have available width. In a flex-row parent that's content-sized, set `width: 100%` or a fixed width on the button-set.
- A button-set accepts any button-like child (`<u-button>`, `<u-icon-button>`, `<u-fab>`) and aligns them on the same baseline.
