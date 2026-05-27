import { expect, fixture, html } from '@open-wc/testing';

import { NavigationBarItem } from './navigation-bar-item.js';

const containerOf = (el: NavigationBarItem) =>
  el.shadowRoot!.querySelector<HTMLElement>('[part="container"]')!;

suite('u-navigation-bar-item', () => {
  teardown(() => {
    document.querySelectorAll('u-navigation-bar-item').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-navigation-bar-item', () => {
      expect(customElements.get('u-navigation-bar-item')).to.equal(NavigationBarItem);
    });
  });

  suite('default property values', () => {
    test('active defaults to false', async () => {
      const el = await fixture<NavigationBarItem>(html`<u-navigation-bar-item>x</u-navigation-bar-item>`);
      expect(el.active).to.be.false;
      expect(el.hasAttribute('active')).to.be.false;
    });

    test('variant defaults to "vertical" (and reflects)', async () => {
      const el = await fixture<NavigationBarItem>(html`<u-navigation-bar-item>x</u-navigation-bar-item>`);
      expect(el.variant).to.equal('vertical');
      expect(el.getAttribute('variant')).to.equal('vertical');
    });
  });

  suite('property reflection', () => {
    test('active reflects to the active attribute', async () => {
      const el = await fixture<NavigationBarItem>(html`<u-navigation-bar-item>x</u-navigation-bar-item>`);
      el.active = true;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.true;
    });

    test('variant reflects "horizontal" to the variant attribute', async () => {
      const el = await fixture<NavigationBarItem>(html`<u-navigation-bar-item>x</u-navigation-bar-item>`);
      el.variant = 'horizontal';
      await el.updateComplete;
      expect(el.getAttribute('variant')).to.equal('horizontal');
    });
  });

  suite('aria-labelledby', () => {
    test('sets aria-labelledby="text" on the host after connect', async () => {
      const el = await fixture<NavigationBarItem>(html`<u-navigation-bar-item>x</u-navigation-bar-item>`);
      expect(el.getAttribute('aria-labelledby')).to.equal('text');
    });
  });

  suite('variant layouts', () => {
    test('vertical: label sits outside the active indicator pill', async () => {
      const el = await fixture<NavigationBarItem>(html`<u-navigation-bar-item>Home</u-navigation-bar-item>`);
      await el.updateComplete;
      const indicator = el.shadowRoot!.querySelector('[part="active-indicator"]')!;
      expect(indicator.querySelector('[part="label"]')).to.be.null;
    });

    test('horizontal: icon and label sit inside the active indicator pill', async () => {
      const el = await fixture<NavigationBarItem>(html`
        <u-navigation-bar-item variant="horizontal">Home</u-navigation-bar-item>
      `);
      await el.updateComplete;
      const indicator = el.shadowRoot!.querySelector('[part="active-indicator"]')!;
      expect(indicator.querySelector('[part="label"]')).to.exist;
    });
  });

  suite('slots and badge', () => {
    test('renders icon, default and badge slots', async () => {
      const el = await fixture<NavigationBarItem>(html`<u-navigation-bar-item>x</u-navigation-bar-item>`);
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('slot[name="icon"]')).to.exist;
      expect(el.shadowRoot!.querySelector('slot[name="badge"]')).to.exist;
      const labelSlot = el.shadowRoot!.querySelector('[part="label"] slot:not([name])');
      expect(labelSlot).to.exist;
    });
  });

  suite('container classes', () => {
    test('has-icon is false when icon slot is empty', async () => {
      const el = await fixture<NavigationBarItem>(html`<u-navigation-bar-item>x</u-navigation-bar-item>`);
      await el.updateComplete;
      expect(containerOf(el).classList.contains('has-icon')).to.be.false;
    });

    test('has-icon is true when icon slot has content', async () => {
      const el = await fixture<NavigationBarItem>(html`
        <u-navigation-bar-item>
          <span slot="icon">★</span>
          Home
        </u-navigation-bar-item>
      `);
      await el.updateComplete;
      expect(containerOf(el).classList.contains('has-icon')).to.be.true;
    });

    test('has-label is true when default slot has visible text', async () => {
      const el = await fixture<NavigationBarItem>(html`<u-navigation-bar-item>Home</u-navigation-bar-item>`);
      await el.updateComplete;
      expect(containerOf(el).classList.contains('has-label')).to.be.true;
    });

    test('has-label is false when default slot is whitespace-only', async () => {
      const el = await fixture<NavigationBarItem>(html`<u-navigation-bar-item>   </u-navigation-bar-item>`);
      await el.updateComplete;
      expect(containerOf(el).classList.contains('has-label')).to.be.false;
    });
  });
});
