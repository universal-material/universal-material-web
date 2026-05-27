import { expect, fixture, html, oneEvent } from '@open-wc/testing';

import { Snackbar, SnackbarDuration } from './snackbar.js';

type SnackbarInternals = {
  _dismissed: boolean;
  _canDismiss: boolean;
};

type SnackbarStaticInternals = {
  _queue: Snackbar[];
  _lastEnqueued: Snackbar | null;
  _consuming: boolean;
};

const internals = (el: Snackbar) => el as unknown as SnackbarInternals;
const staticInternals = () => Snackbar as unknown as SnackbarStaticInternals;

suite('u-snackbar', () => {
  let originalMinDisplayTime: number;

  setup(() => {
    originalMinDisplayTime = Snackbar.minDisplayTime;
    Snackbar.minDisplayTime = 0;
  });

  teardown(() => {
    Snackbar.minDisplayTime = originalMinDisplayTime;
    document.querySelectorAll('u-snackbar').forEach((el) => el.remove());
    const s = staticInternals();
    s._queue = [];
    s._lastEnqueued = null;
    s._consuming = false;
  });

  suite('rendering', () => {
    test('renders the message text', async () => {
      const el = await fixture<Snackbar>(
        html`<u-snackbar message="hello world"></u-snackbar>`,
      );
      const messageEl = el.shadowRoot!.querySelector('[part="message"]');
      expect(messageEl).to.exist;
      expect(messageEl!.textContent).to.equal('hello world');
    });

    test('renders the action button when action is set', async () => {
      const el = await fixture<Snackbar>(
        html`<u-snackbar message="hi" action="undo"></u-snackbar>`,
      );
      const button = el.shadowRoot!.querySelector('u-button[part="action"]');
      expect(button).to.exist;
      expect(button!.textContent!.trim()).to.equal('undo');
    });

    test('omits the action button when action is empty', async () => {
      const el = await fixture<Snackbar>(html`<u-snackbar message="hi"></u-snackbar>`);
      const button = el.shadowRoot!.querySelector('u-button[part="action"]');
      expect(button).to.be.null;
    });

    test('renders the close button when show-close is set', async () => {
      const el = await fixture<Snackbar>(
        html`<u-snackbar message="hi" show-close></u-snackbar>`,
      );
      const close = el.shadowRoot!.querySelector('u-icon-button[part="close"]');
      expect(close).to.exist;
    });

    test('omits the close button by default', async () => {
      const el = await fixture<Snackbar>(html`<u-snackbar message="hi"></u-snackbar>`);
      const close = el.shadowRoot!.querySelector('u-icon-button[part="close"]');
      expect(close).to.be.null;
    });

    test('reflects message, action and show-close to attributes', async () => {
      const el = await fixture<Snackbar>(
        html`<u-snackbar message="hi" action="undo" show-close></u-snackbar>`,
      );
      expect(el.getAttribute('message')).to.equal('hi');
      expect(el.getAttribute('action')).to.equal('undo');
      expect(el.hasAttribute('show-close')).to.be.true;
    });
  });

  suite('action button theming', () => {
    test('overrides --u-color-primary on the action button with --u-color-inverse-primary', async () => {
      const inversePrimary = 'rgb(208, 188, 255)';
      const el = await fixture<Snackbar>(html`
        <u-snackbar
          message="hi"
          action="undo"
          style="--u-color-inverse-primary: ${inversePrimary};"
        ></u-snackbar>
      `);

      const button =
        el.shadowRoot!.querySelector<HTMLElement>('u-button[part="action"]')!;
      const buttonPrimary = getComputedStyle(button)
        .getPropertyValue('--u-color-primary')
        .trim();

      expect(buttonPrimary).to.equal(inversePrimary);
    });

    test('action button --u-color-primary tracks --u-color-inverse-primary, not the ambient primary', async () => {
      const el = await fixture<Snackbar>(html`
        <u-snackbar
          message="hi"
          action="undo"
          style="--u-color-primary: rgb(10, 20, 30); --u-color-inverse-primary: rgb(208, 188, 255);"
        ></u-snackbar>
      `);

      const button =
        el.shadowRoot!.querySelector<HTMLElement>('u-button[part="action"]')!;
      const buttonPrimary = getComputedStyle(button)
        .getPropertyValue('--u-color-primary')
        .trim();

      expect(buttonPrimary).to.equal('rgb(208, 188, 255)');
    });
  });

  suite('dismiss()', () => {
    test('flips _dismissed to true', async () => {
      const el = await fixture<Snackbar>(html`<u-snackbar message="hi"></u-snackbar>`);
      expect(internals(el)._dismissed).to.be.false;
      el.dismiss();
      expect(internals(el)._dismissed).to.be.true;
    });

    test('is idempotent', async () => {
      const el = await fixture<Snackbar>(html`<u-snackbar message="hi"></u-snackbar>`);
      el.dismiss();
      el.dismiss();
      expect(internals(el)._dismissed).to.be.true;
    });
  });

  suite('actionClick', () => {
    test('clicking the action button fires a cancelable actionClick event', async () => {
      const el = await fixture<Snackbar>(
        html`<u-snackbar message="hi" action="undo"></u-snackbar>`,
      );
      const button =
        el.shadowRoot!.querySelector<HTMLElement>('u-button[part="action"]')!;

      setTimeout(() => button.click());
      const event = await oneEvent(el, 'actionClick');

      expect(event).to.exist;
      expect(event.cancelable).to.be.true;
    });

    test('dismisses the snackbar by default', async () => {
      const el = await fixture<Snackbar>(
        html`<u-snackbar message="hi" action="undo"></u-snackbar>`,
      );
      const button =
        el.shadowRoot!.querySelector<HTMLElement>('u-button[part="action"]')!;

      button.click();

      expect(internals(el)._dismissed).to.be.true;
    });

    test('does not dismiss when the event is canceled with preventDefault', async () => {
      const el = await fixture<Snackbar>(
        html`<u-snackbar message="hi" action="undo"></u-snackbar>`,
      );
      el.addEventListener('actionClick', (e) => e.preventDefault());

      const button =
        el.shadowRoot!.querySelector<HTMLElement>('u-button[part="action"]')!;
      button.click();

      expect(internals(el)._dismissed).to.be.false;
    });

    test('does not bubble outside the snackbar host', async () => {
      const el = await fixture<Snackbar>(
        html`<u-snackbar message="hi" action="undo"></u-snackbar>`,
      );

      let bubbled = false;
      document.addEventListener('actionClick', () => (bubbled = true), { once: true });

      const button =
        el.shadowRoot!.querySelector<HTMLElement>('u-button[part="action"]')!;
      button.click();

      expect(bubbled).to.be.false;
    });
  });

  suite('Snackbar.show()', () => {
    test('show(string) appends a snackbar to document.body', async () => {
      const snackbar = Snackbar.show('hello');
      expect(snackbar).to.be.instanceOf(Snackbar);
      await snackbar.updateComplete;

      expect(snackbar.message).to.equal('hello');
      expect(snackbar.parentElement).to.equal(document.body);
    });

    test('show(config) wires action, showClose, and duration', async () => {
      const snackbar = Snackbar.show({
        message: 'saved',
        action: 'undo',
        showClose: true,
        duration: SnackbarDuration.infinite,
      });
      await snackbar.updateComplete;

      expect(snackbar.message).to.equal('saved');
      expect(snackbar.action).to.equal('undo');
      expect(snackbar.showClose).to.be.true;
      expect(snackbar.duration).to.equal(SnackbarDuration.infinite);
    });

    test('defaults duration to long when not provided', async () => {
      const snackbar = Snackbar.show({ message: 'msg' });
      expect(snackbar.duration).to.equal(SnackbarDuration.long);
    });

    test('enqueuing a new snackbar dismisses the previously enqueued one', async () => {
      const first = Snackbar.show({
        message: 'first',
        duration: SnackbarDuration.infinite,
      });
      const second = Snackbar.show({
        message: 'second',
        duration: SnackbarDuration.infinite,
      });

      expect(internals(first)._dismissed).to.be.true;
      expect(internals(second)._dismissed).to.be.false;
    });
  });
});
