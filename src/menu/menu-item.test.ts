import { expect, fixture, html, oneEvent } from '@open-wc/testing';

import { MenuItem } from './menu-item.js';

const containerOf = (el: MenuItem) =>
  el.shadowRoot!.querySelector<HTMLElement>('[part="container"]')!;

suite('u-menu-item', () => {
  teardown(() => {
    document.querySelectorAll('u-menu-item').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-menu-item', () => {
      expect(customElements.get('u-menu-item')).to.equal(MenuItem);
    });
  });

  suite('default property values', () => {
    test('active defaults to false (and reflects)', async () => {
      const el = await fixture<MenuItem>(html`<u-menu-item>x</u-menu-item>`);
      expect(el.active).to.be.false;
      expect(el.hasAttribute('active')).to.be.false;
    });

    test('hasBadge defaults to false (reflects to has-badge)', async () => {
      const el = await fixture<MenuItem>(html`<u-menu-item>x</u-menu-item>`);
      expect(el.hasBadge).to.be.false;
      expect(el.hasAttribute('has-badge')).to.be.false;
    });
  });

  suite('host roles', () => {
    test('sets role="presentation" on the host after connect', async () => {
      const el = await fixture<MenuItem>(html`<u-menu-item>x</u-menu-item>`);
      expect(el.getAttribute('role')).to.equal('presentation');
    });

    test('uses innerRole="menuitem" on the inner button', async () => {
      const el = await fixture<MenuItem>(html`<u-menu-item>x</u-menu-item>`);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('button')!;
      expect(button.role).to.equal('menuitem');
    });
  });

  suite('reflection', () => {
    test('active reflects to the attribute', async () => {
      const el = await fixture<MenuItem>(html`<u-menu-item>x</u-menu-item>`);
      el.active = true;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.true;
    });

    test('hasBadge reflects to has-badge', async () => {
      const el = await fixture<MenuItem>(html`<u-menu-item>x</u-menu-item>`);
      el.hasBadge = true;
      await el.updateComplete;
      expect(el.hasAttribute('has-badge')).to.be.true;
    });
  });

  suite('container classes', () => {
    test('force-focus-ring class appears when active', async () => {
      const el = await fixture<MenuItem>(html`<u-menu-item active>x</u-menu-item>`);
      await el.updateComplete;
      expect(containerOf(el).classList.contains('force-focus-ring')).to.be.true;
    });

    test('does not apply leading-icon / trailing-icon when slots are empty', async () => {
      const el = await fixture<MenuItem>(html`<u-menu-item>x</u-menu-item>`);
      await el.updateComplete;
      expect(containerOf(el).classList.contains('leading-icon')).to.be.false;
      expect(containerOf(el).classList.contains('trailing-icon')).to.be.false;
    });

    test('applies leading-icon when leading-icon slot has content', async () => {
      const el = await fixture<MenuItem>(html`
        <u-menu-item>
          <span slot="leading-icon">★</span>
          Item
        </u-menu-item>
      `);
      await el.updateComplete;
      expect(containerOf(el).classList.contains('leading-icon')).to.be.true;
    });

    test('applies trailing-icon when trailing-icon slot has content', async () => {
      const el = await fixture<MenuItem>(html`
        <u-menu-item>
          Item
          <span slot="trailing-icon">▶</span>
        </u-menu-item>
      `);
      await el.updateComplete;
      expect(containerOf(el).classList.contains('trailing-icon')).to.be.true;
    });
  });

  suite('mouseenter event', () => {
    test('dispatches a bubbling menu-item-mouseenter on mouseenter', async () => {
      const el = await fixture<MenuItem>(html`<u-menu-item>x</u-menu-item>`);
      setTimeout(() => el.dispatchEvent(new MouseEvent('mouseenter')));
      const event = await oneEvent(el, 'menu-item-mouseenter');
      expect(event).to.exist;
      expect(event.bubbles).to.be.true;
    });
  });
});
