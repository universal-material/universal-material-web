---
description: Use u-search — the Material 3 search bar (rounded input with leading/trailing icon slots), optionally driven by u-typeahead for suggestions.
---

# Search

`<u-search>` is the Material 3 **search bar**: a rounded, single-line input with leading/trailing icon slots. It is form-associated (`value`, submits its `<form>` on Enter) and is the idiomatic input to pair with `<u-typeahead>` for autocomplete.

Use it for a search box; use `<u-text-field>` for a labeled form field.

## Basic

```html
<u-search placeholder="Search">
  <span class="material-symbols-outlined" slot="leading-icon">search</span>
</u-search>
```

Slots: `leading-icon`, `trailing-icon` (e.g. a clear/voice button). Parts: `input`, `icon` / `leading` / `trailing`.

## Position

```html
<u-search position="static"></u-search>    <!-- in-flow, inline (toolbar / pane header) -->
<u-search position="fixed"></u-search>     <!-- floating bar (default) -->
<u-search position="absolute"></u-search>
```

`position` defaults to **`fixed`** (the floating M3 search bar). For a search input that sits inline in a header/toolbar, use `position="static"`.

## Reading the value

```ts
const search = document.querySelector('u-search')!;
search.value;                               // current text (form-associated)
search.addEventListener('input', () => …);  // fires as the user types
// Enter submits the associated <form> (form.requestSubmit()).
```

Other props: `placeholder`, `autocomplete`, `maxlength`, `role`.

## With suggestions (`u-typeahead`)

`<u-search>` is the idiomatic target for `<u-typeahead>` — the suggestions popover anchors to the search input:

```html
<u-search id="q" position="static" placeholder="Search clients">
  <span class="material-symbols-outlined" slot="leading-icon">search</span>
</u-search>
<u-typeahead target-id="q" positioning="fixed"></u-typeahead>

<script>
  const ta = document.querySelector('u-typeahead');
  ta.source = (term) => clients.filter((c) => c.name.toLowerCase().includes(term.toLowerCase()));
  ta.formatter = (c) => c.name;
  ta.addEventListener('selected', (e) => openClient(e.detail));
</script>
```

See the **typeahead** skill for the full suggestions API.

## Caveats

- It's a search **bar**, not a labeled field — use `placeholder`; there is no floating label. For a labeled form input use `<u-text-field>`.
- Default `position` is `fixed` (floating). Set `position="static"` to keep it inline in a header/toolbar.
