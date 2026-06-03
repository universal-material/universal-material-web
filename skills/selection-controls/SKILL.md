---
description: Use u-checkbox, u-radio, u-switch — and their u-*-list-item variants for selection lists.
---

# Selection controls — checkbox, radio, switch

All three are form-associated and share API conventions: `checked`, `disabled`, `value`, `name`, plus a `change` event.

## Checkbox

```html
<u-checkbox></u-checkbox>
<u-checkbox checked></u-checkbox>
<u-checkbox indeterminate></u-checkbox>
<u-checkbox disabled></u-checkbox>
```

With a label, either inline or via `<u-checkbox-list-item>`:

```html
<label class="flex items-center gap-2">
  <u-checkbox></u-checkbox>
  Subscribe to newsletter
</label>
```

## Radio

```html
<u-radio name="color" value="red"></u-radio>
<u-radio name="color" value="green" checked></u-radio>
<u-radio name="color" value="blue"></u-radio>
```

`name` groups them — only one in a group can be checked. Listen on each, or use a wrapping `<form>` and read `FormData`.

## Switch

```html
<u-switch></u-switch>
<u-switch checked></u-switch>
<u-switch disabled></u-switch>
```

Same API as the checkbox.

## List-item variants

For settings screens with rows of controls, use the `u-*-list-item` components — they render a `<u-list-item>` with the control on the trailing side and a label/supporting-text on the leading side. Drop them inside a `<u-list>`:

```html
<u-list>
  <u-switch-list-item checked>
    Wi-Fi
    <span slot="supporting-text">Connected to "Office"</span>
  </u-switch-list-item>

  <u-switch-list-item>
    Bluetooth
    <span slot="supporting-text">Off</span>
  </u-switch-list-item>

  <u-checkbox-list-item>
    Show passwords
  </u-checkbox-list-item>

  <u-radio-list-item name="theme" value="light">Light</u-radio-list-item>
  <u-radio-list-item name="theme" value="dark" checked>Dark</u-radio-list-item>
</u-list>
```

The list items handle the click on the whole row (toggling the control), the ripple, and the spacing.

## Programmatic

```ts
const cb = document.querySelector('u-checkbox')!;
cb.checked = true;
cb.addEventListener('change', () => console.log(cb.checked));
```

## Caveats

- `<u-checkbox>` and `<u-switch>` emit `change` on every toggle; `<u-radio>` emits `change` only on the newly-selected radio in a group (not on deselected siblings).
- `indeterminate` is visual only — `checked` still reads the underlying boolean. For **dynamically-built DOM** (innerHTML / generated rows) set it via the **property** after upgrade (`cb.indeterminate = true`), not the markup attribute. Setting `checked = true` clears `indeterminate`.
- `change` **bubbles**, so you can delegate it on an ancestor (e.g. a `<tbody>`) for bulk-selection — `wrapper.addEventListener('change', e => e.target.closest('u-checkbox') && …)` works.
- For groups of switches/checkboxes in settings, prefer the `*-list-item` variants — they're keyboard-accessible across the whole row and follow the M3 list spec.
