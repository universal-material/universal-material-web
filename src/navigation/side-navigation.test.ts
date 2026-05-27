import { expect, fixture, html } from '@open-wc/testing';

import { SideNavigation } from './side-navigation.js';

suite('u-side-navigation', () => {
  teardown(() => {
    document.querySelectorAll('u-side-navigation').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-side-navigation', () => {
      expect(customElements.get('u-side-navigation')).to.equal(SideNavigation);
    });
  });

  suite('toggleDrawer property', () => {
    test('defaults to false', async () => {
      const el = await fixture<SideNavigation>(html`<u-side-navigation></u-side-navigation>`);
      expect(el.toggleDrawer).to.be.false;
    });

    test('reading reflects the value just written', async () => {
      const el = await fixture<SideNavigation>(html`<u-side-navigation></u-side-navigation>`);
      el.toggleDrawer = true;
      expect(el.toggleDrawer).to.be.true;
      el.toggleDrawer = false;
      expect(el.toggleDrawer).to.be.false;
    });

    test('applies the "toggle" class to the drawer when true', async () => {
      const el = await fixture<SideNavigation>(html`<u-side-navigation></u-side-navigation>`);
      el.toggleDrawer = true;
      await el.updateComplete;
      const drawer = el.shadowRoot!.querySelector('.drawer')!;
      expect(drawer.classList.contains('toggle')).to.be.true;
    });

    test('applies the "toggle" class to the scrim when true', async () => {
      const el = await fixture<SideNavigation>(html`<u-side-navigation></u-side-navigation>`);
      el.toggleDrawer = true;
      await el.updateComplete;
      const scrim = el.shadowRoot!.querySelector('.scrim')!;
      expect(scrim.classList.contains('toggle')).to.be.true;
    });
  });

  suite('rendering (default, non-swiper)', () => {
    test('renders the drawer slot, rail slot, and content slot', async () => {
      const el = await fixture<SideNavigation>(html`<u-side-navigation></u-side-navigation>`);
      expect(el.shadowRoot!.querySelector('slot[name="drawer"]')).to.exist;
      expect(el.shadowRoot!.querySelector('slot[name="rail"]')).to.exist;
      expect(el.shadowRoot!.querySelector('.content slot:not([name])')).to.exist;
    });

    test('renders the scrim element', async () => {
      const el = await fixture<SideNavigation>(html`<u-side-navigation></u-side-navigation>`);
      expect(el.shadowRoot!.querySelector('.scrim')).to.exist;
    });
  });

  suite('scrim click', () => {
    test('clicking the scrim sets toggleDrawer back to false', async () => {
      const el = await fixture<SideNavigation>(html`<u-side-navigation></u-side-navigation>`);
      el.toggleDrawer = true;
      await el.updateComplete;
      const scrim = el.shadowRoot!.querySelector<HTMLElement>('.scrim')!;
      scrim.click();
      expect(el.toggleDrawer).to.be.false;
    });
  });
});
