import { expect, fixture, html } from '@open-wc/testing';

import { FabMenu } from './fab-menu.js';

suite('u-fab-menu', () => {
  teardown(() => {
    document.querySelectorAll('u-fab-menu').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-fab-menu', () => {
      expect(customElements.get('u-fab-menu')).to.equal(FabMenu);
    });
  });

  suite('default property values', () => {
    test('color defaults to primary', async () => {
      const el = await fixture<FabMenu>(html`<u-fab-menu></u-fab-menu>`);
      expect(el.color).to.equal('primary');
    });

    test('size defaults to medium', async () => {
      const el = await fixture<FabMenu>(html`<u-fab-menu></u-fab-menu>`);
      expect(el.size).to.equal('medium');
    });

    test('lowered defaults to false', async () => {
      const el = await fixture<FabMenu>(html`<u-fab-menu></u-fab-menu>`);
      expect(el.lowered).to.be.false;
    });

    test('open defaults to false', async () => {
      const el = await fixture<FabMenu>(html`<u-fab-menu></u-fab-menu>`);
      expect(el.open).to.be.false;
    });
  });

  suite('rendering', () => {
    test('renders a container with a slot for menu items', async () => {
      const el = await fixture<FabMenu>(html`<u-fab-menu></u-fab-menu>`);
      const container = el.shadowRoot!.querySelector('.container');
      expect(container).to.exist;
      const slot = el.shadowRoot!.querySelector('.menu-items slot:not([name])');
      expect(slot).to.exist;
    });

    test('renders the toggle FAB', async () => {
      const el = await fixture<FabMenu>(html`<u-fab-menu></u-fab-menu>`);
      const toggle = el.shadowRoot!.querySelector('u-fab.toggle');
      expect(toggle).to.exist;
    });

    test('applies "open" class to the container when open is true', async () => {
      const el = await fixture<FabMenu>(html`<u-fab-menu></u-fab-menu>`);
      el.open = true;
      await el.updateComplete;
      const container = el.shadowRoot!.querySelector('.container')!;
      expect(container.classList.contains('open')).to.be.true;
    });

    test('applies the color class to the container', async () => {
      const el = await fixture<FabMenu>(html`<u-fab-menu .color=${'tertiary'}></u-fab-menu>`);
      const container = el.shadowRoot!.querySelector('.container')!;
      expect(container.classList.contains('tertiary')).to.be.true;
    });
  });

  suite('toggle interaction', () => {
    test('clicking the inner toggle FAB flips open', async () => {
      const el = await fixture<FabMenu>(html`<u-fab-menu></u-fab-menu>`);
      const toggle = el.shadowRoot!.querySelector<HTMLElement>('u-fab.toggle')!;
      expect(el.open).to.be.false;
      toggle.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      expect(el.open).to.be.true;
      toggle.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      expect(el.open).to.be.false;
    });
  });

  suite('lowered property', () => {
    test('reflects to the lowered attribute', async () => {
      const el = await fixture<FabMenu>(html`<u-fab-menu></u-fab-menu>`);
      el.lowered = true;
      await el.updateComplete;
      expect(el.hasAttribute('lowered')).to.be.true;
    });
  });

  suite('scrollContainer resolution', () => {
    type FabMenuInternals = { _effectiveScrollContainer: HTMLElement | Window | null };
    const internals = (el: FabMenu) => el as unknown as FabMenuInternals;

    test('returns window when unset', async () => {
      const el = await fixture<FabMenu>(html`<u-fab-menu></u-fab-menu>`);
      expect(internals(el)._effectiveScrollContainer).to.equal(window);
    });

    test('returns null when explicitly set to "none"', async () => {
      const el = await fixture<FabMenu>(html`<u-fab-menu scroll-container="none"></u-fab-menu>`);
      expect(internals(el)._effectiveScrollContainer).to.equal(null);
    });

    test('returns the element with matching id when set to an id string', async () => {
      const wrap = await fixture<HTMLElement>(html`
        <div>
          <div id="scroll-target"></div>
          <u-fab-menu scroll-container="scroll-target"></u-fab-menu>
        </div>
      `);
      const fm = wrap.querySelector('u-fab-menu') as FabMenu;
      const target = wrap.querySelector('#scroll-target');
      expect(internals(fm)._effectiveScrollContainer).to.equal(target);
    });
  });
});
