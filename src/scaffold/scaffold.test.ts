import { expect, fixture, html } from '@open-wc/testing';

import './pane.js';
import { Scaffold } from './scaffold.js';

const waitFor = (ms = 16) => new Promise<void>((r) => setTimeout(r, ms));

suite('u-scaffold', () => {
  teardown(() => {
    document.querySelectorAll('u-scaffold').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-scaffold', () => {
      expect(customElements.get('u-scaffold')).to.equal(Scaffold);
    });
  });

  suite('rendering parts', () => {
    test('exposes top-bar, body-row, bottom-bar, fab parts', async () => {
      const el = await fixture<Scaffold>(html`<u-scaffold></u-scaffold>`);
      expect(el.shadowRoot!.querySelector('[part="top-bar"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="body-row"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="bottom-bar"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="fab"]')).to.exist;
    });

    test('exposes named slots: top-bar, bottom-bar, fab, default', async () => {
      const el = await fixture<Scaffold>(html`<u-scaffold></u-scaffold>`);
      expect(el.shadowRoot!.querySelector('slot[name="top-bar"]')).to.exist;
      expect(el.shadowRoot!.querySelector('slot[name="bottom-bar"]')).to.exist;
      expect(el.shadowRoot!.querySelector('slot[name="fab"]')).to.exist;
      expect(el.shadowRoot!.querySelector('slot:not([name])')).to.exist;
    });
  });

  suite('pane alignment auto-assignment', () => {
    test('panes before the body get data-align="start"', async () => {
      const el = await fixture<Scaffold>(html`
        <u-scaffold>
          <u-pane id="p1"></u-pane>
          <main id="body">content</main>
        </u-scaffold>
      `);
      await el.updateComplete;
      await waitFor();
      const pane = el.querySelector('#p1')!;
      expect(pane.getAttribute('data-align')).to.equal('start');
    });

    test('panes after the body get data-align="end"', async () => {
      const el = await fixture<Scaffold>(html`
        <u-scaffold>
          <main id="body">content</main>
          <u-pane id="p1"></u-pane>
        </u-scaffold>
      `);
      await el.updateComplete;
      await waitFor();
      const pane = el.querySelector('#p1')!;
      expect(pane.getAttribute('data-align')).to.equal('end');
    });

    test('without a body, only the last pane gets data-align="end"', async () => {
      const el = await fixture<Scaffold>(html`
        <u-scaffold>
          <u-pane id="p1"></u-pane>
          <u-pane id="p2"></u-pane>
        </u-scaffold>
      `);
      await el.updateComplete;
      await waitFor();
      expect(el.querySelector('#p1')!.getAttribute('data-align')).to.equal('start');
      expect(el.querySelector('#p2')!.getAttribute('data-align')).to.equal('end');
    });

    test('single pane without body stays "start"', async () => {
      const el = await fixture<Scaffold>(html`
        <u-scaffold>
          <u-pane id="p1"></u-pane>
        </u-scaffold>
      `);
      await el.updateComplete;
      await waitFor();
      expect(el.querySelector('#p1')!.getAttribute('data-align')).to.equal('start');
    });

    test('ignores panes when assigning slot="top-bar"/"bottom-bar"/"fab"', async () => {
      const el = await fixture<Scaffold>(html`
        <u-scaffold>
          <u-pane slot="top-bar"></u-pane>
          <u-pane id="p1"></u-pane>
        </u-scaffold>
      `);
      await el.updateComplete;
      await waitFor();
      const slotted = el.querySelector('u-pane[slot="top-bar"]')!;
      // The top-bar pane should NOT get a data-align (it's not in the body row).
      expect(slotted.hasAttribute('data-align')).to.be.false;
    });
  });
});
