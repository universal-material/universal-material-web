---
description: Show a snackbar (toast) imperatively via Snackbar.show — message, optional action button, duration, and close affordance.
---

# Snackbar

Brief, transient messages shown at the bottom of the screen. Created imperatively — no markup needed.

## Show a message

```ts
import { Snackbar } from '@universal-material/web';

Snackbar.show({
  message: 'Your changes have been saved.',
});
```

## With an action

```ts
Snackbar.show({
  message: 'Item deleted.',
  action: 'Undo',
  onAction: () => undoDelete(),
});
```

Clicking the action button triggers `onAction` and closes the snackbar.

## Duration

```ts
import { Snackbar, SnackbarDuration } from '@universal-material/web';

Snackbar.show({
  message: 'Saved as draft',
  duration: SnackbarDuration.long,   // ~10s
});

Snackbar.show({
  message: 'Quick toast',
  duration: SnackbarDuration.short,  // ~4s (default)
});

Snackbar.show({
  message: 'Custom 6s',
  duration: 6000,                    // any ms value
});
```

Pass `duration: 0` (or `Infinity`) for a sticky snackbar that only closes on action or via the close button.

## Close affordance

```ts
Snackbar.show({
  message: 'Network request failed',
  showClose: true,
});
```

## Multiple snackbars

Calling `.show()` while another snackbar is visible queues the new one — only one renders at a time.

## Caveats

- The snackbar mounts itself at the document level (escapes any scrim/dialog). To override its anchoring (e.g. inside a scaffold), customize `--u-snackbar-bottom-offset` on `:root`.
- Don't use snackbars for errors that require user attention — use `<u-dialog>` (`Dialog.message()`/`.confirm()`) instead.
- The snackbar API is imperative; for declarative usage, mount the element manually and toggle visibility, but it's almost never what you want.
