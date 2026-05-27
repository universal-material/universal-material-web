import { expect, fixture, html } from '@open-wc/testing';

import '../list/list-item.js';
import { RadioListItem } from './radio-list-item.js';

suite('u-radio-list-item', () => {
  teardown(() => {
    document.querySelectorAll('u-radio-list-item').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-radio-list-item', () => {
      expect(customElements.get('u-radio-list-item')).to.equal(RadioListItem);
    });

    test('inherits the form-associated flag from Radio', () => {
      expect((RadioListItem as unknown as { formAssociated: boolean }).formAssociated).to.be.true;
    });
  });

  suite('rendering', () => {
    test('wraps the radio in a u-list-item', async () => {
      const el = await fixture<RadioListItem>(html`<u-radio-list-item>Pick me</u-radio-list-item>`);
      expect(el.shadowRoot!.querySelector('u-list-item')).to.exist;
    });

    test('defaults to trailing position', async () => {
      const el = await fixture<RadioListItem>(html`<u-radio-list-item>x</u-radio-list-item>`);
      expect(el.shadowRoot!.querySelector('[slot="trailing-icon"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[slot="leading-icon"]')).to.be.null;
    });

    test('moves to leading position when leading=true', async () => {
      const el = await fixture<RadioListItem>(html`<u-radio-list-item leading>x</u-radio-list-item>`);
      expect(el.shadowRoot!.querySelector('[slot="leading-icon"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[slot="trailing-icon"]')).to.be.null;
    });
  });

  suite('group selection (inherited)', () => {
    test('checking one item unchecks siblings with the same name', async () => {
      const root = await fixture<HTMLElement>(html`
        <div>
          <u-radio-list-item name="g" value="a" .checked=${true}>A</u-radio-list-item>
          <u-radio-list-item name="g" value="b">B</u-radio-list-item>
        </div>
      `);
      const [a, b] = Array.from(root.querySelectorAll<RadioListItem>('u-radio-list-item'));
      b.checked = true;
      expect(a.checked).to.be.false;
      expect(b.checked).to.be.true;
    });
  });

  suite('list-item state', () => {
    test('inner u-list-item is non-selectable when disabled', async () => {
      const el = await fixture<RadioListItem>(html`<u-radio-list-item disabled>x</u-radio-list-item>`);
      const listItem = el.shadowRoot!.querySelector('u-list-item')!;
      expect(listItem.hasAttribute('selectable')).to.be.false;
    });
  });
});
