import { expect, fixture, html } from '@open-wc/testing';

import '../list/list-item.js';
import { CheckboxListItem } from './checkbox-list-item.js';

suite('u-checkbox-list-item', () => {
  teardown(() => {
    document.querySelectorAll('u-checkbox-list-item').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-checkbox-list-item', () => {
      expect(customElements.get('u-checkbox-list-item')).to.equal(CheckboxListItem);
    });

    test('inherits the form-associated flag from Checkbox', () => {
      expect((CheckboxListItem as unknown as { formAssociated: boolean }).formAssociated).to.be.true;
    });
  });

  suite('rendering', () => {
    test('wraps the checkbox in a u-list-item', async () => {
      const el = await fixture<CheckboxListItem>(html`<u-checkbox-list-item>Agree</u-checkbox-list-item>`);
      const listItem = el.shadowRoot!.querySelector('u-list-item');
      expect(listItem).to.exist;
    });

    test('places the checkbox in the trailing slot by default', async () => {
      const el = await fixture<CheckboxListItem>(html`<u-checkbox-list-item>Agree</u-checkbox-list-item>`);
      const trailing = el.shadowRoot!.querySelector('[slot="trailing-icon"]');
      const leading = el.shadowRoot!.querySelector('[slot="leading-icon"]');
      expect(trailing).to.exist;
      expect(leading).to.be.null;
    });

    test('places the checkbox in the leading slot when leading=true', async () => {
      const el = await fixture<CheckboxListItem>(html`<u-checkbox-list-item leading>Agree</u-checkbox-list-item>`);
      const leading = el.shadowRoot!.querySelector('[slot="leading-icon"]');
      const trailing = el.shadowRoot!.querySelector('[slot="trailing-icon"]');
      expect(leading).to.exist;
      expect(trailing).to.be.null;
    });

    test('exposes a #label span for the default slot', async () => {
      const el = await fixture<CheckboxListItem>(html`<u-checkbox-list-item>Agree</u-checkbox-list-item>`);
      const label = el.shadowRoot!.querySelector('#label');
      expect(label).to.exist;
      const slot = label!.querySelector('slot:not([name])')!;
      const text = (slot as HTMLSlotElement).assignedNodes({ flatten: true })
        .map((n) => n.textContent ?? '').join('').trim();
      expect(text).to.equal('Agree');
    });

    test('exposes a supporting-text slot via the #description span', async () => {
      const el = await fixture<CheckboxListItem>(html`
        <u-checkbox-list-item>
          Agree
          <span slot="supporting-text">terms apply</span>
        </u-checkbox-list-item>
      `);
      const description = el.shadowRoot!.querySelector('#description');
      expect(description).to.exist;
      const supporting = description!.querySelector('slot[name="supporting-text"]')!;
      const assigned = (supporting as HTMLSlotElement).assignedElements();
      expect(assigned[0].textContent).to.equal('terms apply');
    });
  });

  suite('list-item state', () => {
    test('the inner u-list-item is selectable while not disabled', async () => {
      const el = await fixture<CheckboxListItem>(html`<u-checkbox-list-item>x</u-checkbox-list-item>`);
      const listItem = el.shadowRoot!.querySelector('u-list-item')!;
      expect(listItem.hasAttribute('selectable')).to.be.true;
    });

    test('the inner u-list-item is not selectable when disabled', async () => {
      const el = await fixture<CheckboxListItem>(html`<u-checkbox-list-item disabled>x</u-checkbox-list-item>`);
      const listItem = el.shadowRoot!.querySelector('u-list-item')!;
      expect(listItem.hasAttribute('selectable')).to.be.false;
    });
  });

  suite('checked behavior (inherited)', () => {
    test('checked property reflects to the inner input', async () => {
      const el = await fixture<CheckboxListItem>(html`<u-checkbox-list-item .checked=${true}>x</u-checkbox-list-item>`);
      expect(el.checked).to.be.true;
    });
  });
});
