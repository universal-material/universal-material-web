---
description: Build an autocomplete / typeahead with u-typeahead — async option fetching, object results, custom item templates, highlight matches.
---

# Typeahead

`<u-typeahead>` is a text field that opens a popover of suggestions as the user types. Suggestions are supplied by you — synchronous or async — and can be plain strings or arbitrary objects.

## Simple string suggestions

```html
<u-typeahead label="Country" #t></u-typeahead>

<script>
  const countries = ['Argentina', 'Brazil', 'Chile', 'Spain', 'United States'];
  document.querySelector('u-typeahead').optionsProvider = (query) =>
    countries.filter(c => c.toLowerCase().includes(query.toLowerCase()));
</script>
```

`optionsProvider` is called whenever the input changes; return an array (or a `Promise<Array>`).

## Object results with custom templates

```html
<u-typeahead label="User" #t>
  <template slot="option">
    <div style="display: flex; align-items: center; gap: 8px">
      <img src="{{ avatar }}" width="24" height="24" style="border-radius: 50%" />
      <span>{{ name }}</span>
      <span class="u-label-s u-text-low-emphasis">{{ email }}</span>
    </div>
  </template>
</u-typeahead>

<script>
  document.querySelector('u-typeahead').optionsProvider = async (q) => {
    const r = await fetch(`/api/users?q=${encodeURIComponent(q)}`);
    return await r.json(); // [{ id, name, email, avatar }]
  };

  // Tell the typeahead which field is the displayed label
  document.querySelector('u-typeahead').labelField = 'name';
</script>
```

## Highlighting matched text

```html
<u-typeahead label="Country">
  <template slot="option">
    <u-highlight [text]="$option.name" [match]="$query"></u-highlight>
  </template>
</u-typeahead>
```

`<u-highlight>` wraps the matched substring of the query in a styled span — useful for showing why a suggestion is in the list.

## Selection

```ts
const ta = document.querySelector('u-typeahead')!;
ta.addEventListener('select', (e: CustomEvent) => {
  console.log('Selected:', e.detail); // the chosen option (string or object)
});
```

For multi-select with chips, use `<u-chip-field>` with a `<u-typeahead>` driving suggestions.

## Positioning inside clipped containers

Set `positioning="fixed"` on the typeahead so the suggestion list escapes any `overflow:hidden` wrapper:

```html
<u-typeahead positioning="fixed" label="Search">…</u-typeahead>
```

## Caveats

- `optionsProvider` is called on every keystroke — debounce the network in your provider (`setTimeout` + `AbortController`) for large remote datasets.
- When using object results, set `labelField` to the property used as the displayed label, or render it explicitly via the `option` template.
- The component does not de-duplicate options — if your data has duplicates, dedupe in the provider.
