import { expect, fixture, html, oneEvent } from '@open-wc/testing';

import { Dialog } from './dialog.js';

const waitFor = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

suite('u-dialog', () => {
  teardown(() => {
    document.querySelectorAll('u-dialog').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-dialog', () => {
      expect(customElements.get('u-dialog')).to.equal(Dialog);
    });
  });

  suite('rendering', () => {
    test('renders a native <dialog> in shadow DOM', async () => {
      const el = await fixture<Dialog>(html`<u-dialog></u-dialog>`);
      expect(el.shadowRoot!.querySelector('dialog')).to.exist;
    });

    test('renders the named slots and parts', async () => {
      const el = await fixture<Dialog>(html`<u-dialog></u-dialog>`);
      expect(el.shadowRoot!.querySelector('[part="container"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="headline"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="content"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="actions"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="icon"]')).to.exist;
    });
  });

  suite('hasHeadline / hasIcon', () => {
    test('hasHeadline becomes true when a headline slot is populated', async () => {
      const el = await fixture<Dialog>(html`
        <u-dialog>
          <div slot="headline">Title</div>
        </u-dialog>
      `);
      await el.updateComplete;
      expect(el.hasHeadline).to.be.true;
      expect(el.hasAttribute('has-headline')).to.be.true;
    });

    test('hasIcon becomes true when an icon slot is populated', async () => {
      const el = await fixture<Dialog>(html`
        <u-dialog>
          <div slot="icon">x</div>
        </u-dialog>
      `);
      await el.updateComplete;
      expect(el.hasIcon).to.be.true;
      expect(el.hasAttribute('has-icon')).to.be.true;
    });

    test('hasHeadline stays false when no headline slot content is provided', async () => {
      const el = await fixture<Dialog>(html`<u-dialog></u-dialog>`);
      expect(el.hasHeadline).to.be.false;
    });
  });

  suite('show() / close()', () => {
    test('show() flips open to true and reflects the open attribute', async () => {
      const el = await fixture<Dialog>(html`<u-dialog></u-dialog>`);
      await el.show();
      expect(el.open).to.be.true;
      expect(el.hasAttribute('open')).to.be.true;
    });

    test('close() resets open and removes the attribute', async () => {
      const el = await fixture<Dialog>(html`<u-dialog></u-dialog>`);
      await el.show();
      const closing = el.close();
      // close() flips open synchronously even before the animation completes.
      expect(el.open).to.be.false;
      expect(el.hasAttribute('open')).to.be.false;
      await closing.catch(() => {});
    });

    test('opening twice is idempotent', async () => {
      const el = await fixture<Dialog>(html`<u-dialog></u-dialog>`);
      await el.show();
      await el.show();
      expect(el.open).to.be.true;
    });
  });

  suite('open setter', () => {
    test('open=true is equivalent to show()', async () => {
      const el = await fixture<Dialog>(html`<u-dialog></u-dialog>`);
      el.open = true;
      await waitFor(10);
      expect(el.open).to.be.true;
    });

    test('open=false closes the dialog', async () => {
      const el = await fixture<Dialog>(html`<u-dialog></u-dialog>`);
      await el.show();
      el.open = false;
      expect(el.open).to.be.false;
    });
  });

  suite('cancel event', () => {
    test('clicking the scrim fires a cancel event', async () => {
      const el = await fixture<Dialog>(html`<u-dialog></u-dialog>`);
      await el.show();
      const scrim = el.shadowRoot!.querySelector<HTMLElement>('.scrim')!;

      setTimeout(() => scrim.click());
      const event = await oneEvent(el, 'cancel');

      expect(event).to.exist;
      expect(event.cancelable).to.be.true;
    });
  });

  suite('static builders', () => {
    test('Dialog.message returns a MessageDialogBuilder', () => {
      const builder = Dialog.message('hi');
      expect(builder).to.exist;
      expect(typeof builder.show).to.equal('function');
    });

    test('Dialog.confirm returns a ConfirmDialogBuilder', () => {
      const builder = Dialog.confirm('Are you sure?');
      expect(builder).to.exist;
      expect(typeof builder.show).to.equal('function');
    });

    test('builders expose a .headline() chainable method', () => {
      const builder = Dialog.message('hi');
      const chained = builder.headline('Title');
      expect(chained).to.equal(builder);
    });
  });
});
