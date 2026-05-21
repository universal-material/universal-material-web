---
description: Use u-text-field and u-text-area for text input — filled/outlined variants, validation, supporting text, char counter, prefix/suffix slots.
---

# Text field & text area

Both `<u-text-field>` and `<u-text-area>` are form-associated, support M3 filled and outlined variants, and share the same field chrome (floating label, supporting text, error text, leading/trailing icons).

## Basic text field

```html
<u-text-field label="Name"></u-text-field>
<u-text-field label="Email" type="email" placeholder="you@example.com"></u-text-field>
<u-text-field label="Password" type="password"></u-text-field>
```

## Variants

```html
<u-text-field label="Filled (default)"></u-text-field>
<u-text-field label="Outlined" variant="outlined"></u-text-field>
```

Set a global default with `FieldBase.setDefaults(rootElement, { variant: 'outlined' })`.

## Icons

```html
<u-text-field label="Search">
  <span class="material-symbols-outlined" slot="leading-icon">search</span>
  <u-icon-button slot="trailing-icon" type="button">
    <span class="material-symbols-outlined">close</span>
  </u-icon-button>
</u-text-field>
```

## Prefix / suffix (text-field only)

```html
<u-text-field label="Amount" prefix-text="$" suffix-text="USD"></u-text-field>
```

## Supporting text, error text, char counter

```html
<u-text-field
  label="Bio"
  supporting-text="Tell us about yourself"
  [maxlength]="120">
</u-text-field>

<u-text-field
  label="Username"
  error-text="Already taken"
  invalid>
</u-text-field>
```

- `supporting-text` — small caption under the field.
- `error-text` + `invalid` — replaces the supporting text and tints the chrome red.
- `maxlength` — drives an automatic `N/MAX` counter.
- `hide-counter` — suppress the counter even when `maxlength` is set.

## Multi-line

`<u-text-area>` is the textarea equivalent; same API plus `rows`:

```html
<u-text-area label="Description" rows="4" maxlength="500"></u-text-area>
```

## Read-only / disabled

```html
<u-text-field label="ID" value="abc-123" readOnly></u-text-field>
<u-text-field label="Locked" disabled></u-text-field>
```

## Reading and writing the value

Form integration via `ElementInternals` — the field participates in `<form>` submission and `FormData`. From JS:

```ts
const field = document.querySelector('u-text-field')!;
field.value = 'hello';
console.log(field.value);

field.addEventListener('input', () => console.log(field.value));
```

## Caveats

- The placeholder is hidden visually while the field is empty AND not focused so it doesn't collide with the floating label. Don't fight this with custom CSS — that's the M3 behavior.
- For `type="date"` use `<u-datepicker>` (not `<u-text-field type="date">`) — the datepicker handles the calendar popover, the M3 chrome and the native browser-mask hiding.
- Wrap inside `<form>` for native submit; `Enter` in the input triggers `form.requestSubmit()` automatically.
