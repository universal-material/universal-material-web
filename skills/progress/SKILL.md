---
description: Show determinate or indeterminate progress — u-progress-bar (linear) and u-circular-progress (ring).
---

# Progress indicators

Two components share the same value API: `<u-progress-bar>` (linear, M3 4dp track) and `<u-circular-progress>` (ring).

## Determinate

`value` is a number; `max` defaults to `1`. So `value` is a fraction `0–1`, or pass a `max`:

```html
<u-progress-bar value="0.81"></u-progress-bar>           <!-- 81% -->
<u-progress-bar value="81" max="100"></u-progress-bar>   <!-- same -->

<u-circular-progress value="0.66"></u-circular-progress>
```

## Indeterminate

Omit `value` (or set it to `undefined`) for the looping animation:

```html
<u-progress-bar></u-progress-bar>
<u-circular-progress></u-circular-progress>
```

## Setting value from JS

```ts
const bar = document.querySelector('u-progress-bar')!;
bar.value = 0.4;        // determinate
bar.value = undefined;  // back to indeterminate
```

## Sizing & color (tokens)

- **`<u-progress-bar>` is not full-width by default** — give it `display: block` (or a width) to span its container:
  ```html
  <u-progress-bar value="0.5" style="display: block"></u-progress-bar>
  ```
- **`<u-circular-progress>`** size via `--u-circular-progress-size` (default `3rem`):
  ```html
  <u-circular-progress value="0.81" style="--u-circular-progress-size: 96px"></u-circular-progress>
  ```
  Arc color `--u-circular-progress-color` (default `primary`); track `--u-circular-progress-track-color` (default `secondary-container`).

## Centered label in a ring (gauge)

Wrap the ring in a `position: relative` box and absolutely-center the label:

```html
<div style="position: relative; width: 96px; height: 96px">
  <u-circular-progress value="0.81" style="--u-circular-progress-size: 96px"></u-circular-progress>
  <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center">81%</div>
</div>
```

## Caveats

- Determinate values are rounded (~2 decimals circular / 1 decimal bar) — sub-pixel differences won't render.
- Use indeterminate for unknown-duration waits; determinate when you can compute the fraction.
