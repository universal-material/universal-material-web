import { expect, fixture, html } from '@open-wc/testing';

import '../ripple/ripple.js';
import { NavigationRailItem } from './navigation-rail-item.js';

const containerOf = (el: NavigationRailItem) =>
  el.shadowRoot!.querySelector<HTMLElement>('[part="container"]')!;

suite('u-navigation-rail-item', () => {
  teardown(() => {
    document.querySelectorAll('u-navigation-rail-item').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-navigation-rail-item', () => {
      expect(customElements.get('u-navigation-rail-item')).to.equal(NavigationRailItem);
    });
  });

  suite('default property values', () => {
    test('active defaults to false', async () => {
      const el = await fixture<NavigationRailItem>(html`<u-navigation-rail-item></u-navigation-rail-item>`);
      expect(el.active).to.be.false;
      expect(el.hasAttribute('active')).to.be.false;
    });

    test('variant defaults to "collapsed"', async () => {
      const el = await fixture<NavigationRailItem>(html`<u-navigation-rail-item></u-navigation-rail-item>`);
      expect(el.variant).to.equal('collapsed');
      expect(el.getAttribute('variant')).to.equal('collapsed');
    });
  });

  suite('active reflection', () => {
    test('reflects to the active attribute', async () => {
      const el = await fixture<NavigationRailItem>(html`<u-navigation-rail-item></u-navigation-rail-item>`);
      el.active = true;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.true;
    });
  });

  suite('variant layouts', () => {
    test('collapsed: label sits outside the active indicator pill', async () => {
      const el = await fixture<NavigationRailItem>(html`<u-navigation-rail-item>Home</u-navigation-rail-item>`);
      await el.updateComplete;
      const indicator = el.shadowRoot!.querySelector('[part="active-indicator"]')!;
      const labelInside = indicator.querySelector('[part="label"]');
      expect(labelInside).to.be.null;
    });

    test('expanded: icon and label sit inside the active indicator pill', async () => {
      const el = await fixture<NavigationRailItem>(html`<u-navigation-rail-item variant="expanded">Home</u-navigation-rail-item>`);
      await el.updateComplete;
      const indicator = el.shadowRoot!.querySelector('[part="active-indicator"]')!;
      const labelInside = indicator.querySelector('[part="label"]');
      expect(labelInside).to.exist;
    });
  });

  suite('aria-labelledby', () => {
    test('sets aria-labelledby to the label id', async () => {
      const el = await fixture<NavigationRailItem>(html`<u-navigation-rail-item>x</u-navigation-rail-item>`);
      expect(el.getAttribute('aria-labelledby')).to.equal('text');
    });
  });

  suite('pill ripple', () => {
    test('renders a ripple inside the active indicator pill', async () => {
      const el = await fixture<NavigationRailItem>(html`<u-navigation-rail-item>x</u-navigation-rail-item>`);
      await el.updateComplete;
      const indicator = el.shadowRoot!.querySelector('[part="active-indicator"]')!;
      expect(indicator.querySelector('u-ripple.pill-ripple')).to.exist;
    });
  });

  suite('container classes', () => {
    test('has-label is true when default slot has visible content', async () => {
      const el = await fixture<NavigationRailItem>(html`<u-navigation-rail-item>Home</u-navigation-rail-item>`);
      await el.updateComplete;
      expect(containerOf(el).classList.contains('has-label')).to.be.true;
    });

    test('has-label is false when label slot is empty / whitespace', async () => {
      const el = await fixture<NavigationRailItem>(html`<u-navigation-rail-item></u-navigation-rail-item>`);
      await el.updateComplete;
      expect(containerOf(el).classList.contains('has-label')).to.be.false;
    });

    test('has-icon reflects icon slot population', async () => {
      const el = await fixture<NavigationRailItem>(html`
        <u-navigation-rail-item>
          <span slot="icon">★</span>
          Home
        </u-navigation-rail-item>
      `);
      await el.updateComplete;
      expect(containerOf(el).classList.contains('has-icon')).to.be.true;
    });
  });
});
