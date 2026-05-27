import { expect, fixture, html } from '@open-wc/testing';

import { Elevation } from './elevation.js';

suite('u-elevation', () => {
  teardown(() => {
    document.querySelectorAll('u-elevation').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-elevation', () => {
      expect(customElements.get('u-elevation')).to.equal(Elevation);
    });

    test('instantiates a class extending HTMLElement', async () => {
      const el = await fixture<Elevation>(html`<u-elevation></u-elevation>`);
      expect(el).to.be.instanceOf(Elevation);
      expect(el).to.be.instanceOf(HTMLElement);
    });
  });

  suite('connectedCallback', () => {
    test('sets aria-hidden="true" when connected', async () => {
      const el = await fixture<Elevation>(html`<u-elevation></u-elevation>`);
      expect(el.getAttribute('aria-hidden')).to.equal('true');
    });

    test('re-applies aria-hidden after reconnecting to the DOM', async () => {
      const el = await fixture<Elevation>(html`<u-elevation></u-elevation>`);
      el.removeAttribute('aria-hidden');
      expect(el.hasAttribute('aria-hidden')).to.be.false;

      const parent = el.parentElement!;
      parent.removeChild(el);
      parent.appendChild(el);

      expect(el.getAttribute('aria-hidden')).to.equal('true');
    });
  });

  suite('rendering', () => {
    test('attaches a shadow root', async () => {
      const el = await fixture<Elevation>(html`<u-elevation></u-elevation>`);
      expect(el.shadowRoot).to.exist;
    });
  });
});
