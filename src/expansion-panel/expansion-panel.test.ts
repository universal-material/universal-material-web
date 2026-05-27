import { expect, fixture, html, oneEvent } from '@open-wc/testing';

import { ExpansionPanel } from './expansion-panel.js';

suite('u-expansion-panel', () => {
  teardown(() => {
    document.querySelectorAll('u-expansion-panel').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-expansion-panel', () => {
      expect(customElements.get('u-expansion-panel')).to.equal(ExpansionPanel);
    });
  });

  suite('rendering', () => {
    test('renders the header and content parts', async () => {
      const el = await fixture<ExpansionPanel>(html`<u-expansion-panel></u-expansion-panel>`);
      expect(el.shadowRoot!.querySelector('[part="header"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="content"]')).to.exist;
    });

    test('renders the chevron by default', async () => {
      const el = await fixture<ExpansionPanel>(html`<u-expansion-panel></u-expansion-panel>`);
      expect(el.shadowRoot!.querySelector('[part="chevron"]')).to.exist;
    });

    test('hides the chevron when hide-toggle is set', async () => {
      const el = await fixture<ExpansionPanel>(html`<u-expansion-panel hide-toggle></u-expansion-panel>`);
      expect(el.shadowRoot!.querySelector('[part="chevron"]')).to.be.null;
    });
  });

  suite('expanded property', () => {
    test('defaults to false', async () => {
      const el = await fixture<ExpansionPanel>(html`<u-expansion-panel></u-expansion-panel>`);
      expect(el.expanded).to.be.false;
      expect(el.hasAttribute('expanded')).to.be.false;
    });

    test('reflects to the expanded attribute', async () => {
      const el = await fixture<ExpansionPanel>(html`<u-expansion-panel></u-expansion-panel>`);
      el.expanded = true;
      await el.updateComplete;
      expect(el.hasAttribute('expanded')).to.be.true;
    });

    test('opens the inner collapse when expanded becomes true', async () => {
      const el = await fixture<ExpansionPanel>(html`<u-expansion-panel></u-expansion-panel>`);
      el.expanded = true;
      await el.updateComplete;
      const collapse = el.shadowRoot!.querySelector('u-collapse')!;
      expect(collapse.hasAttribute('open')).to.be.true;
    });
  });

  suite('toggle()', () => {
    test('flips expanded', async () => {
      const el = await fixture<ExpansionPanel>(html`<u-expansion-panel></u-expansion-panel>`);
      el.toggle();
      expect(el.expanded).to.be.true;
      el.toggle();
      expect(el.expanded).to.be.false;
    });

    test('is a no-op when disabled', async () => {
      const el = await fixture<ExpansionPanel>(html`<u-expansion-panel disabled></u-expansion-panel>`);
      el.toggle();
      expect(el.expanded).to.be.false;
    });
  });

  suite('change event', () => {
    test('dispatches change when expanded toggles', async () => {
      const el = await fixture<ExpansionPanel>(html`<u-expansion-panel></u-expansion-panel>`);
      setTimeout(() => el.toggle());
      const event = await oneEvent(el, 'change');
      expect(event).to.exist;
      expect(event.bubbles).to.be.true;
    });

    test('does not dispatch change when set to the same value', async () => {
      const el = await fixture<ExpansionPanel>(html`<u-expansion-panel></u-expansion-panel>`);
      let count = 0;
      el.addEventListener('change', () => count++);
      el.expanded = false;
      el.expanded = false;
      expect(count).to.equal(0);
    });
  });

  suite('header click toggles', () => {
    test('clicking the header toggles expanded', async () => {
      const el = await fixture<ExpansionPanel>(html`<u-expansion-panel></u-expansion-panel>`);
      const header = el.shadowRoot!.querySelector<HTMLElement>('[part="header"]')!;
      header.click();
      expect(el.expanded).to.be.true;
    });

    test('clicking the header when disabled does nothing', async () => {
      const el = await fixture<ExpansionPanel>(html`<u-expansion-panel disabled></u-expansion-panel>`);
      const header = el.shadowRoot!.querySelector<HTMLElement>('[part="header"]')!;
      header.click();
      expect(el.expanded).to.be.false;
    });
  });
});
