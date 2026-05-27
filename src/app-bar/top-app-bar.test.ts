import { expect, fixture, html } from '@open-wc/testing';

import { TopAppBar } from './top-app-bar.js';

suite('u-top-app-bar', () => {
  teardown(() => {
    document.querySelectorAll('u-top-app-bar').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-top-app-bar', () => {
      expect(customElements.get('u-top-app-bar')).to.equal(TopAppBar);
    });
  });

  suite('default property values', () => {
    test('position defaults to "fixed"', async () => {
      const el = await fixture<TopAppBar>(html`<u-top-app-bar></u-top-app-bar>`);
      expect(el.position).to.equal('fixed');
    });

    test('size defaults to "small"', async () => {
      const el = await fixture<TopAppBar>(html`<u-top-app-bar></u-top-app-bar>`);
      expect(el.size).to.equal('small');
    });

    test('headline defaults to empty string', async () => {
      const el = await fixture<TopAppBar>(html`<u-top-app-bar></u-top-app-bar>`);
      expect(el.headline).to.equal('');
    });
  });

  suite('position rendering', () => {
    (['fixed', 'absolute', 'static'] as const).forEach((pos) => {
      test(`applies the "${pos}" class to the container`, async () => {
        const el = await fixture<TopAppBar>(html`<u-top-app-bar position=${pos}></u-top-app-bar>`);
        await el.updateComplete;
        const container = el.shadowRoot!.querySelector('[part="container"]')!;
        expect(container.classList.contains(pos)).to.be.true;
      });
    });
  });

  suite('size rendering', () => {
    (['small', 'medium', 'large'] as const).forEach((size) => {
      test(`applies the "${size}" class to the container`, async () => {
        const el = await fixture<TopAppBar>(html`<u-top-app-bar size=${size}></u-top-app-bar>`);
        await el.updateComplete;
        const container = el.shadowRoot!.querySelector('[part="container"]')!;
        expect(container.classList.contains(size)).to.be.true;
      });
    });

    test('renders an extended-content area only when size is not "small"', async () => {
      const small = await fixture<TopAppBar>(html`<u-top-app-bar size="small"></u-top-app-bar>`);
      expect(small.shadowRoot!.querySelector('[part="extended-content"]')).to.be.null;

      const medium = await fixture<TopAppBar>(html`<u-top-app-bar size="medium"></u-top-app-bar>`);
      expect(medium.shadowRoot!.querySelector('[part="extended-content"]')).to.exist;
    });
  });

  suite('headline rendering', () => {
    test('renders the headline string into the headline part', async () => {
      const el = await fixture<TopAppBar>(html`<u-top-app-bar headline="Inbox"></u-top-app-bar>`);
      await el.updateComplete;
      const headline = el.shadowRoot!.querySelector('[part="headline"]')!;
      expect(headline.textContent!.trim()).to.equal('Inbox');
    });
  });

  suite('spacing filler', () => {
    test('renders a spacing filler for non-static positions', async () => {
      const el = await fixture<TopAppBar>(html`<u-top-app-bar position="fixed"></u-top-app-bar>`);
      expect(el.shadowRoot!.querySelector('.spacing')).to.exist;
    });

    test('does not render a spacing filler for static position', async () => {
      const el = await fixture<TopAppBar>(html`<u-top-app-bar position="static"></u-top-app-bar>`);
      expect(el.shadowRoot!.querySelector('.spacing')).to.be.null;
    });
  });
});
