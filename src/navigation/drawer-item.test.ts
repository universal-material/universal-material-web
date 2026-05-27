import { expect, fixture, html } from '@open-wc/testing';

// side-navigation / navigation-rail must register before drawer-item so
// closest('u-side-navigation') / closest('u-navigation-rail') resolve.
import './side-navigation.js';
import '../navigation-rail/navigation-rail.js';
import { DrawerItem } from './drawer-item.js';

const containerOf = (el: DrawerItem) =>
  el.shadowRoot!.querySelector<HTMLElement>('[part="container"]')!;

suite('u-drawer-item', () => {
  teardown(() => {
    document.querySelectorAll('u-drawer-item, u-side-navigation, u-navigation-rail')
      .forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-drawer-item', () => {
      expect(customElements.get('u-drawer-item')).to.equal(DrawerItem);
    });
  });

  suite('default property values', () => {
    test('active defaults to false (not reflected)', async () => {
      const el = await fixture<DrawerItem>(html`<u-drawer-item>Home</u-drawer-item>`);
      expect(el.active).to.be.false;
      expect(el.hasAttribute('active')).to.be.false;
    });

    test('keepDrawerOpen defaults to false (not reflected)', async () => {
      const el = await fixture<DrawerItem>(html`<u-drawer-item>Home</u-drawer-item>`);
      expect(el.keepDrawerOpen).to.be.false;
      expect(el.hasAttribute('keep-drawer-open')).to.be.false;
    });
  });

  suite('property reflection', () => {
    test('active reflects to the active attribute', async () => {
      const el = await fixture<DrawerItem>(html`<u-drawer-item>x</u-drawer-item>`);
      el.active = true;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.true;
    });

    test('keepDrawerOpen reflects to the keep-drawer-open attribute', async () => {
      const el = await fixture<DrawerItem>(html`<u-drawer-item>x</u-drawer-item>`);
      el.keepDrawerOpen = true;
      await el.updateComplete;
      expect(el.hasAttribute('keep-drawer-open')).to.be.true;
    });
  });

  suite('aria attributes', () => {
    test('sets aria-labelledby="label" on the host', async () => {
      const el = await fixture<DrawerItem>(html`<u-drawer-item>x</u-drawer-item>`);
      expect(el.getAttribute('aria-labelledby')).to.equal('label');
    });
  });

  suite('slots and classes', () => {
    test('renders icon, label and badge slots', async () => {
      const el = await fixture<DrawerItem>(html`<u-drawer-item>Home</u-drawer-item>`);
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('slot[name="icon"]')).to.exist;
      expect(el.shadowRoot!.querySelector('slot[name="badge"]')).to.exist;
      const labelSlot = el.shadowRoot!.querySelector('slot:not([name])')!;
      expect(labelSlot).to.exist;
    });

    test('does not apply has-icon when icon slot is empty', async () => {
      const el = await fixture<DrawerItem>(html`<u-drawer-item>Home</u-drawer-item>`);
      await el.updateComplete;
      expect(containerOf(el).classList.contains('has-icon')).to.be.false;
    });

    test('applies has-icon when icon slot has content', async () => {
      const el = await fixture<DrawerItem>(html`
        <u-drawer-item>
          <span slot="icon">★</span>
          Home
        </u-drawer-item>
      `);
      await el.updateComplete;
      expect(containerOf(el).classList.contains('has-icon')).to.be.true;
    });

    test('applies has-badge when badge slot has content', async () => {
      const el = await fixture<DrawerItem>(html`
        <u-drawer-item>
          Home
          <span slot="badge">2</span>
        </u-drawer-item>
      `);
      await el.updateComplete;
      expect(containerOf(el).classList.contains('has-badge')).to.be.true;
    });
  });

  suite('click behavior', () => {
    test('inside u-side-navigation: clicking closes the drawer', async () => {
      const wrap = await fixture<HTMLElement>(html`
        <u-side-navigation toggle-drawer>
          <u-drawer-item>Home</u-drawer-item>
        </u-side-navigation>
      `);
      const sideNav = wrap as unknown as { toggleDrawer: boolean };
      expect(sideNav.toggleDrawer).to.be.true;

      const item = wrap.querySelector('u-drawer-item') as DrawerItem;
      item._handleClick();
      expect(sideNav.toggleDrawer).to.be.false;
    });

    test('keep-drawer-open prevents the drawer from closing', async () => {
      const wrap = await fixture<HTMLElement>(html`
        <u-side-navigation toggle-drawer>
          <u-drawer-item keep-drawer-open>Home</u-drawer-item>
        </u-side-navigation>
      `);
      const sideNav = wrap as unknown as { toggleDrawer: boolean };
      const item = wrap.querySelector('u-drawer-item') as DrawerItem;
      item._handleClick();
      expect(sideNav.toggleDrawer).to.be.true;
    });

    test('inside u-navigation-rail: clicking closes the rail drawer', async () => {
      const wrap = await fixture<HTMLElement>(html`
        <u-navigation-rail toggle-drawer>
          <u-drawer-item slot="drawer">Home</u-drawer-item>
        </u-navigation-rail>
      `);
      const rail = wrap as unknown as { toggleDrawer: boolean };
      expect(rail.toggleDrawer).to.be.true;

      const item = wrap.querySelector('u-drawer-item') as DrawerItem;
      item._handleClick();
      expect(rail.toggleDrawer).to.be.false;
    });

    test('standalone click is a no-op (no parent nav)', async () => {
      const el = await fixture<DrawerItem>(html`<u-drawer-item>Home</u-drawer-item>`);
      expect(() => el._handleClick()).to.not.throw();
    });
  });
});
