---
description: Configure the app's Material 3 color theme via ThemeBuilder — seed color, dark mode, custom colors.
---

# Theming

Use this when the user wants to set the app's primary color, switch dark/light mode, or customize Material 3 color tokens.

## Seeding a theme from a single source color

`ThemeBuilder.create(seed)` derives an entire M3 color palette (primary, secondary, tertiary, surface, etc.) from one hex color:

```ts
import { ThemeBuilder } from '@universal-material/web';

const css = ThemeBuilder.create('#4f46e5').build();

const style = document.createElement('style');
style.id = 'theme-styles';
style.textContent = css;
document.head.appendChild(style);
```

The generated CSS sets variables on `:root` like `--u-color-primary`, `--u-color-on-primary`, `--u-color-secondary-container`, etc. Every component reads from these.

## Reacting to a new color at runtime

```ts
function setTheme(hex: string): void {
  const css = ThemeBuilder.create(hex).build();
  document.getElementById('theme-styles')!.textContent = css;
}
```

## Dark mode

`ThemeBuilder` emits both light and dark variants under `prefers-color-scheme`. To force dark mode, set the `theme` attribute on `<html>` (or a CSS class) and use the matching tokens:

```ts
document.documentElement.setAttribute('theme', 'dark');
```

If the app needs a "system / light / dark" toggle, store the preference and apply it imperatively.

## Reading current token values

```ts
const primary = getComputedStyle(document.documentElement)
  .getPropertyValue('--u-color-primary').trim();
```

This is useful when integrating non-component visuals (charts, illustrations) that need to follow the theme.

## Overriding individual tokens

You can override any token after the generated theme by setting the variable yourself:

```css
:root {
  --u-color-primary: #2e7d32;            /* override seed-derived primary */
  --u-shape-corner-large: 24px;          /* tune shape tokens */
  --u-top-app-bar-container-color: transparent; /* component-specific */
}
```

## Caveats

- Call `ThemeBuilder` once at boot, before the first paint, to avoid a flash of unstyled colors.
- The library reads tokens via CSS variables, so changing them at runtime updates every component live — no re-render needed.
- Do **not** hardcode hex values in component CSS — always reference tokens (`var(--u-color-primary)`) so the theme controls the look.
