---
description: Use u-card, u-card-content, and u-card-media for Material 3 cards — filled, outlined and elevated variants.
---

# Card

A container for related content. Three visual variants — `filled` (default), `outlined`, `elevated` — chosen via the `variant` attribute.

## Basic

```html
<u-card>
  <div class="u-title-l">Article title</div>
  <div class="u-body-m u-text-low-emphasis">
    Supporting paragraph with a short summary of the article content.
  </div>
</u-card>
```

## Variants

```html
<u-card variant="filled">…</u-card>     <!-- default -->
<u-card variant="outlined">…</u-card>
<u-card variant="elevated">…</u-card>
```

## With media

`<u-card-media>` is a fixed-aspect media slot that lives flush against the card edges (no padding). Use it for images or video posters:

```html
<u-card variant="outlined">
  <u-card-media>
    <img src="…" alt="" />
  </u-card-media>
  <div class="u-title-l">Card with media</div>
  <div class="u-body-m u-text-low-emphasis">Body content below the media.</div>
</u-card>
```

## With explicit content block

When mixing media and padded content, wrap the body in `<u-card-content>` so the padding only applies there:

```html
<u-card variant="elevated">
  <u-card-media>
    <img src="…" alt="" />
  </u-card-media>
  <u-card-content>
    <div class="u-title-l">Title</div>
    <p class="u-body-m">Body</p>
  </u-card-content>
</u-card>
```

## Actions

Put action buttons inside a `<u-button-set>` at the bottom of the card:

```html
<u-card variant="outlined">
  <div class="u-title-l">Confirm subscription</div>
  <p class="u-body-m u-text-low-emphasis">
    You'll receive weekly updates by email.
  </p>
  <u-button-set>
    <u-button variant="text">Not now</u-button>
    <u-button>Subscribe</u-button>
  </u-button-set>
</u-card>
```

## Caveats

- `<u-card>` is just a container; it doesn't impose a layout on its children. Use the library's utility classes (`u-grid`, `flex`, etc.) or your own CSS for the inside.
- For clickable cards, wrap the entire card in `<a>` or `<button>`, or add an absolute-positioned overlay button (M3 doesn't define a built-in clickable card variant in this lib).
