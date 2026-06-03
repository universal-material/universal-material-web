---
description: Use u-tab-bar and u-tab for horizontally arranged content tabs with an animated underline indicator.
---

# Tab bar

`<u-tab-bar>` groups a row of `<u-tab>`s and animates an underline indicator under the active tab.

## Basic

```html
<u-tab-bar>
  <u-tab active>Overview</u-tab>
  <u-tab>Activity</u-tab>
  <u-tab>Files</u-tab>
  <u-tab>Members</u-tab>
</u-tab-bar>
```

## Tracking the selected tab

The bar fires a **`change`** event on user selection and exposes **`activeTabIndex`** / **`activeTab`** (read + write). Use these to switch the body view — more robust than reading `click` + `textContent`:

```ts
const bar = document.querySelector('u-tab-bar')!;
bar.addEventListener('change', () => {
  showPanel(bar.activeTabIndex);   // 0-based index of the selected tab
});

bar.activeTabIndex = 2;            // select programmatically (does NOT fire `change`)
```

There's also a cancelable `changing` event — call `preventDefault()` to block the switch. (`variant="primary" | "secondary"` chooses the indicator style.)

## With icons

```html
<u-tab-bar>
  <u-tab active>
    <span class="material-symbols-outlined" slot="icon">home</span>
    Home
  </u-tab>
  <u-tab>
    <span class="material-symbols-outlined" slot="icon">search</span>
    Search
  </u-tab>
</u-tab-bar>
```

## Caveats

- The bar is meant for **content** tabs (switching the body view). For top-level navigation between pages, use `<u-navigation-bar>` (mobile) or `<u-drawer>` items.
- `active` in markup sets the **initial** selection — put it on any `<u-tab>` (`<u-tab active>` on the second tab starts there). With no `active`, the first tab is selected. `tab.active` is read-only at runtime (derived from `bar.activeTab`); switch with `bar.activeTabIndex = n`.
- Don't manually toggle `active` on multiple tabs at once — only one should be active. The bar enforces this on click but not on attribute writes.
- The underline indicator animates between tabs via CSS. If you toggle `active` programmatically very fast, the indicator may skip frames.
