import { expect, fixture, html } from '@open-wc/testing';

// Ensure overflow-menu is registered first (parent referenced via parentElement
// and re-rendered when items change).
import './overflow-menu.js';
import { OverflowMenuItem } from './overflow-menu-item.js';

suite('u-overflow-menu-item', () => {
  teardown(() => {
    document.querySelectorAll('u-overflow-menu-item, u-overflow-menu')
      .forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-overflow-menu-item', () => {
      expect(customElements.get('u-overflow-menu-item')).to.equal(OverflowMenuItem);
    });
  });

  suite('default property values', () => {
    test('label defaults to an empty string', async () => {
      const el = await fixture<OverflowMenuItem>(html`<u-overflow-menu-item></u-overflow-menu-item>`);
      expect(el.label).to.equal('');
    });

    test('collapse defaults to "auto" (and reflects)', async () => {
      const el = await fixture<OverflowMenuItem>(html`<u-overflow-menu-item></u-overflow-menu-item>`);
      expect(el.collapse).to.equal('auto');
      expect(el.getAttribute('collapse')).to.equal('auto');
    });
  });

  suite('rendering', () => {
    test('renders an inner u-icon-button with the label as its title', async () => {
      const el = await fixture<OverflowMenuItem>(html`
        <u-overflow-menu-item label="Search"></u-overflow-menu-item>
      `);
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('u-icon-button')!;
      expect(button).to.exist;
      expect(button.getAttribute('title')).to.equal('Search');
    });

    test('updates the icon button title when label changes', async () => {
      // The label setter notifies the parent u-overflow-menu, so mount inside
      // one to satisfy the runtime contract.
      const wrap = await fixture<HTMLElement>(html`
        <u-overflow-menu>
          <u-overflow-menu-item label="Search"></u-overflow-menu-item>
        </u-overflow-menu>
      `);
      const el = wrap.querySelector('u-overflow-menu-item') as OverflowMenuItem;
      el.label = 'Find';
      await el.updateComplete;
      const button = el.shadowRoot!.querySelector('u-icon-button')!;
      expect(button.getAttribute('title')).to.equal('Find');
    });

    test('exposes a default slot inside the icon button', async () => {
      const el = await fixture<OverflowMenuItem>(html`
        <u-overflow-menu-item label="x">
          <span class="icon-content"></span>
        </u-overflow-menu-item>
      `);
      await el.updateComplete;
      const slot = el.shadowRoot!.querySelector('u-icon-button > slot')!;
      expect(slot).to.exist;
      const assigned = (slot as HTMLSlotElement).assignedElements();
      expect(assigned[0].tagName).to.equal('SPAN');
    });
  });

  suite('collapse reflection', () => {
    test('reflects "always" to the collapse attribute', async () => {
      const el = await fixture<OverflowMenuItem>(html`<u-overflow-menu-item></u-overflow-menu-item>`);
      el.collapse = 'always';
      await el.updateComplete;
      expect(el.getAttribute('collapse')).to.equal('always');
    });

    test('reads the collapse attribute at mount', async () => {
      const el = await fixture<OverflowMenuItem>(html`
        <u-overflow-menu-item collapse="always"></u-overflow-menu-item>
      `);
      expect(el.collapse).to.equal('always');
    });
  });
});
