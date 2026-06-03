---
description: Build an autocomplete / typeahead with u-typeahead — a controller attached to a text field via target-id, with sync/async sources, object results, custom item templates, and match highlighting.
---

# Typeahead

`<u-typeahead>` is **not** a field — it's a controller that attaches to a separate input (`<u-text-field>` or a native input) and opens a popover of suggestions as the user types. You give it a `source`; it renders the dropdown and emits a `selected` event.

> **Key shape (easy to get wrong):** the typeahead has no label/field of its own. Pair it with a field via `target-id`. A standalone `<u-typeahead label="…">` renders nothing.

## Simple string suggestions

```html
<u-text-field id="country-input" label="Country"></u-text-field>
<u-typeahead target-id="country-input"></u-typeahead>

<script>
  const countries = ['Argentina', 'Brazil', 'Chile', 'Spain', 'United States'];
  const ta = document.querySelector('u-typeahead');
  // `source` = an array, or a (term) => Array | Promise<Array>
  ta.source = (term) => countries.filter(c => c.toLowerCase().includes(term.toLowerCase()));
</script>
```

When `source` is a plain array, the component filters it internally by case-insensitive substring. When it's a function, you do the filtering and may return a `Promise`.

## Attaching to any input (`target-id`)

`target-id` can point to **any** input — not only `<u-text-field>`. The typeahead reads `target.input?.value ?? target.value` and listens for the target's `input` event, so it works with:

- `<u-search>` — the M3 search bar; this is the **idiomatic pairing** (the popover anchors to its input). See the **search** skill.
- `<u-text-field>` / `<u-text-area>`.
- `<u-chip-field>` — multi-select chips.
- a plain native `<input>`, or any element from **another library** that exposes a `.value` and fires an `input` event.

```html
<u-search id="q" position="static"><span class="material-symbols-outlined" slot="leading-icon">search</span></u-search>
<u-typeahead target-id="q"></u-typeahead>

<!-- a native input (or a non-u-* component) works too -->
<input id="q2" />
<u-typeahead target-id="q2"></u-typeahead>
```

The popover anchors to the target's natural box: the search / text-field's inner input or container, or the bare element for a native input.

## Object results + label mapping

```html
<u-text-field id="user-input" label="User"></u-text-field>
<u-typeahead target-id="user-input"></u-typeahead>

<script>
  const ta = document.querySelector('u-typeahead');
  ta.source = async (term) => {
    const r = await fetch(`/api/users?q=${encodeURIComponent(term)}`);
    return await r.json(); // [{ id, name, email }]
  };
  // `formatter` maps an object value to the displayed string (input + default option label)
  ta.formatter = (u) => u.name;
</script>
```

## Custom option rendering

`template` is a **function** returning a string / `HTMLElement` / Lit `TemplateResult` per option (not a `<template>` element):

```js
import { html } from 'lit';
ta.template = (term, user) => html`
  <div style="display:flex; align-items:center; gap:8px">
    <span>${user.name}</span>
    <span class="u-label-s u-text-low-emphasis">${user.email}</span>
  </div>`;
```

`<u-highlight text="..." match="...">` wraps the matched substring of the query in a styled span — useful inside a template to show why a suggestion matched.

## Selection

```ts
const ta = document.querySelector('u-typeahead')!;
ta.addEventListener('selected', (e: CustomEvent) => {
  console.log('Selected:', e.detail); // the chosen value (string or object)
});
```

The event is **`selected`** (cancelable; `e.detail` is the value). There is no `select` event.

## Useful properties / attributes

| Name | Default | Purpose |
| --- | --- | --- |
| `target-id` | — | **Required.** Id of the input/field the typeahead drives. |
| `source` (prop) | — | Array, or `(term) => Array \| Promise<Array>`. |
| `formatter` (prop) | `String(value)` | Maps an object value to its displayed label. |
| `template` (prop) | — | `(term, value) => string \| HTMLElement \| TemplateResult` per option. |
| `minlength` | `2` | Min chars before suggestions show. **Array sources show nothing until 2 chars** unless lowered. |
| `debounce` | `300` (ms) | Debounce before `source` is called. |
| `limit` | — | Max options shown. |
| `open-on-focus` | off | Open the popover on focus (before typing). |
| `editable` | — | Allow free text alongside suggestions. |
| `positioning="fixed"` | — | Let the popover escape an `overflow:hidden`/scroll wrapper. |
| `clear()` (method) | — | Clear the current value. |

For multi-select with chips, drive a `<u-chip-field>` from a typeahead instead.

## Caveats

- **No `optionsProvider` / `labelField` / `select`.** Those don't exist — use `source` / `formatter` / the `selected` event. A standalone `<u-typeahead label="…">` (no `target-id`) renders nothing.
- `source` is called on every keystroke (after `debounce`) — for remote data, abort in-flight requests (`AbortController`).
- The component does not de-duplicate — dedupe in your `source`.
- `positioning="fixed"` is needed inside a `<u-scaffold>`'s scrolling `<main>`.
