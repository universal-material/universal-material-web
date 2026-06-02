---
description: Use u-card for Material 3 cards — filled, outlined and elevated variants. Slot media in `before-content`; put body content directly inside the card (no manual u-card-content wrapper).
---

# Card

A container for related content. Three visual variants — `filled` (default), `outlined`, `elevated` — chosen via the `variant` attribute.

## Anatomy

`<u-card>` wraps the default slot in an internal padded region automatically. It exposes three slots:

| Slot | Purpose |
| --- | --- |
| `before-content` | Banner / media / hero placed flush to the card edges (no padding). Use for `<u-card-media>` or any custom hero element. |
| default | Body content. Gets the standard 16dp padding from the card itself. |
| `after-content` | Footer placed flush to the bottom edge (no padding). Use for full-bleed action bars. |

## Basic

```html
<u-card>
  <div class="u-title-l">Article title</div>
  <div class="u-body-m u-text-low-emphasis">
    Supporting paragraph with a short summary of the article content.
  </div>
</u-card>
```

Body content goes **directly** inside `<u-card>`. The card pads it for you.

## Variants

```html
<u-card variant="filled">…</u-card>     <!-- default -->
<u-card variant="outlined">…</u-card>
<u-card variant="elevated">…</u-card>
```

### Recommendation: keep sibling cards on the same variant

When several cards sit side-by-side and represent **information of the same importance** — KPI grids, product catalogs, list-of-articles, anything where each item is one "row" of equal weight — prefer using a single variant across all of them.

Mixing variants in a sibling group (e.g. alternating filled/outlined/elevated) creates a visual hierarchy the data doesn't have: the elevated card looks more important than the outlined one even though both are just "another KPI" or "another product." The eye reads weight, not content, and gets the wrong signal first.

```html
<!-- ✅ Consistent: each KPI gets the same weight -->
<div class="u-grid">
  <u-card variant="outlined">…KPI 1…</u-card>
  <u-card variant="outlined">…KPI 2…</u-card>
  <u-card variant="outlined">…KPI 3…</u-card>
</div>

<!-- ❌ Mixing variants makes some KPIs visually "heavier" than others
     even when they're peers in the data model. -->
<div class="u-grid">
  <u-card variant="elevated">…KPI 1…</u-card>
  <u-card variant="outlined">…KPI 2…</u-card>
  <u-card variant="filled">…KPI 3…</u-card>
</div>
```

**Use different variants for different roles, not for variety.** A page can absolutely mix variants when the cards serve different purposes — e.g. the main content card `elevated`, the sidebar helper cards `outlined`, the inline tip cards `filled`. The cue should match the meaning.

This is a guideline, not a hard rule — there are layouts where mixing is intentional (a "featured" card among regulars, an A/B test, a hero among supporting cards). The point is to be deliberate about why the variants differ.

## With media (correct pattern)

Place `<u-card-media>` in `slot="before-content"` so it sits flush against the card edges (no inner padding from the body region):

```html
<u-card variant="outlined">
  <u-card-media slot="before-content">
    <img src="…" alt="" />
  </u-card-media>

  <div class="u-title-l">Card with media</div>
  <div class="u-body-m u-text-low-emphasis">Body content below the media — directly in the card, no wrapper.</div>
</u-card>
```

`<u-card-media>` defaults to a square aspect ratio. Add the `wide` attribute for 16:9:

```html
<u-card-media wide slot="before-content">
  <img src="…" alt="" />
</u-card-media>
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

For full-bleed footers (e.g. a divider + action bar that touches both card edges), use `slot="after-content"`:

```html
<u-card variant="outlined">
  <div class="u-title-l">Card with full-bleed footer</div>
  <p class="u-body-m">Body content with the standard padding.</p>

  <div slot="after-content" style="border-top: 1px solid var(--u-color-outline-variant); padding: 12px 16px;">
    <u-button variant="text">Action</u-button>
  </div>
</u-card>
```

## Overlays on the media

When you need a chip, badge or icon overlaid on the media, wrap your media in a `<div style="position: relative">` and absolute-position the overlay inside it:

```html
<u-card>
  <u-card-media wide slot="before-content">
    <div style="position: relative; width: 100%; height: 100%;">
      <img src="…" alt="" style="width: 100%; height: 100%; object-fit: cover;" />
      <u-chip elevated style="position: absolute; top: 8px; left: 8px;">New</u-chip>
    </div>
  </u-card-media>

  <div class="u-title-l">Title</div>
</u-card>
```

Don't put `position: absolute` chips as direct children of `<u-card-media>` — slot positioning across shadow DOM boundaries is unreliable. Always wrap in a regular div.

## Caveats

- **Don't use `<u-card-content>` manually.** The card already wraps the default slot in a padded region — adding `<u-card-content>` on top stacks two layers of padding and is being phased out of the public API. Body content goes directly inside `<u-card>`.
- `<u-card>` is just a container; it doesn't impose a layout on its children. Use `u-grid`, `u-column`, flex, etc. for the body's internal layout.
- For clickable cards, wrap the entire card in `<a>` or `<button>`, or add an absolute-positioned overlay button (M3 doesn't define a built-in clickable card variant in this lib).
- The internal padded region uses 16dp. Override via `--u-card-content-padding` if you need a different value, or use `slot="before-content"` / `slot="after-content"` for sections that need to escape the padding entirely.
