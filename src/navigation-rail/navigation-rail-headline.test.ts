import { expect, fixture, html } from '@open-wc/testing';

import { NavigationRailHeadline } from './navigation-rail-headline.js';

suite('u-navigation-rail-headline', () => {
  teardown(() => {
    document.querySelectorAll('u-navigation-rail-headline').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-navigation-rail-headline', () => {
      expect(customElements.get('u-navigation-rail-headline')).to.equal(NavigationRailHeadline);
    });
  });

  suite('rendering', () => {
    test('renders a container part with a default slot', async () => {
      const el = await fixture<NavigationRailHeadline>(html`<u-navigation-rail-headline>Section</u-navigation-rail-headline>`);
      const container = el.shadowRoot!.querySelector('[part="container"]');
      expect(container).to.exist;
      const slot = container!.querySelector('slot');
      expect(slot).to.exist;
    });

    test('forwards children text to the slot', async () => {
      const el = await fixture<NavigationRailHeadline>(html`<u-navigation-rail-headline>Library</u-navigation-rail-headline>`);
      const slot = el.shadowRoot!.querySelector('slot')!;
      const text = slot.assignedNodes({ flatten: true })
        .map((n) => n.textContent ?? '').join('').trim();
      expect(text).to.equal('Library');
    });
  });
});
