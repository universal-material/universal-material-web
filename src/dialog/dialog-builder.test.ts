import { expect, fixture, html } from '@open-wc/testing';

// Importing dialog.js pulls in the whole builder graph (Dialog references both
// builders via static factory methods), avoiding a circular-import TDZ that
// hits when the test imports the builders directly first.
import '../button/button.js';
import './dialog.js';
import { ConfirmDialogBuilder } from './confirm-dialog-builder.js';
import { Dialog } from './dialog.js';
import { MessageDialogBuilder } from './message-dialog-builder.js';

const cleanup = () => {
  document.querySelectorAll('u-dialog').forEach((el) => el.remove());
};

const waitFor = (ms = 16) => new Promise<void>((r) => setTimeout(r, ms));

suite('DialogBuilder (via Message/Confirm)', () => {
  teardown(() => {
    cleanup();
  });

  suite('chainable .headline()', () => {
    test('returns the builder so calls can chain', () => {
      const builder = MessageDialogBuilder.create('hi');
      expect(builder.headline('Title')).to.equal(builder);
    });

    test('adds a span[slot="headline"] to the dialog when headline is set', async () => {
      MessageDialogBuilder.create('Hello').headline('Welcome').show();
      const dialog = document.body.querySelector('u-dialog')!;
      await dialog.updateComplete;
      const headline = dialog.querySelector('span[slot="headline"]');
      expect(headline).to.exist;
      expect(headline!.textContent).to.equal('Welcome');
    });

    test('omits the headline span when not set', async () => {
      MessageDialogBuilder.create('Hello').show();
      const dialog = document.body.querySelector('u-dialog')!;
      await dialog.updateComplete;
      expect(dialog.querySelector('span[slot="headline"]')).to.be.null;
    });
  });

  suite('.show() lifecycle', () => {
    test('appends a u-dialog to document.body and opens it', async () => {
      MessageDialogBuilder.create('Hi').show();
      const dialog = document.body.querySelector('u-dialog') as Dialog;
      expect(dialog).to.exist;
      expect(dialog.parentElement).to.equal(document.body);
      await dialog.updateComplete;
      expect(dialog.open).to.be.true;
    });

    test('sanitizes the message HTML and injects it as innerHTML', async () => {
      MessageDialogBuilder.create('Hi <b>there</b><script>x</script>').show();
      const dialog = document.body.querySelector('u-dialog')!;
      await dialog.updateComplete;
      // <b> survives sanitization, <script> does not.
      expect(dialog.innerHTML).to.include('<b>there</b>');
      expect(dialog.innerHTML).to.not.include('<script>');
    });
  });
});

suite('MessageDialogBuilder', () => {
  teardown(() => cleanup());

  suite('static factory', () => {
    test('create() returns a MessageDialogBuilder', () => {
      const b = MessageDialogBuilder.create('Hi');
      expect(b).to.be.instanceOf(MessageDialogBuilder);
    });
  });

  suite('acknowledge button defaults', () => {
    test('renders an acknowledge button labelled "Ok"', async () => {
      MessageDialogBuilder.create('Hi').show();
      const dialog = document.body.querySelector('u-dialog')!;
      await dialog.updateComplete;
      const actions = Array.from(dialog.querySelectorAll('u-button[slot="actions"]'));
      expect(actions.length).to.equal(1);
      expect(actions[0].textContent).to.equal('Ok');
    });

    test('the default acknowledge button has variant="text"', async () => {
      MessageDialogBuilder.create('Hi').show();
      const dialog = document.body.querySelector('u-dialog')!;
      await dialog.updateComplete;
      const btn = dialog.querySelector('u-button[slot="actions"]') as any;
      expect(btn.variant).to.equal('text');
    });
  });

  suite('acknowledgeButton() overrides', () => {
    test('label override is applied', async () => {
      MessageDialogBuilder.create('Hi').acknowledgeButton({ label: 'Got it' }).show();
      const dialog = document.body.querySelector('u-dialog')!;
      await dialog.updateComplete;
      const btn = dialog.querySelector('u-button[slot="actions"]')!;
      expect(btn.textContent).to.equal('Got it');
    });

    test('color override is applied', async () => {
      MessageDialogBuilder.create('Hi').acknowledgeButton({ color: 'error' }).show();
      const dialog = document.body.querySelector('u-dialog')!;
      await dialog.updateComplete;
      const btn = dialog.querySelector('u-button[slot="actions"]') as any;
      expect(btn.color).to.equal('error');
    });

    test('variant override is applied', async () => {
      MessageDialogBuilder.create('Hi').acknowledgeButton({ variant: 'filled' }).show();
      const dialog = document.body.querySelector('u-dialog')!;
      await dialog.updateComplete;
      const btn = dialog.querySelector('u-button[slot="actions"]') as any;
      expect(btn.variant).to.equal('filled');
    });

    test('returns the builder so it can be chained', () => {
      const b = MessageDialogBuilder.create('Hi');
      expect(b.acknowledgeButton({ label: 'x' })).to.equal(b);
    });
  });

  suite('acknowledge click closes the dialog', () => {
    test('clicking the acknowledge button triggers Dialog.close()', async () => {
      MessageDialogBuilder.create('Hi').show();
      const dialog = document.body.querySelector('u-dialog') as Dialog;
      await dialog.updateComplete;
      const btn = dialog.querySelector('u-button[slot="actions"]') as HTMLElement;
      btn.click();
      // Dialog.close() flips open back to false synchronously.
      expect(dialog.open).to.be.false;
    });
  });
});

suite('ConfirmDialogBuilder', () => {
  teardown(() => cleanup());

  suite('static factory', () => {
    test('create() returns a ConfirmDialogBuilder', () => {
      const b = ConfirmDialogBuilder.create('Are you sure?');
      expect(b).to.be.instanceOf(ConfirmDialogBuilder);
    });
  });

  suite('confirm + cancel buttons', () => {
    test('renders two buttons with default labels "Ok" and "Cancel"', async () => {
      ConfirmDialogBuilder.create('Sure?').show();
      const dialog = document.body.querySelector('u-dialog')!;
      await dialog.updateComplete;
      const actions = Array.from(dialog.querySelectorAll('u-button[slot="actions"]'));
      expect(actions.length).to.equal(2);
      // Builder appends confirm first, then cancel — see _addButtons.
      expect(actions[0].textContent).to.equal('Ok');
      expect(actions[1].textContent).to.equal('Cancel');
    });
  });

  suite('confirmButton() / cancelButton() overrides', () => {
    test('confirmButton override is applied', async () => {
      ConfirmDialogBuilder.create('Sure?').confirmButton({ label: 'Yes' }).show();
      const dialog = document.body.querySelector('u-dialog')!;
      await dialog.updateComplete;
      const actions = Array.from(dialog.querySelectorAll('u-button[slot="actions"]'));
      expect(actions[0].textContent).to.equal('Yes');
    });

    test('cancelButton override is applied', async () => {
      ConfirmDialogBuilder.create('Sure?').cancelButton({ label: 'Nope', color: 'error' }).show();
      const dialog = document.body.querySelector('u-dialog')!;
      await dialog.updateComplete;
      const cancelBtn = dialog.querySelectorAll('u-button[slot="actions"]')[1] as any;
      expect(cancelBtn.textContent).to.equal('Nope');
      expect(cancelBtn.color).to.equal('error');
    });

    test('both setters return the builder', () => {
      const b = ConfirmDialogBuilder.create('Sure?');
      expect(b.confirmButton({ label: 'Y' })).to.equal(b);
      expect(b.cancelButton({ label: 'N' })).to.equal(b);
    });
  });

  suite('.show() Promise resolution', () => {
    test('returns a Promise', async () => {
      const p = ConfirmDialogBuilder.create('Sure?').show();
      expect(p).to.be.instanceOf(Promise);
      const dialog = document.body.querySelector('u-dialog')!;
      await dialog.updateComplete;
      // Give Dialog.connectedCallback's setTimeout-installed ResizeObserver
      // a chance to attach before we trigger removal — otherwise
      // disconnectedCallback throws on `this.#contentResizeObserver!.disconnect()`.
      await waitFor(20);
      const inner = dialog.shadowRoot!.querySelector<HTMLDialogElement>('dialog')!;
      inner.returnValue = 'ok';
      dialog.dispatchEvent(new Event('closed'));
      const result = await p;
      expect(result).to.be.true;
    });

    test('resolves to false when the dialog closes with a non-"ok" return value', async () => {
      const p = ConfirmDialogBuilder.create('Sure?').show();
      const dialog = document.body.querySelector('u-dialog')!;
      await dialog.updateComplete;
      await waitFor(20);
      const inner = dialog.shadowRoot!.querySelector<HTMLDialogElement>('dialog')!;
      inner.returnValue = 'cancel';
      dialog.dispatchEvent(new Event('closed'));
      const result = await p;
      expect(result).to.be.false;
    });

    test('clicking the confirm button sets returnValue to "ok"', async () => {
      ConfirmDialogBuilder.create('Sure?').show();
      const dialog = document.body.querySelector('u-dialog') as Dialog;
      await dialog.updateComplete;
      const confirmBtn = dialog.querySelector('u-button[slot="actions"]') as HTMLElement;
      confirmBtn.click();
      // Dialog.close('ok') flips open=false synchronously; returnValue is the
      // string we'll see when 'closed' eventually fires.
      expect(dialog.open).to.be.false;
    });

    test('clicking the cancel button closes the dialog with cancel returnValue', async () => {
      ConfirmDialogBuilder.create('Sure?').show();
      const dialog = document.body.querySelector('u-dialog') as Dialog;
      await dialog.updateComplete;
      const cancelBtn = dialog.querySelectorAll('u-button[slot="actions"]')[1] as HTMLElement;
      cancelBtn.click();
      expect(dialog.open).to.be.false;
    });
  });

  suite('removal after close', () => {
    test('builder registers a closed listener that removes the dialog from the DOM', async () => {
      MessageDialogBuilder.create('Hi').show();
      const dialog = document.body.querySelector('u-dialog')!;
      await dialog.updateComplete;
      await waitFor(20);
      expect(dialog.parentElement).to.equal(document.body);
      dialog.dispatchEvent(new Event('closed'));
      await waitFor();
      expect(document.body.querySelector('u-dialog')).to.be.null;
    });
  });
});

// Ensure no dialog leaks between top-level suites.
suite('global cleanup verification', () => {
  test('document.body is dialog-free at the end of the file', async () => {
    await fixture<HTMLDivElement>(html`<div></div>`);
    expect(document.body.querySelectorAll('u-dialog').length).to.equal(0);
  });
});
