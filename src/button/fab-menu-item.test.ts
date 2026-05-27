import { expect, fixture, html } from '@open-wc/testing';

import './fab-menu.js';
import { FabMenuItem } from './fab-menu-item.js';

const containerOf = (el: FabMenuItem) =>
  el.shadowRoot!.querySelector<HTMLElement>('[part="container"]')!;

suite('u-fab-menu-item', () => {
  teardown(() => {
    document.querySelectorAll('u-fab-menu-item, u-fab-menu').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-fab-menu-item', () => {
      expect(customElements.get('u-fab-menu-item')).to.equal(FabMenuItem);
    });

    test('is form-associated (via ButtonBase)', () => {
      expect((FabMenuItem as unknown as { formAssociated: boolean }).formAssociated).to.be.true;
    });
  });

  suite('default rendering', () => {
    test('renders a button container by default', async () => {
      const el = await fixture<FabMenuItem>(html`<u-fab-menu-item label="Item"></u-fab-menu-item>`);
      expect(el.shadowRoot!.querySelector('button')).to.exist;
    });

    test('renders the label text', async () => {
      const el = await fixture<FabMenuItem>(html`<u-fab-menu-item label="Compose"></u-fab-menu-item>`);
      const label = el.shadowRoot!.querySelector('.label')!;
      expect(label.textContent).to.equal('Compose');
    });

    test('renders an empty label when label is null', async () => {
      const el = await fixture<FabMenuItem>(html`<u-fab-menu-item></u-fab-menu-item>`);
      const label = el.shadowRoot!.querySelector('.label')!;
      expect(label.textContent).to.equal('');
    });

    test('renders an icon slot inside the icon span', async () => {
      const el = await fixture<FabMenuItem>(html`<u-fab-menu-item></u-fab-menu-item>`);
      expect(el.shadowRoot!.querySelector('.icon slot')).to.exist;
    });
  });

  suite('label property', () => {
    test('defaults to null', async () => {
      const el = await fixture<FabMenuItem>(html`<u-fab-menu-item></u-fab-menu-item>`);
      expect(el.label).to.equal(null);
    });

    test('updates the rendered label when changed', async () => {
      const el = await fixture<FabMenuItem>(html`<u-fab-menu-item label="A"></u-fab-menu-item>`);
      el.label = 'B';
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.label')!.textContent).to.equal('B');
    });
  });

  suite('has-icon class', () => {
    test('applies has-icon when an element is slotted into the icon area', async () => {
      const el = await fixture<FabMenuItem>(html`
        <u-fab-menu-item label="x">
          <svg></svg>
        </u-fab-menu-item>
      `);
      await el.updateComplete;
      expect(containerOf(el).classList.contains('has-icon')).to.be.true;
    });

    test('does not apply has-icon when slot is empty', async () => {
      const el = await fixture<FabMenuItem>(html`<u-fab-menu-item label="x"></u-fab-menu-item>`);
      await el.updateComplete;
      expect(containerOf(el).classList.contains('has-icon')).to.be.false;
    });
  });

  suite('context consumption (fab-menu open / color)', () => {
    test('inside a u-fab-menu, the open context propagates and adds the "open" class', async () => {
      const wrap = await fixture<HTMLElement>(html`
        <u-fab-menu>
          <u-fab-menu-item label="A"></u-fab-menu-item>
        </u-fab-menu>
      `);
      const fabMenu = wrap as unknown as { open: boolean };
      fabMenu.open = true;
      const item = wrap.querySelector('u-fab-menu-item') as FabMenuItem;
      await item.updateComplete;
      expect(containerOf(item).classList.contains('open')).to.be.true;
    });
  });
});
