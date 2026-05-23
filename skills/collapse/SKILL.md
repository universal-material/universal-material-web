---
description: Use u-collapse to animate an element between zero height and its natural content height.
---

# Collapse

A primitive wrapper that animates its `max-height` between `0` and the slotted content's measured `scrollHeight`. Toggle the `open` attribute to play the animation. A `ResizeObserver` watches the content so dynamic children stay in sync.

```html
<u-button id="toggle">Expand</u-button>
<u-collapse id="demo">
  <p>Hidden until expanded.</p>
</u-collapse>

<script type="module">
  const btn = document.getElementById('toggle');
  const collapse = document.getElementById('demo');
  btn.addEventListener('click', () => { collapse.open = !collapse.open; });
</script>
```

Compose with other surfaces:

```html
<u-card variant="outlined" style="padding: 1rem;">
  <u-button variant="text" onclick="this.nextElementSibling.open = !this.nextElementSibling.open">More</u-button>
  <u-collapse>
    <div style="padding-top: .5rem;">Reveal-on-demand content.</div>
  </u-collapse>
</u-card>
```

## Caveats

- The component measures `scrollHeight` via `ResizeObserver`. The headless `mcp__Claude_Preview__*` environment does NOT fire `ResizeObserver` — verify the animation in a real browser.
- `u-collapse` does not own a button or trigger — it's a pure container. Pair it with whatever toggle UI fits.
- For a header + chevron + ripple combo, use [[expansion-panel]] instead.
