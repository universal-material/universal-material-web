---
description: Use u-datepicker and u-range-datepicker — calendar popover for single or range date selection, with editable input mode, locales, and display formats.
---

# Date picker

`<u-datepicker>` (single date) and `<u-range-datepicker>` (date range) are form-associated text fields with a calendar popover. For inline-only usage, the library also exposes `<u-calendar>` and `<u-range-calendar>`.

## Single date

```html
<u-datepicker
  label="Date"
  placeholder="YYYY-MM-DD"
></u-datepicker>
```

The value is always ISO `YYYY-MM-DD` (suitable for form submission). The displayed value is formatted per the `format` prop.

## Display formats

```html
<u-datepicker label="Short"  format="short"></u-datepicker>   <!-- 12/31/2025 -->
<u-datepicker label="Medium" format="medium"></u-datepicker>  <!-- Dec 31, 2025 -->
<u-datepicker label="Long"   format="long"></u-datepicker>    <!-- December 31, 2025 -->
<u-datepicker label="Full"   format="full"></u-datepicker>    <!-- Wednesday, December 31, 2025 -->
<u-datepicker label="ISO"    format="iso"></u-datepicker>     <!-- 2025-12-31 -->

<u-datepicker
  label="Custom"
  [format]="{ year: 'numeric', month: '2-digit', day: '2-digit' }">
</u-datepicker>
```

`format` accepts named presets, `'iso'`, or any `Intl.DateTimeFormatOptions` object.

## Locale

```html
<u-datepicker label="Data" locale="pt-BR" format="long"></u-datepicker>
<u-datepicker label="日付"  locale="ja-JP" format="full"></u-datepicker>
```

When omitted, falls back to `navigator.language`. Also drives the calendar's month/weekday labels.

## Editable input mode

Default — clicking the field opens the calendar; typing is blocked.

```html
<u-datepicker label="Date"></u-datepicker>
```

Editable — the input becomes a native `<input type="date">`; the trailing calendar icon opens the popover:

```html
<u-datepicker label="Date" editable></u-datepicker>
```

In editable mode the browser's native date-format mask is hidden until the user focuses the field (so it doesn't visually collide with the floating label).

## Read-only

```html
<u-datepicker label="Date" value="2025-12-31" readOnly></u-datepicker>
```

## Range

```html
<u-range-datepicker
  label="Stay"
  placeholder="YYYY-MM-DD - YYYY-MM-DD"
  format="medium"
></u-range-datepicker>
```

Value format is `YYYY-MM-DD - YYYY-MM-DD`. Same `format`/`locale`/`editable`/`readOnly` props.

## Inline calendar (no field)

```html
<u-calendar (input)="onPick($event.target.value)"></u-calendar>
<u-range-calendar (change)="onRange($event.target.value)"></u-range-calendar>
```

Use these when you want the calendar embedded in your own layout (sidebars, custom popovers).

## Positioning inside clipped containers

`menu-positioning="fixed"` lets the popover escape any scrollable wrapper:

```html
<u-datepicker label="Date" menu-positioning="fixed"></u-datepicker>
```

## Caveats

- `value` is always ISO. Format strings only affect display.
- In editable mode the field uses the browser's native `<input type="date">`, which means OS-level keyboard handling and locale conventions for the typing UX.
- The popover opens below the field with `direction="down-end"`. Use `menu-positioning="fixed"` if the field is in a scaffold scroll area to avoid being clipped.
