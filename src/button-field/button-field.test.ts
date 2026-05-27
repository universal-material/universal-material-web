import { expect, fixture, html } from '@open-wc/testing';

import '../menu/menu.js';
import '../ripple/ripple.js';
import { ButtonField } from './button-field.js';

suite('u-button-field', () => {
  teardown(() => {
    document.querySelectorAll('u-button-field').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-button-field', () => {
      expect(customElements.get('u-button-field')).to.equal(ButtonField);
    });

    test('is form-associated (via TextFieldBase)', () => {
      expect((ButtonField as unknown as { formAssociated: boolean }).formAssociated).to.be.true;
    });
  });

  suite('rendering', () => {
    test('renders an inner button trigger', async () => {
      const el = await fixture<ButtonField>(html`<u-button-field></u-button-field>`);
      expect(el.shadowRoot!.querySelector('.button')).to.exist;
    });

    test('renders the menu wrapper for slotted content', async () => {
      const el = await fixture<ButtonField>(html`<u-button-field></u-button-field>`);
      expect(el.shadowRoot!.querySelector('u-menu')).to.exist;
    });
  });

  suite('value get/set', () => {
    test('defaults to empty string', async () => {
      const el = await fixture<ButtonField>(html`<u-button-field></u-button-field>`);
      expect(el.value).to.equal('');
      expect(el.empty).to.be.true;
    });

    test('setting value updates empty and form value', async () => {
      const el = await fixture<ButtonField>(html`<u-button-field></u-button-field>`);
      el.value = 'something';
      expect(el.value).to.equal('something');
      expect(el.empty).to.be.false;
    });
  });

  suite('disabled', () => {
    test('disables the inner button', async () => {
      const el = await fixture<ButtonField>(html`<u-button-field disabled></u-button-field>`);
      const button = el.shadowRoot!.querySelector<HTMLButtonElement>('.button')!;
      expect(button.disabled).to.be.true;
    });
  });
});
