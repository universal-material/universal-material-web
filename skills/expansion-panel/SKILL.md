---
description: Use u-expansion-panel for collapsible sections; wrap in u-expansion-panel-container for accordion behavior.
---

# Expansion panel

Collapsible surface with a clickable header (with ripple + chevron). Animates via the internal [[collapse]] component.

## Single panel

```html
<u-expansion-panel>
  <span slot="header">What is Material 3 Expressive?</span>
  <div style="padding: 0 1rem 1rem;">
    Material 3 Expressive is the latest iteration of Material Design.
  </div>
</u-expansion-panel>
```

## Accordion (exclusive)

Wrap multiple panels in `u-expansion-panel-container` — opening one closes the others.

```html
<u-expansion-panel-container>
  <u-expansion-panel>
    <span slot="header">Account</span>
    <div style="padding: 0 1rem 1rem;">Manage email, password, and connected services.</div>
  </u-expansion-panel>
  <u-expansion-panel>
    <span slot="header">Notifications</span>
    <div style="padding: 0 1rem 1rem;">Choose how and when you want to be notified.</div>
  </u-expansion-panel>
</u-expansion-panel-container>
```

## Multi (independent panels)

Add `multi` to keep multiple panels open simultaneously.

```html
<u-expansion-panel-container multi>
  <u-expansion-panel expanded>
    <span slot="header">Always-open</span>
    <div style="padding: 0 1rem 1rem;">Set <code>expanded</code> for the initial state.</div>
  </u-expansion-panel>
  <u-expansion-panel>
    <span slot="header">Independent</span>
    <div style="padding: 0 1rem 1rem;">Stays open when others open.</div>
  </u-expansion-panel>
</u-expansion-panel-container>
```

## Attributes

- `expanded` — current open state. Reflects to the attribute; dispatches `change` (bubbles, composed) when toggled.
- `disabled` — prevents toggling and silences the ripple.
- `hide-toggle` — hides the default chevron icon.
- `multi` (container) — allow multiple panels open at once.

## Caveats

- Put the header content in `slot="header"`. The default slot is the panel body (wrapped internally in `u-collapse`).
- The container coordinates panels via the `change` event bubbling out of each panel — works with panels added/removed dynamically.
- Sibling-close logic uses `querySelectorAll('u-expansion-panel')` against direct descendants of the container only — nested containers operate independently.
