import { expect, fixture, html } from '@open-wc/testing';

// tab-bar must be registered before tab so tab's connectedCallback can talk
// to its parent.
import './tab-bar.js';
import { TabBar } from './tab-bar.js';
import { Tab } from './tab.js';

// Tab-bar-driven behavior (changing/change events, activeTab setter, etc.) is
// already covered in tab-bar.test.ts. This file targets Tab-specific behavior:
// hasIcon detection, no-op when standalone, disconnect handling.
suite('u-tab', () => {
  teardown(() => {
    document.querySelectorAll('u-tab, u-tab-bar').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-tab', () => {
      expect(customElements.get('u-tab')).to.equal(Tab);
    });
  });

  suite('hasIcon property', () => {
    test('defaults to false when no icon is slotted', async () => {
      const bar = await fixture<TabBar>(html`<u-tab-bar><u-tab>A</u-tab></u-tab-bar>`);
      await bar.updateComplete;
      const tab = bar.querySelector('u-tab') as Tab;
      await tab.updateComplete;
      expect(tab.hasIcon).to.be.false;
    });

    test('becomes true when an element is slotted into the icon slot', async () => {
      const bar = await fixture<TabBar>(html`
        <u-tab-bar>
          <u-tab>
            <span slot="icon">★</span>
            A
          </u-tab>
        </u-tab-bar>
      `);
      await bar.updateComplete;
      const tab = bar.querySelector('u-tab') as Tab;
      await tab.updateComplete;
      expect(tab.hasIcon).to.be.true;
    });

    test('renders an "icon" part inside the tab content', async () => {
      const bar = await fixture<TabBar>(html`<u-tab-bar><u-tab>A</u-tab></u-tab-bar>`);
      await bar.updateComplete;
      const tab = bar.querySelector('u-tab') as Tab;
      expect(tab.shadowRoot!.querySelector('[part="icon"]')).to.exist;
      expect(tab.shadowRoot!.querySelector('[part="label"]')).to.exist;
    });

    test('adds the "has-icon" class to .tab-content when an icon is present', async () => {
      const bar = await fixture<TabBar>(html`
        <u-tab-bar>
          <u-tab>
            <span slot="icon">★</span>
            A
          </u-tab>
        </u-tab-bar>
      `);
      await bar.updateComplete;
      const tab = bar.querySelector('u-tab') as Tab;
      await tab.updateComplete;
      const content = tab.shadowRoot!.querySelector('.tab-content') as HTMLElement;
      expect(content.classList.contains('has-icon')).to.be.true;
    });
  });

  suite('active getter/setter without a parent bar', () => {
    test('active getter returns false when there is no parent bar', async () => {
      const tab = await fixture<Tab>(html`<u-tab>A</u-tab>`);
      expect(tab._bar).to.equal(null);
      expect(tab.active).to.be.false;
    });

    test('setting active is a no-op when there is no parent bar', async () => {
      const tab = await fixture<Tab>(html`<u-tab>A</u-tab>`);
      tab.active = true;
      expect(tab.active).to.be.false;
    });
  });

  suite('active getter inside a tab-bar', () => {
    test('reflects the parent\'s activeTab', async () => {
      const bar = await fixture<TabBar>(html`
        <u-tab-bar>
          <u-tab>A</u-tab>
          <u-tab>B</u-tab>
        </u-tab-bar>
      `);
      await bar.updateComplete;
      const tabs = bar.querySelectorAll<Tab>('u-tab');
      expect(tabs[0].active).to.be.true;
      expect(tabs[1].active).to.be.false;

      bar.activeTab = tabs[1];
      expect(tabs[0].active).to.be.false;
      expect(tabs[1].active).to.be.true;
    });

    test('setting active=true on a non-active tab promotes it', async () => {
      const bar = await fixture<TabBar>(html`
        <u-tab-bar>
          <u-tab>A</u-tab>
          <u-tab>B</u-tab>
        </u-tab-bar>
      `);
      await bar.updateComplete;
      const tabs = bar.querySelectorAll<Tab>('u-tab');
      tabs[1].active = true;
      expect(bar.activeTab).to.equal(tabs[1]);
    });

    test('setting active=false resets the bar to the first tab', async () => {
      const bar = await fixture<TabBar>(html`
        <u-tab-bar>
          <u-tab>A</u-tab>
          <u-tab>B</u-tab>
        </u-tab-bar>
      `);
      await bar.updateComplete;
      const tabs = bar.querySelectorAll<Tab>('u-tab');
      bar.activeTab = tabs[1];

      tabs[1].active = false;
      expect(bar.activeTabIndex).to.equal(0);
    });
  });

  suite('disconnection', () => {
    test('removing the active tab resets the bar to index 0 and clears _bar', async () => {
      const bar = await fixture<TabBar>(html`
        <u-tab-bar>
          <u-tab>A</u-tab>
          <u-tab>B</u-tab>
        </u-tab-bar>
      `);
      await bar.updateComplete;
      const tabs = bar.querySelectorAll<Tab>('u-tab');
      bar.activeTab = tabs[1];
      const removed = tabs[1];

      removed.remove();
      // Slotchange recomputes the tab list and points to the surviving first tab.
      expect(removed._bar).to.equal(null);
    });
  });
});
