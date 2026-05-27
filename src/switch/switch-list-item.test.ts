import { expect, fixture, html } from '@open-wc/testing';

import '../list/list-item.js';
import { SwitchListItem } from './switch-list-item.js';

suite('u-switch-list-item', () => {
  teardown(() => {
    document.querySelectorAll('u-switch-list-item').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-switch-list-item', () => {
      expect(customElements.get('u-switch-list-item')).to.equal(SwitchListItem);
    });

    test('inherits the form-associated flag from Switch', () => {
      expect((SwitchListItem as unknown as { formAssociated: boolean }).formAssociated).to.be.true;
    });
  });

  suite('rendering', () => {
    test('wraps the switch in a u-list-item', async () => {
      const el = await fixture<SwitchListItem>(html`<u-switch-list-item>Notifications</u-switch-list-item>`);
      expect(el.shadowRoot!.querySelector('u-list-item')).to.exist;
    });

    test('defaults to trailing position', async () => {
      const el = await fixture<SwitchListItem>(html`<u-switch-list-item>x</u-switch-list-item>`);
      expect(el.shadowRoot!.querySelector('[slot="trailing-icon"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[slot="leading-icon"]')).to.be.null;
    });

    test('moves to leading position when leading=true', async () => {
      const el = await fixture<SwitchListItem>(html`<u-switch-list-item leading>x</u-switch-list-item>`);
      expect(el.shadowRoot!.querySelector('[slot="leading-icon"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[slot="trailing-icon"]')).to.be.null;
    });

    test('supporting-text slot fed through to the inner list-item', async () => {
      const el = await fixture<SwitchListItem>(html`
        <u-switch-list-item>
          Wifi
          <span slot="supporting-text">5 GHz preferred</span>
        </u-switch-list-item>
      `);
      const supporting = el.shadowRoot!.querySelector('#description slot[name="supporting-text"]')!;
      const assigned = (supporting as HTMLSlotElement).assignedElements();
      expect(assigned[0].textContent).to.equal('5 GHz preferred');
    });
  });

  suite('checked behavior (inherited)', () => {
    test('checked toggle works via property binding', async () => {
      const el = await fixture<SwitchListItem>(html`<u-switch-list-item .checked=${true}>x</u-switch-list-item>`);
      expect(el.checked).to.be.true;
    });
  });
});
