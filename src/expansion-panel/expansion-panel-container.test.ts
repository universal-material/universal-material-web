import { expect, fixture, html } from '@open-wc/testing';

import { ExpansionPanel } from './expansion-panel.js';
import { ExpansionPanelContainer } from './expansion-panel-container.js';

suite('u-expansion-panel-container', () => {
  teardown(() => {
    document.querySelectorAll('u-expansion-panel-container').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-expansion-panel-container', () => {
      expect(customElements.get('u-expansion-panel-container')).to.equal(ExpansionPanelContainer);
    });
  });

  suite('multi property', () => {
    test('defaults to false', async () => {
      const el = await fixture<ExpansionPanelContainer>(html`<u-expansion-panel-container></u-expansion-panel-container>`);
      expect(el.multi).to.be.false;
      expect(el.hasAttribute('multi')).to.be.false;
    });

    test('reflects to the multi attribute when set', async () => {
      const el = await fixture<ExpansionPanelContainer>(html`<u-expansion-panel-container></u-expansion-panel-container>`);
      el.multi = true;
      await el.updateComplete;
      expect(el.hasAttribute('multi')).to.be.true;
    });
  });

  suite('rendering', () => {
    test('renders a default slot for panel children', async () => {
      const el = await fixture<ExpansionPanelContainer>(html`<u-expansion-panel-container></u-expansion-panel-container>`);
      expect(el.shadowRoot!.querySelector('slot')).to.exist;
    });
  });

  suite('exclusive mode (multi=false)', () => {
    test('opening a panel closes any other expanded sibling', async () => {
      const wrap = await fixture<ExpansionPanelContainer>(html`
        <u-expansion-panel-container>
          <u-expansion-panel expanded></u-expansion-panel>
          <u-expansion-panel></u-expansion-panel>
        </u-expansion-panel-container>
      `);
      const [first, second] = Array.from(wrap.querySelectorAll<ExpansionPanel>('u-expansion-panel'));
      expect(first.expanded).to.be.true;
      second.expanded = true;
      expect(first.expanded).to.be.false;
      expect(second.expanded).to.be.true;
    });

    test('does not close the same panel that triggered the change', async () => {
      const wrap = await fixture<ExpansionPanelContainer>(html`
        <u-expansion-panel-container>
          <u-expansion-panel></u-expansion-panel>
        </u-expansion-panel-container>
      `);
      const panel = wrap.querySelector<ExpansionPanel>('u-expansion-panel')!;
      panel.expanded = true;
      expect(panel.expanded).to.be.true;
    });
  });

  suite('multi mode (multi=true)', () => {
    test('opening a panel leaves others expanded', async () => {
      const wrap = await fixture<ExpansionPanelContainer>(html`
        <u-expansion-panel-container multi>
          <u-expansion-panel expanded></u-expansion-panel>
          <u-expansion-panel></u-expansion-panel>
        </u-expansion-panel-container>
      `);
      const [first, second] = Array.from(wrap.querySelectorAll<ExpansionPanel>('u-expansion-panel'));
      second.expanded = true;
      expect(first.expanded).to.be.true;
      expect(second.expanded).to.be.true;
    });
  });

  suite('non-panel children', () => {
    test('ignores change events from non-ExpansionPanel descendants', async () => {
      const wrap = await fixture<ExpansionPanelContainer>(html`
        <u-expansion-panel-container>
          <u-expansion-panel expanded></u-expansion-panel>
          <div id="other"></div>
        </u-expansion-panel-container>
      `);
      const other = wrap.querySelector('#other')!;
      other.dispatchEvent(new Event('change', { bubbles: true }));
      const panel = wrap.querySelector<ExpansionPanel>('u-expansion-panel')!;
      expect(panel.expanded).to.be.true;
    });
  });
});
