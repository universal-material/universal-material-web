import { expect, fixture, html, oneEvent } from '@open-wc/testing';

import { IconButton } from './icon-button.js';

const containerOf = (el: IconButton) =>
  el.shadowRoot!.querySelector<HTMLElement>('[part="container"]')!;

suite('u-icon-button', () => {
  teardown(() => {
    document.querySelectorAll('u-icon-button').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-icon-button', () => {
      expect(customElements.get('u-icon-button')).to.equal(IconButton);
    });
  });

  suite('default rendering', () => {
    test('renders a native <button> by default', async () => {
      const el = await fixture<IconButton>(html`<u-icon-button>i</u-icon-button>`);
      expect(el.shadowRoot!.querySelector('button')).to.exist;
    });

    test('applies the default "standard" and "default" classes', async () => {
      const el = await fixture<IconButton>(html`<u-icon-button>i</u-icon-button>`);
      const container = containerOf(el);
      expect(container.classList.contains('standard')).to.be.true;
      expect(container.classList.contains('default')).to.be.true;
    });
  });

  suite('variant property', () => {
    (['standard', 'filled', 'tonal', 'outlined'] as const).forEach((variant) => {
      test(`applies the "${variant}" class to the container`, async () => {
        const el = await fixture<IconButton>(html`<u-icon-button .variant=${variant}>i</u-icon-button>`);
        expect(containerOf(el).classList.contains(variant)).to.be.true;
      });
    });
  });

  suite('width property', () => {
    (['default', 'narrow', 'wide'] as const).forEach((width) => {
      test(`applies the "${width}" class to the container`, async () => {
        const el = await fixture<IconButton>(html`<u-icon-button .width=${width}>i</u-icon-button>`);
        expect(containerOf(el).classList.contains(width)).to.be.true;
      });
    });
  });

  suite('link mode (href)', () => {
    test('renders an <a> instead of a <button> when href is set', async () => {
      const el = await fixture<IconButton>(html`<u-icon-button href="/x">i</u-icon-button>`);
      expect(el.shadowRoot!.querySelector('a')).to.exist;
      expect(el.shadowRoot!.querySelector('button')).to.be.null;
    });
  });

  suite('disabled property', () => {
    test('reflects to the disabled attribute and the inner button', async () => {
      const el = await fixture<IconButton>(html`<u-icon-button>i</u-icon-button>`);
      el.disabled = true;
      await el.updateComplete;
      expect(el.hasAttribute('disabled')).to.be.true;
      expect(el.shadowRoot!.querySelector('button')!.disabled).to.be.true;
    });
  });

  suite('toggle behavior', () => {
    test('does not fire change on click when toggle=false', async () => {
      const el = await fixture<IconButton>(html`<u-icon-button>i</u-icon-button>`);
      let fired = false;
      el.addEventListener('change', () => (fired = true));
      el.shadowRoot!.querySelector('button')!.click();
      expect(fired).to.be.false;
    });

    test('toggles selected and fires change on click when toggle=true', async () => {
      const el = await fixture<IconButton>(html`<u-icon-button toggle>i</u-icon-button>`);
      const inner = el.shadowRoot!.querySelector('button')!;
      setTimeout(() => inner.click());
      const event = await oneEvent(el, 'change');
      expect(event).to.exist;
      expect(el.selected).to.be.true;
    });
  });
});
