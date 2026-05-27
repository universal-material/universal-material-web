import { expect, fixture, html } from '@open-wc/testing';

import './chip.js';
import { ChipSet } from './chip-set.js';

suite('u-chip-set', () => {
  teardown(() => {
    document.querySelectorAll('u-chip-set').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-chip-set', () => {
      expect(customElements.get('u-chip-set')).to.equal(ChipSet);
    });
  });

  suite('default rendering', () => {
    test('renders a default slot', async () => {
      const el = await fixture<ChipSet>(html`<u-chip-set></u-chip-set>`);
      const slot = el.shadowRoot!.querySelector('slot');
      expect(slot).to.exist;
      expect(slot!.hasAttribute('name')).to.be.false;
    });

    test('exposes slotted chip children', async () => {
      const el = await fixture<ChipSet>(html`
        <u-chip-set>
          <u-chip>One</u-chip>
          <u-chip>Two</u-chip>
        </u-chip-set>
      `);
      const slot = el.shadowRoot!.querySelector('slot')!;
      const assigned = slot.assignedElements();
      expect(assigned.length).to.equal(2);
      expect(assigned[0].tagName).to.equal('U-CHIP');
    });
  });

  suite('alignment property (inherited from SetBase)', () => {
    test('defaults to "start"', async () => {
      const el = await fixture<ChipSet>(html`<u-chip-set></u-chip-set>`);
      expect(el.alignment).to.equal('start');
      expect(el.getAttribute('alignment')).to.equal('start');
    });

    test('reflects to the alignment attribute', async () => {
      const el = await fixture<ChipSet>(html`<u-chip-set></u-chip-set>`);
      el.alignment = 'center';
      await el.updateComplete;
      expect(el.getAttribute('alignment')).to.equal('center');
    });
  });
});
