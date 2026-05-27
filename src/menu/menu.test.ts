import { expect, fixture, html, oneEvent } from '@open-wc/testing';

import { MenuItem } from './menu-item.js';
import { Menu } from './menu.js';

suite('u-menu / u-menu-item', () => {
  teardown(() => {
    document.querySelectorAll('u-menu').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('u-menu is registered', () => {
      expect(customElements.get('u-menu')).to.equal(Menu);
    });

    test('u-menu-item is registered', () => {
      expect(customElements.get('u-menu-item')).to.equal(MenuItem);
    });
  });

  suite('rendering', () => {
    test('renders the inner menu part with content slot', async () => {
      const el = await fixture<Menu>(html`<u-menu></u-menu>`);
      expect(el.shadowRoot!.querySelector('[part="menu"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="content"]')).to.exist;
    });

    test('applies role="listbox" to the host', async () => {
      const el = await fixture<Menu>(html`<u-menu></u-menu>`);
      expect(el.role).to.equal('listbox');
    });

    test('the inner menu has inert set when closed', async () => {
      const el = await fixture<Menu>(html`<u-menu></u-menu>`);
      const menu = el.shadowRoot!.querySelector<HTMLElement>('[part="menu"]')!;
      expect(menu.hasAttribute('inert')).to.be.true;
    });
  });

  suite('default property values', () => {
    test('open defaults to false', async () => {
      const el = await fixture<Menu>(html`<u-menu></u-menu>`);
      expect(el.open).to.be.false;
    });

    test('positioning defaults to "relative"', async () => {
      const el = await fixture<Menu>(html`<u-menu></u-menu>`);
      expect(el.positioning).to.equal('relative');
    });

    test('anchorCorner defaults to "end-start"', async () => {
      const el = await fixture<Menu>(html`<u-menu></u-menu>`);
      expect(el.anchorCorner).to.equal('end-start');
    });

    test('direction defaults to "down-end"', async () => {
      const el = await fixture<Menu>(html`<u-menu></u-menu>`);
      expect(el.direction).to.equal('down-end');
    });

    test('autoclose defaults to true', async () => {
      const el = await fixture<Menu>(html`<u-menu></u-menu>`);
      expect(el.autoclose).to.equal(true);
    });
  });

  suite('show() / close() / toggle()', () => {
    test('show() sets open to true', async () => {
      const wrap = await fixture<HTMLElement>(html`
        <div><u-menu><u-menu-item>A</u-menu-item></u-menu></div>
      `);
      const menu = wrap.querySelector('u-menu') as Menu;
      menu.show();
      expect(menu.open).to.be.true;
    });

    test('close() sets open back to false', async () => {
      const wrap = await fixture<HTMLElement>(html`
        <div><u-menu><u-menu-item>A</u-menu-item></u-menu></div>
      `);
      const menu = wrap.querySelector('u-menu') as Menu;
      menu.show();
      menu.close();
      expect(menu.open).to.be.false;
    });

    test('toggle() flips open', async () => {
      const wrap = await fixture<HTMLElement>(html`
        <div><u-menu><u-menu-item>A</u-menu-item></u-menu></div>
      `);
      const menu = wrap.querySelector('u-menu') as Menu;
      menu.toggle();
      expect(menu.open).to.be.true;
      menu.toggle();
      expect(menu.open).to.be.false;
    });
  });

  suite('open/close events', () => {
    test('dispatches an "open" event when opening', async () => {
      const wrap = await fixture<HTMLElement>(html`
        <div><u-menu><u-menu-item>A</u-menu-item></u-menu></div>
      `);
      const menu = wrap.querySelector('u-menu') as Menu;
      setTimeout(() => menu.show());
      const event = await oneEvent(menu, 'open');
      expect(event).to.exist;
      expect(event.cancelable).to.be.true;
    });

    test('preventDefault on "open" cancels the opening', async () => {
      const wrap = await fixture<HTMLElement>(html`
        <div><u-menu><u-menu-item>A</u-menu-item></u-menu></div>
      `);
      const menu = wrap.querySelector('u-menu') as Menu;
      menu.addEventListener('open', (e) => e.preventDefault());
      menu.show();
      expect(menu.open).to.be.false;
    });

    test('dispatches a "close" event when closing', async () => {
      const wrap = await fixture<HTMLElement>(html`
        <div><u-menu><u-menu-item>A</u-menu-item></u-menu></div>
      `);
      const menu = wrap.querySelector('u-menu') as Menu;
      menu.show();

      setTimeout(() => menu.close());
      const event = await oneEvent(menu, 'close');
      expect(event).to.exist;
      expect(event.cancelable).to.be.true;
    });

    test('preventDefault on "close" cancels the closing', async () => {
      const wrap = await fixture<HTMLElement>(html`
        <div><u-menu><u-menu-item>A</u-menu-item></u-menu></div>
      `);
      const menu = wrap.querySelector('u-menu') as Menu;
      menu.show();
      menu.addEventListener('close', (e) => e.preventDefault());
      menu.close();
      expect(menu.open).to.be.true;
    });
  });

  suite('anchorElement', () => {
    test('defaults to the parent element', async () => {
      const wrap = await fixture<HTMLElement>(html`
        <div><u-menu></u-menu></div>
      `);
      const menu = wrap.querySelector('u-menu') as Menu;
      expect(menu.anchorElement).to.equal(wrap);
    });

    test('uses the explicitly assigned anchor element', async () => {
      const wrap = await fixture<HTMLElement>(html`<div><u-menu></u-menu></div>`);
      const menu = wrap.querySelector('u-menu') as Menu;
      const anchor = document.createElement('div');
      menu.anchorElement = anchor;
      expect(menu.anchorElement).to.equal(anchor);
    });
  });
});

suite('u-menu-item', () => {
  teardown(() => {
    document.querySelectorAll('u-menu-item').forEach((el) => el.remove());
  });

  suite('active property', () => {
    test('defaults to false', async () => {
      const el = await fixture<MenuItem>(html`<u-menu-item>A</u-menu-item>`);
      expect(el.active).to.be.false;
      expect(el.hasAttribute('active')).to.be.false;
    });

    test('reflects to the active attribute', async () => {
      const el = await fixture<MenuItem>(html`<u-menu-item>A</u-menu-item>`);
      el.active = true;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.true;
    });
  });

  suite('hasBadge attribute', () => {
    test('reflects to has-badge attribute when set', async () => {
      const el = await fixture<MenuItem>(html`<u-menu-item>A</u-menu-item>`);
      el.hasBadge = true;
      await el.updateComplete;
      expect(el.hasAttribute('has-badge')).to.be.true;
    });
  });
});
