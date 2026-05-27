import { expect, fixture, html, oneEvent } from '@open-wc/testing';

import { Search } from './search.js';

const inputOf = (el: Search) =>
  el.shadowRoot!.querySelector<HTMLInputElement>('input')!;

suite('u-search', () => {
  teardown(() => {
    document.querySelectorAll('u-search').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-search', () => {
      expect(customElements.get('u-search')).to.equal(Search);
    });

    test('is form-associated', () => {
      expect((Search as unknown as { formAssociated: boolean }).formAssociated).to.be.true;
    });
  });

  suite('default property values', () => {
    test('position defaults to "fixed"', async () => {
      const el = await fixture<Search>(html`<u-search></u-search>`);
      expect(el.position).to.equal('fixed');
      expect(el.getAttribute('position')).to.equal('fixed');
    });
  });

  suite('rendering', () => {
    test('renders an internal <input>', async () => {
      const el = await fixture<Search>(html`<u-search></u-search>`);
      expect(inputOf(el)).to.exist;
    });

    test('exposes leading and trailing icon slots', async () => {
      const el = await fixture<Search>(html`<u-search></u-search>`);
      expect(el.shadowRoot!.querySelector('slot[name="leading-icon"]')).to.exist;
      expect(el.shadowRoot!.querySelector('slot[name="trailing-icon"]')).to.exist;
    });
  });

  suite('position reflection', () => {
    (['fixed', 'absolute', 'static'] as const).forEach((pos) => {
      test(`reflects "${pos}" to the position attribute`, async () => {
        const el = await fixture<Search>(html`<u-search position=${pos}></u-search>`);
        expect(el.position).to.equal(pos);
        expect(el.getAttribute('position')).to.equal(pos);
      });
    });
  });

  suite('value sync', () => {
    test('typing into the input updates the value property', async () => {
      const el = await fixture<Search>(html`<u-search></u-search>`);
      const input = inputOf(el);
      input.value = 'query';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      expect(el.value).to.equal('query');
    });

    test('setting value reflects to the inner input', async () => {
      const el = await fixture<Search>(html`<u-search></u-search>`);
      el.value = 'hello';
      await el.updateComplete;
      expect(inputOf(el).value).to.equal('hello');
    });
  });

  suite('input event', () => {
    test('fires an input event that bubbles', async () => {
      const el = await fixture<Search>(html`<u-search></u-search>`);
      const input = inputOf(el);
      setTimeout(() => {
        input.value = 'x';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      });
      const event = await oneEvent(el, 'input');
      expect(event).to.exist;
    });
  });
});
