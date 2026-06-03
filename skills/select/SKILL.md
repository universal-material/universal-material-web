---
description: Use u-select — a Material 3 dropdown built on the field chrome, with u-option children, supporting text and validation.
---

# Select

`<u-select>` is a form-associated dropdown that opens a `<u-menu>` of `<u-option>` children. It shares the field chrome with `<u-text-field>` (label, supporting/error text, leading/trailing icons).

## Basic usage

```html
<u-select label="Country">
  <u-option value="br">Brazil</u-option>
  <u-option value="us">United States</u-option>
  <u-option value="es">Spain</u-option>
  <u-option value="jp">Japan</u-option>
</u-select>
```

## Variants and helpers

```html
<u-select label="Country" variant="outlined" supporting-text="Pick where you live">
  …
</u-select>

<u-select label="Country" error-text="Required" invalid>
  …
</u-select>
```

## Programmatic value

```ts
const select = document.querySelector('u-select')!;
select.value = 'br';        // set
console.log(select.value);  // get

select.addEventListener('change', () => console.log(select.value));
```

In Angular, bind with `[(ngModel)]` and `ngDefaultControl`; in React, use `value` + `onChange`.

## Initial selection (in markup)

The `value` **attribute is inert** — `<u-select value="br">` does nothing and the select shows the first option. Set the initial selection with `selected` on the option (or assign `.value` in JS after upgrade):

```html
<u-select label="Country">
  <u-option value="br" selected>Brazil</u-option>
  <u-option value="us">United States</u-option>
</u-select>
```

## Icons in options

```html
<u-select label="Theme">
  <u-option value="auto">
    <span class="material-symbols-outlined" slot="icon">brightness_4</span>
    System
  </u-option>
  <u-option value="light">
    <span class="material-symbols-outlined" slot="icon">light_mode</span>
    Light
  </u-option>
  <u-option value="dark">
    <span class="material-symbols-outlined" slot="icon">dark_mode</span>
    Dark
  </u-option>
</u-select>
```

## Positioning inside clipped containers

When the select sits inside a scrollable/clipped wrapper, set `menu-positioning="fixed"` so the dropdown escapes its bounds:

```html
<u-select label="Country" menu-positioning="fixed">…</u-select>
```

## Disabled / read-only

```html
<u-select label="Country" disabled>…</u-select>
<u-select label="Country" readOnly>…</u-select>
```

## When NOT to use `<u-select>`

- Free-text input with suggestions → use `<u-typeahead>`.
- Multi-select chip input → use `<u-chip-field>`.
- A non-form action menu (Edit/Delete/Share) → use `<u-button>` + `<u-menu>` directly.

## Caveats

- The displayed value is the matching `<u-option>`'s text content. Keep option text concise. **An icon inside an option** (`<span slot="icon">`) shows in the dropdown but its ligature text leaks into the *closed* select's displayed value (e.g. "groups Todos") — omit option icons when the value is shown as text.
- **Single-select only** — there is no `multiple` attribute. For multiple values use `<u-chip-field>`.
- **No constraint validation**: `required` is not enforced and there is no `checkValidity()`/`reportValidity()` — validate in script / on submit.
- A page with several `<u-select>`s logs a harmless `_scheduleSync` / `_renderOptionRelatedElements` error on load (options upgrade before the select); the selects still render and work.
- For long lists, the menu virtualizes after a threshold but very large lists (1000+) feel sluggish — consider a typeahead instead.
- Don't put non-`u-option` children inside `<u-select>` — they're ignored.
