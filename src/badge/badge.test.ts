import { expect, fixture, html } from '@open-wc/testing';

import { Badge } from './badge.js';

suite('u-badge', () => {
  teardown(() => {
    document.querySelectorAll('u-badge').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-badge', () => {
      expect(customElements.get('u-badge')).to.equal(Badge);
    });
  });

  suite('rendering', () => {
    test('renders a container with part="container"', async () => {
      const el = await fixture<Badge>(html`<u-badge></u-badge>`);
      const container = el.shadowRoot!.querySelector('[part="container"]');
      expect(container).to.exist;
    });

    test('renders a default slot inside the container', async () => {
      const el = await fixture<Badge>(html`<u-badge></u-badge>`);
      const slot = el.shadowRoot!.querySelector('[part="container"] slot');
      expect(slot).to.exist;
    });

    test('forwards content into the default slot', async () => {
      const el = await fixture<Badge>(html`<u-badge>12</u-badge>`);
      const slot = el.shadowRoot!.querySelector('slot')!;
      const text = slot
        .assignedNodes({ flatten: true })
        .map((n) => n.textContent ?? '')
        .join('')
        .trim();
      expect(text).to.equal('12');
    });
  });

  suite('static property', () => {
    test('defaults to false', async () => {
      const el = await fixture<Badge>(html`<u-badge></u-badge>`);
      expect(el.static).to.be.false;
      expect(el.hasAttribute('static')).to.be.false;
    });

    test('reflects to the static attribute when set to true', async () => {
      const el = await fixture<Badge>(html`<u-badge></u-badge>`);
      el.static = true;
      await el.updateComplete;
      expect(el.hasAttribute('static')).to.be.true;
    });

    test('removes the static attribute when set back to false', async () => {
      const el = await fixture<Badge>(html`<u-badge static></u-badge>`);
      expect(el.static).to.be.true;
      el.static = false;
      await el.updateComplete;
      expect(el.hasAttribute('static')).to.be.false;
    });

    test('applies the "static" class to the container when true', async () => {
      const el = await fixture<Badge>(html`<u-badge static></u-badge>`);
      const container = el.shadowRoot!.querySelector('[part="container"]')!;
      expect(container.classList.contains('static')).to.be.true;
    });

    test('does not apply the "static" class when false', async () => {
      const el = await fixture<Badge>(html`<u-badge>5</u-badge>`);
      const container = el.shadowRoot!.querySelector('[part="container"]')!;
      expect(container.classList.contains('static')).to.be.false;
    });
  });
});
