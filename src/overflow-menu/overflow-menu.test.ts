import { expect, fixture, html } from '@open-wc/testing';

import '../button/icon-button.js';
import '../menu/menu-item.js';
import '../menu/menu.js';
import { OverflowMenuItem } from './overflow-menu-item.js';
import { OverflowMenu } from './overflow-menu.js';

suite('u-overflow-menu / u-overflow-menu-item', () => {
  teardown(() => {
    document.querySelectorAll('u-overflow-menu').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('u-overflow-menu is registered', () => {
      expect(customElements.get('u-overflow-menu')).to.equal(OverflowMenu);
    });

    test('u-overflow-menu-item is registered', () => {
      expect(customElements.get('u-overflow-menu-item')).to.equal(OverflowMenuItem);
    });
  });

  suite('default property values', () => {
    test('menuPositioning defaults to "relative"', async () => {
      const el = await fixture<OverflowMenu>(html`<u-overflow-menu></u-overflow-menu>`);
      expect(el.menuPositioning).to.equal('relative');
    });
  });

  suite('rendering', () => {
    test('renders a container with the items slot', async () => {
      const el = await fixture<OverflowMenu>(html`<u-overflow-menu></u-overflow-menu>`);
      const slot = el.shadowRoot!.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });

    test('hides the inner menu when there is no overflow', async () => {
      const el = await fixture<OverflowMenu>(html`
        <u-overflow-menu style="display: flex; width: 1000px;">
          <u-overflow-menu-item label="A"></u-overflow-menu-item>
        </u-overflow-menu>
      `);
      await el.updateComplete;
      expect(el._renderMenu).to.be.false;
      expect(el.shadowRoot!.querySelector('u-menu')).to.be.null;
    });

    test('shows the inner menu when an item has collapse="always"', async () => {
      const el = await fixture<OverflowMenu>(html`
        <u-overflow-menu style="display: flex; width: 1000px;">
          <u-overflow-menu-item label="A" collapse="always"></u-overflow-menu-item>
        </u-overflow-menu>
      `);
      await el.updateComplete;
      expect(el._renderMenu).to.be.true;
      expect(el.shadowRoot!.querySelector('u-menu')).to.exist;
    });
  });
});

suite('u-overflow-menu-item', () => {
  teardown(() => {
    document.querySelectorAll('u-overflow-menu-item').forEach((el) => el.remove());
  });

  suite('properties', () => {
    test('label property reflects to label attribute', async () => {
      const el = await fixture<OverflowMenuItem>(html`<u-overflow-menu-item label="A"></u-overflow-menu-item>`);
      expect(el.label).to.equal('A');
    });

    test('collapse property accepts "auto" or "always"', async () => {
      const auto = await fixture<OverflowMenuItem>(html`<u-overflow-menu-item collapse="auto"></u-overflow-menu-item>`);
      const always = await fixture<OverflowMenuItem>(html`<u-overflow-menu-item collapse="always"></u-overflow-menu-item>`);
      expect(auto.collapse).to.equal('auto');
      expect(always.collapse).to.equal('always');
    });
  });
});
