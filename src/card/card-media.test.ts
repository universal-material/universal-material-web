import { expect, fixture, html } from '@open-wc/testing';

import { CardMedia } from './card-media.js';

suite('u-card-media', () => {
  teardown(() => {
    document.querySelectorAll('u-card-media').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-card-media', () => {
      expect(customElements.get('u-card-media')).to.equal(CardMedia);
    });
  });

  suite('default rendering', () => {
    test('renders a default slot', async () => {
      const el = await fixture<CardMedia>(html`<u-card-media></u-card-media>`);
      const slot = el.shadowRoot!.querySelector('slot');
      expect(slot).to.exist;
    });

    test('exposes slotted media element', async () => {
      const el = await fixture<CardMedia>(html`
        <u-card-media><img alt="" src=""></u-card-media>
      `);
      const slot = el.shadowRoot!.querySelector('slot')!;
      const assigned = slot.assignedElements();
      expect(assigned[0].tagName).to.equal('IMG');
    });
  });

  suite('wide property', () => {
    test('defaults to false', async () => {
      const el = await fixture<CardMedia>(html`<u-card-media></u-card-media>`);
      expect(el.wide).to.be.false;
      expect(el.hasAttribute('wide')).to.be.false;
    });

    test('reflects to the wide attribute', async () => {
      const el = await fixture<CardMedia>(html`<u-card-media></u-card-media>`);
      el.wide = true;
      await el.updateComplete;
      expect(el.hasAttribute('wide')).to.be.true;
    });

    test('reads back from initial attribute', async () => {
      const el = await fixture<CardMedia>(html`<u-card-media wide></u-card-media>`);
      expect(el.wide).to.be.true;
    });
  });
});
