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

## Click handling

Each `<u-tab>` emits `click`; the bar handles toggling `active` on the clicked tab and clearing it from siblings:

```ts
const bar = document.querySelector('u-tab-bar')!;
bar.addEventListener('click', (e) => {
  const tab = (e.target as HTMLElement).closest('u-tab');
  if (tab) {
    console.log('Selected:', tab.textContent?.trim());
  }
});
```

In a framework, bind `[active]="route === 'overview'"` on each tab and switch the view on click.

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
- Don't manually toggle `active` on multiple tabs at once — only one should be active. The bar enforces this on click but not on attribute writes.
- The underline indicator animates between tabs via CSS. If you toggle `active` programmatically very fast, the indicator may skip frames.
