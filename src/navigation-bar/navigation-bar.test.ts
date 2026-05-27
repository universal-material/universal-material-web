import { expect, fixture, html } from '@open-wc/testing';

import { NavigationBarItem } from './navigation-bar-item.js';
import { NavigationBar } from './navigation-bar.js';

suite('u-navigation-bar', () => {
  teardown(() => {
    document.querySelectorAll('u-navigation-bar').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('u-navigation-bar is registered', () => {
      expect(customElements.get('u-navigation-bar')).to.equal(NavigationBar);
    });

    test('u-navigation-bar-item is registered', () => {
      expect(customElements.get('u-navigation-bar-item')).to.equal(NavigationBarItem);
    });
  });

  suite('position property', () => {
    test('defaults to "fixed"', async () => {
      const el = await fixture<NavigationBar>(html`<u-navigation-bar></u-navigation-bar>`);
      expect(el.position).to.equal('fixed');
      expect(el.getAttribute('position')).to.equal('fixed');
    });

    (['fixed', 'absolute', 'static'] as const).forEach((pos) => {
      test(`renders the "${pos}" class on the container`, async () => {
        const el = await fixture<NavigationBar>(html`<u-navigation-bar position=${pos}></u-navigation-bar>`);
        await el.updateComplete;
        const container = el.shadowRoot!.querySelector('[part="container"]')!;
        expect(container.classList.contains(pos)).to.be.true;
      });
    });
  });

  suite('spacing filler', () => {
    test('renders a spacing filler for non-static positions', async () => {
      const el = await fixture<NavigationBar>(html`<u-navigation-bar position="fixed"></u-navigation-bar>`);
      expect(el.shadowRoot!.querySelector('.spacing')).to.exist;
    });

    test('does not render a spacing filler for static position', async () => {
      const el = await fixture<NavigationBar>(html`<u-navigation-bar position="static"></u-navigation-bar>`);
      expect(el.shadowRoot!.querySelector('.spacing')).to.be.null;
    });
  });

  suite('parts', () => {
    test('exposes container and content parts', async () => {
      const el = await fixture<NavigationBar>(html`<u-navigation-bar></u-navigation-bar>`);
      expect(el.shadowRoot!.querySelector('[part="container"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="content"]')).to.exist;
    });
  });
});

suite('u-navigation-bar-item', () => {
  teardown(() => {
    document.querySelectorAll('u-navigation-bar-item').forEach((el) => el.remove());
  });

  suite('default property values', () => {
    test('active defaults to false', async () => {
      const el = await fixture<NavigationBarItem>(html`<u-navigation-bar-item></u-navigation-bar-item>`);
      expect(el.active).to.be.false;
    });

    test('variant defaults to "vertical"', async () => {
      const el = await fixture<NavigationBarItem>(html`<u-navigation-bar-item></u-navigation-bar-item>`);
      expect(el.variant).to.equal('vertical');
      expect(el.getAttribute('variant')).to.equal('vertical');
    });
  });

  suite('active reflection', () => {
    test('reflects to the active attribute', async () => {
      const el = await fixture<NavigationBarItem>(html`<u-navigation-bar-item></u-navigation-bar-item>`);
      el.active = true;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.true;
    });
  });

  suite('variant rendering', () => {
    test('vertical variant places icon outside the active indicator pill of label', async () => {
      const el = await fixture<NavigationBarItem>(html`<u-navigation-bar-item variant="vertical">Home</u-navigation-bar-item>`);
      await el.updateComplete;
      const activeIndicator = el.shadowRoot!.querySelector('[part="active-indicator"]')!;
      const labelInsideIndicator = activeIndicator.querySelector('[part="label"]');
      expect(labelInsideIndicator).to.be.null;
    });

    test('horizontal variant places icon and label inside the active indicator pill', async () => {
      const el = await fixture<NavigationBarItem>(html`<u-navigation-bar-item variant="horizontal">Home</u-navigation-bar-item>`);
      await el.updateComplete;
      const activeIndicator = el.shadowRoot!.querySelector('[part="active-indicator"]')!;
      const labelInsideIndicator = activeIndicator.querySelector('[part="label"]');
      expect(labelInsideIndicator).to.exist;
    });
  });
});
