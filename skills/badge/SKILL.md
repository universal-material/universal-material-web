---
description: Show a u-badge — a small count or status dot. Floating over an icon by default, or `static` for an inline count next to text.
---

# Badge

`<u-badge>` is a small count/dot with two modes.

## Floating (default) — over an icon

By default the badge is **absolutely positioned**, dotting the top-right corner of its nearest positioned ancestor (usually an icon). Put it inside the icon, or in a component's `badge` slot:

```html
<!-- over an icon button -->
<u-icon-button aria-label="Notifications">
  <span class="material-symbols-outlined">notifications<u-badge>3</u-badge></span>
</u-icon-button>

<!-- nav-bar / nav-rail item: the `badge` slot floats over the item's icon -->
<u-navigation-bar-item>
  <span class="material-symbols-outlined" slot="icon">inbox</span>
  Inbox
  <u-badge slot="badge">12</u-badge>
</u-navigation-bar-item>
```

An empty `<u-badge></u-badge>` renders a small **dot** (no number).

## `static` — inline count next to text

Add `static` to render the badge **in flow** (not floating) — for a count chip beside a heading or label:

```html
<div class="flex items-center gap-2">
  <span class="u-title-l">Alerts</span>
  <u-badge static>3</u-badge>
</div>
```

## Caveats

- **Don't put a floating `<u-badge>` in a `<u-drawer-item>`'s `badge` slot** — there the badge must sit inline at the row's trailing edge, so use a plain `<span slot="badge">12</span>` (the drawer item styles it). A floating `<u-badge>` would position absolutely and land in the wrong place. (Nav-rail / nav-bar items are the opposite — their `badge` slot *does* take a floating `<u-badge>`, since it overlays the icon.)
- The floating badge anchors to the nearest positioned ancestor (the icon/button provides one). For an inline count next to plain text, use `static`.
