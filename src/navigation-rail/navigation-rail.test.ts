import { expect, fixture, html } from '@open-wc/testing';

import { NavigationRail } from './navigation-rail.js';

suite('u-navigation-rail', () => {
  teardown(() => {
    document.querySelectorAll('u-navigation-rail').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-navigation-rail', () => {
      expect(customElements.get('u-navigation-rail')).to.equal(NavigationRail);
    });
  });

  suite('toggleDrawer property', () => {
    test('defaults to false', async () => {
      const el = await fixture<NavigationRail>(html`<u-navigation-rail></u-navigation-rail>`);
      expect(el.toggleDrawer).to.be.false;
      expect(el.hasAttribute('toggle-drawer')).to.be.false;
    });

    test('reflects to the toggle-drawer attribute', async () => {
      const el = await fixture<NavigationRail>(html`<u-navigation-rail></u-navigation-rail>`);
      el.toggleDrawer = true;
      await el.updateComplete;
      expect(el.hasAttribute('toggle-drawer')).to.be.true;
    });
  });

  suite('rendering', () => {
    test('renders rail and rail-expanded parts', async () => {
      const el = await fixture<NavigationRail>(html`<u-navigation-rail></u-navigation-rail>`);
      expect(el.shadowRoot!.querySelector('[part="rail"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="rail-expanded"]')).to.exist;
    });

    test('exposes top, bottom, rail-items, rail-items-expanded slots/parts', async () => {
      const el = await fixture<NavigationRail>(html`<u-navigation-rail></u-navigation-rail>`);
      expect(el.shadowRoot!.querySelector('[part="top"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="bottom"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="rail-items"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="rail-items-expanded"]')).to.exist;
    });

    test('renders a scrim part for modal modes', async () => {
      const el = await fixture<NavigationRail>(html`<u-navigation-rail></u-navigation-rail>`);
      expect(el.shadowRoot!.querySelector('[part="scrim"]')).to.exist;
    });
  });

  suite('scrim click closes the drawer', () => {
    test('clicking the scrim sets toggleDrawer to false', async () => {
      const el = await fixture<NavigationRail>(html`<u-navigation-rail toggle-drawer></u-navigation-rail>`);
      expect(el.toggleDrawer).to.be.true;
      const scrim = el.shadowRoot!.querySelector<HTMLElement>('[part="scrim"]')!;
      scrim.click();
      expect(el.toggleDrawer).to.be.false;
    });
  });

  suite('has-* attributes on slot content', () => {
    test('sets has-rail-items when slot="rail" is populated', async () => {
      const el = await fixture<NavigationRail>(html`
        <u-navigation-rail>
          <u-navigation-rail-item slot="rail">A</u-navigation-rail-item>
        </u-navigation-rail>
      `);
      await el.updateComplete;
      expect(el.hasAttribute('has-rail-items')).to.be.true;
    });

    test('sets has-expanded-items when slot="expanded" is populated', async () => {
      const el = await fixture<NavigationRail>(html`
        <u-navigation-rail>
          <u-navigation-rail-item slot="expanded">A</u-navigation-rail-item>
        </u-navigation-rail>
      `);
      await el.updateComplete;
      expect(el.hasAttribute('has-expanded-items')).to.be.true;
    });
  });
});
