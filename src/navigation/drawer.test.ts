import { expect, fixture, html } from '@open-wc/testing';

import { DrawerHeadline } from './drawer-headline.js';
import { DrawerItem } from './drawer-item.js';
import { Drawer } from './drawer.js';

suite('u-drawer', () => {
  teardown(() => {
    document.querySelectorAll('u-drawer').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('u-drawer is registered', () => {
      expect(customElements.get('u-drawer')).to.equal(Drawer);
    });

    test('u-drawer-headline is registered', () => {
      expect(customElements.get('u-drawer-headline')).to.equal(DrawerHeadline);
    });

    test('u-drawer-item is registered', () => {
      expect(customElements.get('u-drawer-item')).to.equal(DrawerItem);
    });
  });

  suite('rendering', () => {
    test('renders a container with part="container"', async () => {
      const el = await fixture<Drawer>(html`<u-drawer></u-drawer>`);
      expect(el.shadowRoot!.querySelector('[part="container"]')).to.exist;
    });

    test('renders a default slot inside the container', async () => {
      const el = await fixture<Drawer>(html`
        <u-drawer>
          <u-drawer-headline>Title</u-drawer-headline>
        </u-drawer>
      `);
      const slot = el.shadowRoot!.querySelector('[part="container"] slot')!;
      const assigned = (slot as HTMLSlotElement).assignedElements();
      expect(assigned.length).to.equal(1);
    });
  });
});

suite('u-drawer-headline', () => {
  teardown(() => {
    document.querySelectorAll('u-drawer-headline').forEach((el) => el.remove());
  });

  test('renders its container with a default slot', async () => {
    const el = await fixture<DrawerHeadline>(html`<u-drawer-headline>Hi</u-drawer-headline>`);
    expect(el.shadowRoot!.querySelector('.container')).to.exist;
    const slot = el.shadowRoot!.querySelector('slot')!;
    const text = slot.assignedNodes({ flatten: true })
      .map((n) => n.textContent ?? '').join('').trim();
    expect(text).to.equal('Hi');
  });
});

suite('u-drawer-item', () => {
  teardown(() => {
    document.querySelectorAll('u-drawer-item').forEach((el) => el.remove());
  });

  suite('active property', () => {
    test('defaults to false', async () => {
      const el = await fixture<DrawerItem>(html`<u-drawer-item>Inbox</u-drawer-item>`);
      expect(el.active).to.be.false;
      expect(el.hasAttribute('active')).to.be.false;
    });

    test('reflects to the active attribute', async () => {
      const el = await fixture<DrawerItem>(html`<u-drawer-item>Inbox</u-drawer-item>`);
      el.active = true;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.true;
    });
  });

  suite('keepDrawerOpen', () => {
    test('reflects to the keep-drawer-open attribute', async () => {
      const el = await fixture<DrawerItem>(html`<u-drawer-item>x</u-drawer-item>`);
      el.keepDrawerOpen = true;
      await el.updateComplete;
      expect(el.hasAttribute('keep-drawer-open')).to.be.true;
    });
  });

  suite('slots', () => {
    test('exposes icon and badge slots', async () => {
      const el = await fixture<DrawerItem>(html`<u-drawer-item>x</u-drawer-item>`);
      expect(el.shadowRoot!.querySelector('slot[name="icon"]')).to.exist;
      expect(el.shadowRoot!.querySelector('slot[name="badge"]')).to.exist;
    });
  });
});
