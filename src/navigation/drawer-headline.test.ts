import { expect, fixture, html } from '@open-wc/testing';

import { DrawerHeadline } from './drawer-headline.js';

suite('u-drawer-headline', () => {
  teardown(() => {
    document.querySelectorAll('u-drawer-headline').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-drawer-headline', () => {
      expect(customElements.get('u-drawer-headline')).to.equal(DrawerHeadline);
    });
  });

  suite('default rendering', () => {
    test('renders a container with a default slot', async () => {
      const el = await fixture<DrawerHeadline>(html`<u-drawer-headline></u-drawer-headline>`);
      const container = el.shadowRoot!.querySelector('.container');
      expect(container).to.exist;
      const slot = container!.querySelector('slot');
      expect(slot).to.exist;
      expect(slot!.hasAttribute('name')).to.be.false;
    });

    test('exposes slotted text content', async () => {
      const el = await fixture<DrawerHeadline>(html`<u-drawer-headline>Main</u-drawer-headline>`);
      const slot = el.shadowRoot!.querySelector('slot')!;
      const text = slot.assignedNodes({ flatten: true })
        .map((n) => n.textContent ?? '').join('').trim();
      expect(text).to.equal('Main');
    });
  });
});
