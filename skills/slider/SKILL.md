---
description: Use u-slider for single-thumb or two-thumb range value selection; wraps a native input[type=range] for keyboard, pointer, and form integration.
---

# Slider

Material 3 Expressive slider with optional tick marks, floating value label, and range mode. Form-associated — set `name` to participate in `<form>` submission.

## Continuous

```html
<u-slider min="0" max="100" value="40" aria-label="Volume"></u-slider>
```

## Discrete (ticks + value indicator while dragging)

The 44dp circular value indicator appears centered above the active handle while the user drags.

```html
<u-slider discrete min="0" max="10" step="1" value="6" aria-label="Rating"></u-slider>
```

**Use `discrete` only when the number of stops is small enough to see.** The number of ticks rendered is `(max - min) / step`. Above ~15-20 stops the ticks crowd together, the track turns into a solid bar of dots, and the value indicator becomes the only readable signal — at that point you should drop `discrete` and use a continuous slider instead.

Rule of thumb:
- ✅ `min="0" max="10" step="1"` — 10 stops, ticks readable
- ✅ `min="0" max="20" step="2"` — 10 stops
- ⚠️ `min="0" max="100" step="5"` — 20 stops, borderline
- ❌ `min="0" max="100" step="1"` — 100 stops, ticks become noise
- ❌ `min="0" max="12000" step="100"` — 120 stops, looks broken

For wide ranges where the **value** is what matters (price, MRR, score 0-100), use a continuous slider and render the current value separately:

```html
<u-slider id="preco" min="0" max="12000" step="100" value="3000" aria-label="Preço"></u-slider>
<span id="preco-label" class="u-label-l">R$ 3.000</span>

<script>
  const s = document.getElementById('preco');
  const l = document.getElementById('preco-label');
  s.addEventListener('input', () => l.textContent = `R$ ${Number(s.value).toLocaleString('pt-BR')}`);
</script>
```

Or use `slider.labelFormat` for the floating indicator (only visible while dragging — still helps for discrete sliders with ≤ ~15 stops, doesn't render the dense ticks):

```js
slider.labelFormat = (v) => `R$ ${v.toLocaleString('pt-BR')}`;
```

## Range (two thumbs)

Set both `value-start` and `value-end` to enable range mode automatically. The handles clamp to each other so `value-start` cannot exceed `value-end`.

```html
<u-slider min="0" max="100" value-start="25" value-end="75" aria-label="Price range"></u-slider>
```

## Sizes

Five M3 expressive size variants. The track height, handle height, state-layer size, and value-indicator typography scale together.

```html
<u-slider size="extra-small" value="40"></u-slider>
<u-slider size="small" value="40"></u-slider>
<u-slider size="medium" value="40"></u-slider>
<u-slider size="large" value="40"></u-slider>
<u-slider size="extra-large" value="40"></u-slider>
```

| size | track | handle | state-layer | typography |
| --- | --- | --- | --- | --- |
| `extra-small` (default) | 16dp | 4×44 | 40 | label-large |
| `small` | 24dp | 4×52 | 48 | label-large |
| `medium` | 40dp | 6×64 | 56 | title-medium |
| `large` | 56dp | 6×80 | 68 | title-medium |
| `extra-large` | 96dp | 8×120 | 96 | title-large |

## Form integration

```html
<form>
  <u-slider name="volume" min="0" max="100" value="40"></u-slider>
  <u-slider name="price" range value-start="20" value-end="80"></u-slider>
</form>
```

Range mode submits two entries: `price-start` and `price-end`.

## Events

- `input` — fires continuously while dragging (or on each keyboard step).
- `change` — fires on commit (pointer up, blur).

```ts
const slider = document.querySelector('u-slider')!;
slider.addEventListener('input', () => console.log(slider.value));
```

## Attributes

- `min`, `max`, `step` — value bounds. Use `step="0"` for fully continuous values.
- `value` — single-thumb mode.
- `value-start`, `value-end` — range mode.
- `range` — force range mode (auto-enabled when both `value-start` and `value-end` are present).
- `discrete` — show ticks + floating label while dragging.
- `ticks` — show ticks without enabling the label.
- `disabled` — disable interaction (dims to 38% opacity).
- `name` — form-association name.
- `size` — `extra-small` (default), `small`, `medium`, `large`, `extra-large`.

## Caveats

- Range mode places two `<input type="range">` elements on top of each other. The handles are clamped via `min`/`max` on each input, so dragging beyond the other thumb is impossible by design.
- The handle in M3 Expressive is a thin **bar** (4–8dp wide depending on size), not a circle. There is a 6dp gap between the handle and each adjacent track segment, and the track ends facing the handle have a 2dp inner corner radius. The gap collapses at min/max so the active bar always fills to the edge.
- The handle does **not** narrow on press. The spec's narrow-on-press effect causes a 1-2dp jiggle in the bars when the press visual animates, which the project intentionally avoids — press feedback is the value indicator alone.
- Hit area: the handle's hitbox matches the state-layer size (40–96dp depending on size). In range mode, the focused / hovered / actively-dragged handle is z-index-raised above the other so overlapping hitboxes resolve to the right one.
- Exposed parts: `track`, `track-active`, `track-inactive-start` (range only), `track-inactive-end`, `thumb`, `thumb-end` (range only), `value-indicator`, `stop-indicator`.
- Custom value formatting: assign a function to `slider.labelFormat`, e.g. `(v) => v.toFixed(1) + 'kg'`. Not settable via attribute.
