---
description: Overview of @universal-material/web — what's in the library and which skills cover each area.
---

# @universal-material/web — overview

Material Design 3 web components built with Lit. Custom elements with the `u-` prefix; class names match the tag without the prefix (`<u-button>` → `class Button`).

## What's inside

| Area | Components | Skill |
| --- | --- | --- |
| Bootstrap | install, fonts, theme | `setup`, `theming` |
| Layout | `<u-scaffold>` | `scaffold` |
| App bars | `<u-top-app-bar>`, `<u-navigation-bar>` | `top-app-bar`, `navigation-bar` |
| Navigation | `<u-side-navigation>`, `<u-drawer>` | `drawer` |
| Common buttons | `<u-button>`, `<u-icon-button>`, `<u-button-set>` | `buttons` |
| FAB | `<u-fab>`, `<u-fab-menu>` | `fab` |
| Dialogs | `<u-dialog>` + `Dialog.message/.confirm` | `dialog` |
| Text input | `<u-text-field>`, `<u-text-area>` | `text-field` |
| Select | `<u-select>`, `<u-option>` | `select` |
| Chips | `<u-chip>`, `<u-chip-set>`, `<u-chip-field>` | `chips` |
| Selection controls | `<u-checkbox>`, `<u-radio>`, `<u-switch>` + list-items | `selection-controls` |
| Date | `<u-datepicker>`, `<u-range-datepicker>`, `<u-calendar>` | `datepicker` |
| Menus | `<u-menu>`, `<u-menu-item>`, `<u-overflow-menu>` | `menu` |
| Lists | `<u-list>`, `<u-list-item>` | `list` |
| Tabs | `<u-tab-bar>`, `<u-tab>` | `tab-bar` |
| Feedback | `Snackbar.show` | `snackbar` |
| Progress | `<u-progress-bar>`, `<u-circular-progress>` | `progress` |
| Badge | `<u-badge>` | `badge` |
| Cards | `<u-card>`, `<u-card-content>`, `<u-card-media>` | `card` |
| Autocomplete | `<u-typeahead>`, `<u-highlight>` | `typeahead` |

## Core conventions

- Custom elements have the `u-` prefix; class names are unprefixed PascalCase (`<u-top-app-bar>` → `class TopAppBar`).
- Every component exposes its main inner boxes via `part` attributes — style externally with `::part(container)` etc.
- Theming is driven by CSS variables (`--u-color-primary`, ...). Use `ThemeBuilder.create(seedHex).build()` once at boot.
- Slot names match what they hold (`leading-icon`, `trailing-icon`, `headline`, `actions`, ...).
- Form-associated components participate in `<form>` submission natively.
- Major version follows Material spec version (M3 → `3.x`).

When unsure which skill to use, this overview maps it out.
