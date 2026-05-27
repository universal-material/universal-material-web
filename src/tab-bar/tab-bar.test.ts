import { expect, fixture, html, oneEvent } from '@open-wc/testing';

import { TabBar } from './tab-bar.js';
import { Tab } from './tab.js';

suite('u-tab-bar / u-tab', () => {
  teardown(() => {
    document.querySelectorAll('u-tab-bar').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('u-tab-bar is registered', () => {
      expect(customElements.get('u-tab-bar')).to.equal(TabBar);
    });

    test('u-tab is registered', () => {
      expect(customElements.get('u-tab')).to.equal(Tab);
    });
  });

  suite('variant property', () => {
    test('defaults to "primary"', async () => {
      const el = await fixture<TabBar>(html`<u-tab-bar></u-tab-bar>`);
      expect(el.variant).to.equal('primary');
      expect(el.getAttribute('variant')).to.equal('primary');
    });

    test('reflects "secondary" to the variant attribute', async () => {
      const el = await fixture<TabBar>(html`<u-tab-bar variant="secondary"></u-tab-bar>`);
      expect(el.variant).to.equal('secondary');
      expect(el.getAttribute('variant')).to.equal('secondary');
      const container = el.shadowRoot!.querySelector('.container')!;
      expect(container.classList.contains('secondary')).to.be.true;
    });

    test('property assignment also reflects to the attribute', async () => {
      const el = await fixture<TabBar>(html`<u-tab-bar></u-tab-bar>`);
      el.variant = 'secondary';
      await el.updateComplete;
      expect(el.variant).to.equal('secondary');
      expect(el.getAttribute('variant')).to.equal('secondary');
    });
  });

  suite('initial active tab', () => {
    test('makes the first tab active by default', async () => {
      const bar = await fixture<TabBar>(html`
        <u-tab-bar>
          <u-tab>A</u-tab>
          <u-tab>B</u-tab>
        </u-tab-bar>
      `);
      await bar.updateComplete;
      const tabs = bar.querySelectorAll<Tab>('u-tab');
      expect(bar.activeTab).to.equal(tabs[0]);
      expect(bar.activeTabIndex).to.equal(0);
    });
  });

  suite('activeTab setter', () => {
    test('switches the active tab when set to a known tab', async () => {
      const bar = await fixture<TabBar>(html`
        <u-tab-bar>
          <u-tab>A</u-tab>
          <u-tab>B</u-tab>
        </u-tab-bar>
      `);
      await bar.updateComplete;
      const tabs = bar.querySelectorAll<Tab>('u-tab');
      bar.activeTab = tabs[1];
      expect(bar.activeTab).to.equal(tabs[1]);
      expect(bar.activeTabIndex).to.equal(1);
    });

    test('ignores setting an unknown tab', async () => {
      const bar = await fixture<TabBar>(html`
        <u-tab-bar>
          <u-tab>A</u-tab>
        </u-tab-bar>
      `);
      await bar.updateComplete;
      const stranger = document.createElement('u-tab') as Tab;
      bar.activeTab = stranger;
      expect(bar.activeTab).to.not.equal(stranger);
    });
  });

  suite('activeTabIndex setter', () => {
    test('updates activeTab', async () => {
      const bar = await fixture<TabBar>(html`
        <u-tab-bar>
          <u-tab>A</u-tab>
          <u-tab>B</u-tab>
          <u-tab>C</u-tab>
        </u-tab-bar>
      `);
      await bar.updateComplete;
      bar.activeTabIndex = 2;
      expect(bar.activeTabIndex).to.equal(2);
    });
  });

  suite('change events', () => {
    test('clicking a tab fires "changing" then "change" on the bar', async () => {
      const bar = await fixture<TabBar>(html`
        <u-tab-bar>
          <u-tab>A</u-tab>
          <u-tab>B</u-tab>
        </u-tab-bar>
      `);
      await bar.updateComplete;
      const tabs = bar.querySelectorAll<Tab>('u-tab');

      let changing = false;
      let changed = false;
      bar.addEventListener('changing', () => (changing = true));
      bar.addEventListener('change', () => (changed = true));

      tabs[1].shadowRoot!.querySelector<HTMLElement>('button')!.click();

      expect(changing).to.be.true;
      expect(changed).to.be.true;
      expect(bar.activeTab).to.equal(tabs[1]);
    });

    test('preventDefault on "changing" blocks the activation', async () => {
      const bar = await fixture<TabBar>(html`
        <u-tab-bar>
          <u-tab>A</u-tab>
          <u-tab>B</u-tab>
        </u-tab-bar>
      `);
      await bar.updateComplete;
      const tabs = bar.querySelectorAll<Tab>('u-tab');
      bar.addEventListener('changing', (e) => e.preventDefault());

      tabs[1].shadowRoot!.querySelector<HTMLElement>('button')!.click();

      expect(bar.activeTab).to.equal(tabs[0]);
    });
  });

  suite('changing event is cancelable', () => {
    test('cancelable flag is true', async () => {
      const bar = await fixture<TabBar>(html`
        <u-tab-bar>
          <u-tab>A</u-tab>
          <u-tab>B</u-tab>
        </u-tab-bar>
      `);
      await bar.updateComplete;
      const tabs = bar.querySelectorAll<Tab>('u-tab');

      setTimeout(() => tabs[1].shadowRoot!.querySelector<HTMLElement>('button')!.click());
      const event = await oneEvent(bar, 'changing');
      expect(event.cancelable).to.be.true;
    });
  });
});
