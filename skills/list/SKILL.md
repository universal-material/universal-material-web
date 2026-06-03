---
description: Render Material 3 lists — u-list + u-list-item, with leading icons, supporting text, badges and trailing actions.
---

# List

`<u-list>` is a vertical stack of `<u-list-item>`s. Each item supports leading and trailing slots, supporting text and selection states.

## Basic

```html
<u-list>
  <u-list-item>Inbox</u-list-item>
  <u-list-item>Drafts</u-list-item>
  <u-list-item>Sent</u-list-item>
</u-list>
```

## Two-line items with icons

```html
<u-list>
  <u-list-item>
    <span class="material-symbols-outlined" slot="leading-icon">person</span>
    Maria Andrade
    <span slot="supporting-text">maria@example.com</span>
  </u-list-item>

  <u-list-item>
    <span class="material-symbols-outlined" slot="leading-icon">person</span>
    Carlos Pereira
    <span slot="supporting-text">carlos@example.com</span>
  </u-list-item>
</u-list>
```

## Trailing content

```html
<u-list-item>
  <span class="material-symbols-outlined" slot="leading-icon">archive</span>
  Archive
  <u-icon-button slot="trailing-icon">
    <span class="material-symbols-outlined">chevron_right</span>
  </u-icon-button>
</u-list-item>
```

## Selectable rows

`selectable` adds the ripple + hover **state layer** so the row reads as interactive:

```html
<u-list>
  <u-list-item selectable onclick="…">One</u-list-item>
  <u-list-item selectable onclick="…">Two</u-list-item>
</u-list>
```

For a persistent **active / selected** highlight (e.g. the open row in a list-detail or mail list), use the **`selected`** attribute/property — it paints the M3 selected container (`secondary-container` / `on-secondary-container`):

```html
<u-list>
  <u-list-item selectable selected>One</u-list-item>
  <u-list-item selectable>Two</u-list-item>
</u-list>
<script>
  list.addEventListener('click', (e) => {
    const item = e.target.closest('u-list-item');
    if (!item) return;
    list.querySelectorAll('u-list-item[selected]').forEach((i) => (i.selected = false));
    item.selected = true;
  });
</script>
```

Override the selected colors per call site with `--u-list-item-selected-container-color` / `--u-list-item-selected-label-color`. For selection lists tied to a form value, use the dedicated `<u-checkbox-list-item>`, `<u-radio-list-item>`, or `<u-switch-list-item>` (see the **selection-controls** skill).

## Aligning a row flush (`no-inset`)

List items carry a 16dp inline inset, so their content sits indented from adjacent non-list content (section headings, paragraph labels). Add **`no-inset`** to pull the row flush — it cancels the inline padding with an equal negative inline margin, so the content lines up with the surrounding labels (the state layer bleeds to the container edges):

```html
<div class="u-title-s">Channels</div>
<u-list>
  <u-list-item no-inset>Email</u-list-item>
  <u-list-item no-inset>Push</u-list-item>
</u-list>
```

The `*-list-item` selection variants accept `no-inset` too (it's forwarded to their inner list item) — handy in settings sections where the row should line up with the heading.

## Three-line items

A second line of supporting text wraps automatically when content exceeds one line; for an explicitly tall three-line variant, use multiple `<span slot="supporting-text">` lines.

## Dividers and sections

For grouped lists with headlines, mix `<u-drawer-headline>`-style elements between groups, or use the `card`/`outlined-card` containers around each section.

## Caveats

- `<u-list-item>` slots accept any node — keep leading/trailing icons inside `<span class="material-symbols-outlined">` or `<u-icon-button>` for consistent sizing.
- `<u-list>` is unopinionated about scrolling. For long lists inside a constrained container, wrap the list in a `<div style="overflow:auto; max-height: …">`.
- For very long lists (1000+ items), the M3 list is fine but consider virtualization (`@lit-labs/virtualizer`).
