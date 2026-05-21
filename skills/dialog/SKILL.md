---
description: Show modal dialogs — declarative u-dialog with slots, or imperative Dialog.message() / Dialog.confirm() builders.
---

# Dialog

Two patterns: a declarative `<u-dialog>` you keep in markup and `show()`/`close()` programmatically, or one-shot imperative builders for the common alert/confirm flows.

## Declarative

```html
<u-button (click)="dialog.show()">Open dialog</u-button>

<u-dialog #dialog>
  <span class="material-symbols-outlined" slot="icon">mobile_friendly</span>
  <span slot="headline">Update available</span>
  <span>A new version of the app is ready. Restart now to apply the update.</span>
  <u-button slot="actions" variant="text" (click)="dialog.close('ok')">Restart</u-button>
  <u-button slot="actions" variant="text" (click)="dialog.close('cancel')">Later</u-button>
</u-dialog>
```

Slots: `icon`, `headline`, default (body), `actions`. Each is optional.

API:
- `show()` / `close(returnValue?)` — open / close. Closing with a value sets `dialog.returnValue`.
- `open` property mirrors `show()`/`close()`.
- `closed` and `cancel` events. Calling `event.preventDefault()` on `cancel` blocks dismissal.

### `<form method="dialog">`

Buttons with `form="form-id" value="…"` inside a `method="dialog"` form close the dialog with the submitter's value:

```html
<u-dialog #d>
  <span slot="headline">Rename file</span>
  <form id="rename" method="dialog">
    <u-text-field label="File name" autofocus name="filename"></u-text-field>
  </form>
  <u-button slot="actions" variant="text" form="rename" value="save">Save</u-button>
  <u-button slot="actions" variant="text" form="rename" value="cancel">Cancel</u-button>
</u-dialog>
```

### Long content

The dialog draws subtle dividers above the headline and below the actions when the body overflows. No extra setup needed — just put your content in the default slot.

### Action button order

`.actions` uses `flex-direction: row-reverse`, so the **first child in DOM order renders on the right** (the confirming action, per M3). Always put the affirmative button first in markup.

## Imperative — message

One-shot alert dialog with a single acknowledge button. Removes itself from the DOM on close.

```ts
import { Dialog } from '@universal-material/web';

Dialog
  .message('Your changes have been saved.')
  .headline('Saved')
  .acknowledgeButton({ label: 'Got it', variant: 'filled' })
  .show();
```

## Imperative — confirm

One-shot confirm dialog. `show()` returns a `Promise<boolean>` that resolves `true` on confirm, `false` on cancel/dismiss.

```ts
import { Dialog } from '@universal-material/web';

const ok = await Dialog
  .confirm('This action cannot be undone. Continue?')
  .headline('Delete item')
  .confirmButton({ label: 'Delete', variant: 'filled', color: 'error' })
  .cancelButton({ label: 'Keep it' })
  .show();

if (ok) {
  // …perform deletion
}
```

`confirmButton` / `cancelButton` accept any `{ variant, color, label }` — omitted fields fall back to defaults from `config.dialog.confirmDefaults`.

## Caveats

- The dialog opens via `<dialog>.showModal()` so it stacks above everything (no z-index gymnastics) and traps focus.
- The imperative builders run their lifecycle outside any framework's change-detection zone (the closed event fires from a transition listener). In Angular, call `ChangeDetectorRef.detectChanges()` after `await …show()` if the resolved value drives template bindings.
- Don't import `'@universal-material/web/dialog/dialog-builder.js'` directly — it doesn't register `u-button`; use the package root or the dialog entry which already pulls it in.
