import { expect, fixture, html } from '@open-wc/testing';

import { ButtonSet } from './button-set.js';

suite('u-button-set', () => {
  teardown(() => {
    document.querySelectorAll('u-button-set').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-button-set', () => {
      expect(customElements.get('u-button-set')).to.equal(ButtonSet);
    });
  });

  suite('alignment property', () => {
    test('defaults to "end" (overrides SetBase default of "start")', async () => {
      const el = await fixture<ButtonSet>(html`<u-button-set></u-button-set>`);
      expect(el.alignment).to.equal('end');
      expect(el.getAttribute('alignment')).to.equal('end');
    });

    (['start', 'center', 'end'] as const).forEach((alignment) => {
      test(`reflects "${alignment}" to the alignment attribute`, async () => {
        const el = await fixture<ButtonSet>(html`<u-button-set></u-button-set>`);
        el.alignment = alignment;
        await el.updateComplete;
        expect(el.getAttribute('alignment')).to.equal(alignment);
      });
    });
  });

  suite('stack property', () => {
    test('defaults to false', async () => {
      const el = await fixture<ButtonSet>(html`<u-button-set></u-button-set>`);
      expect(el.stack).to.be.false;
      expect(el.hasAttribute('stack')).to.be.false;
    });

    test('reflects to the stack attribute when set', async () => {
      const el = await fixture<ButtonSet>(html`<u-button-set></u-button-set>`);
      el.stack = true;
      await el.updateComplete;
      expect(el.hasAttribute('stack')).to.be.true;
    });

    test('reads the stack attribute on construction', async () => {
      const el = await fixture<ButtonSet>(html`<u-button-set stack></u-button-set>`);
      expect(el.stack).to.be.true;
    });
  });

  suite('rendering', () => {
    test('exposes a default slot for buttons', async () => {
      const el = await fixture<ButtonSet>(html`<u-button-set></u-button-set>`);
      const slot = el.shadowRoot!.querySelector('slot');
      expect(slot).to.exist;
    });

    test('slots its children', async () => {
      const el = await fixture<ButtonSet>(html`
        <u-button-set>
          <button>A</button>
          <button>B</button>
        </u-button-set>
      `);
      const slot = el.shadowRoot!.querySelector('slot')!;
      expect(slot.assignedElements()).to.have.lengthOf(2);
    });
  });
});
