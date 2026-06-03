import { expect, fixture, html, oneEvent } from '@open-wc/testing';

import { TextField } from './text-field.js';

const inputOf = (el: TextField) =>
  el.shadowRoot!.querySelector<HTMLInputElement>('input')!;

suite('u-text-field', () => {
  teardown(() => {
    document.querySelectorAll('u-text-field').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-text-field', () => {
      expect(customElements.get('u-text-field')).to.equal(TextField);
    });

    test('is form-associated', () => {
      expect((TextField as unknown as { formAssociated: boolean }).formAssociated).to.be.true;
    });
  });

  suite('rendering', () => {
    test('renders an internal <input>', async () => {
      const el = await fixture<TextField>(html`<u-text-field></u-text-field>`);
      expect(inputOf(el)).to.exist;
    });

    test('defaults type to "text"', async () => {
      const el = await fixture<TextField>(html`<u-text-field></u-text-field>`);
      expect(inputOf(el).type).to.equal('text');
    });

    test('passes type through to the inner input', async () => {
      const el = await fixture<TextField>(html`<u-text-field type="email"></u-text-field>`);
      expect(inputOf(el).type).to.equal('email');
    });

    test('renders the label', async () => {
      const el = await fixture<TextField>(html`<u-text-field label="Name"></u-text-field>`);
      const labelEl = el.shadowRoot!.querySelector('.label')!;
      expect(labelEl.textContent!.trim()).to.equal('Name');
    });

    test('renders supportingText into the supporting-text slot fallback', async () => {
      const el = await fixture<TextField>(html`
        <u-text-field supporting-text="hint"></u-text-field>
      `);
      const supporting = el.shadowRoot!.querySelector('[name="supporting-text"]')!;
      expect(supporting.textContent!.trim()).to.equal('hint');
    });

    test('renders errorText into the error-text slot fallback', async () => {
      const el = await fixture<TextField>(html`
        <u-text-field error-text="bad"></u-text-field>
      `);
      const error = el.shadowRoot!.querySelector('[name="error-text"]')!;
      expect(error.textContent!.trim()).to.equal('bad');
    });

    test('renders prefixText into the prefix slot fallback', async () => {
      const el = await fixture<TextField>(html`
        <u-text-field prefix-text="$"></u-text-field>
      `);
      const prefix = el.shadowRoot!.querySelector('[name="prefix"]')!;
      expect(prefix.textContent!.trim()).to.equal('$');
    });

    test('renders suffixText into the suffix slot fallback', async () => {
      const el = await fixture<TextField>(html`
        <u-text-field suffix-text="kg"></u-text-field>
      `);
      const suffix = el.shadowRoot!.querySelector('[name="suffix"]')!;
      expect(suffix.textContent!.trim()).to.equal('kg');
    });
  });

  suite('value property', () => {
    test('reflects to the inner input', async () => {
      const el = await fixture<TextField>(html`<u-text-field></u-text-field>`);
      el.value = 'hello';
      await el.updateComplete;
      expect(inputOf(el).value).to.equal('hello');
    });

    test('typing into the input updates the property and clears empty', async () => {
      const el = await fixture<TextField>(html`<u-text-field></u-text-field>`);
      const input = inputOf(el);
      input.value = 'typed';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      expect(el.value).to.equal('typed');
      expect(el.empty).to.be.false;
    });

    test('clearing the input sets empty back to true', async () => {
      const el = await fixture<TextField>(html`<u-text-field .value=${'x'}></u-text-field>`);
      expect(el.empty).to.be.false;
      const input = inputOf(el);
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      expect(el.empty).to.be.true;
    });
  });

  suite('disabled / readOnly', () => {
    test('disabled disables the inner input', async () => {
      const el = await fixture<TextField>(html`<u-text-field disabled></u-text-field>`);
      expect(inputOf(el).disabled).to.be.true;
      expect(el.hasAttribute('disabled')).to.be.true;
    });

    test('readOnly applies the readonly attribute to the inner input', async () => {
      const el = await fixture<TextField>(html`<u-text-field readonly></u-text-field>`);
      expect(inputOf(el).readOnly).to.be.true;
    });
  });

  suite('input event', () => {
    test('inputting fires an input event that bubbles', async () => {
      const el = await fixture<TextField>(html`<u-text-field></u-text-field>`);
      const input = inputOf(el);

      setTimeout(() => {
        input.value = 'x';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      });

      const event = await oneEvent(el, 'input');
      expect(event).to.exist;
      expect(event.bubbles).to.be.true;
    });
  });

  suite('Enter key submits the form', () => {
    test('pressing Enter requests submit on the parent form', async () => {
      const formEl = await fixture<HTMLFormElement>(html`
        <form><u-text-field name="x"></u-text-field></form>
      `);
      const tf = formEl.querySelector('u-text-field') as TextField;
      const input = inputOf(tf);
      let submitted = false;
      formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        submitted = true;
      });
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      expect(submitted).to.be.true;
    });
  });

  suite('form association', () => {
    test('submits the current value with the form', async () => {
      const formEl = await fixture<HTMLFormElement>(html`
        <form><u-text-field name="x" .value=${'abc'}></u-text-field></form>
      `);
      const data = new FormData(formEl);
      expect(data.get('x')).to.equal('abc');
    });
  });

  suite('maxlength counter', () => {
    test('renders a counter when maxlength is set', async () => {
      const el = await fixture<TextField>(html`<u-text-field maxlength="5"></u-text-field>`);
      await el.updateComplete;
      const counter = el.shadowRoot!.querySelector('[name="counter"]')!;
      expect(counter.textContent!.trim()).to.equal('0/5');
    });

    test('updates the counter as the user types', async () => {
      const el = await fixture<TextField>(html`<u-text-field maxlength="5"></u-text-field>`);
      const input = inputOf(el);
      input.value = 'abc';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;
      const counter = el.shadowRoot!.querySelector('[name="counter"]')!;
      expect(counter.textContent!.trim()).to.equal('3/5');
    });
  });

  suite('constraint validation', () => {
    test('required: empty is invalid, filled is valid', async () => {
      const el = await fixture<TextField>(html`<u-text-field required></u-text-field>`);
      await el.updateComplete;
      expect(el.checkValidity()).to.be.false;
      expect(el.validity.valueMissing).to.be.true;

      const input = inputOf(el);
      input.value = 'hi';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;
      expect(el.checkValidity()).to.be.true;
    });

    test('pattern: mismatch is invalid', async () => {
      const el = await fixture<TextField>(html`<u-text-field pattern="[0-9]+"></u-text-field>`);
      await el.updateComplete;
      const input = inputOf(el);
      input.value = 'abc';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;
      expect(el.checkValidity()).to.be.false;
      expect(el.validity.patternMismatch).to.be.true;

      input.value = '123';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;
      expect(el.checkValidity()).to.be.true;
    });

    test('mirrors required/pattern/minlength onto the inner input', async () => {
      const el = await fixture<TextField>(html`
        <u-text-field required pattern="[0-9]+" minlength="3"></u-text-field>
      `);
      await el.updateComplete;
      const input = inputOf(el);
      expect(input.required).to.be.true;
      expect(input.pattern).to.equal('[0-9]+');
      expect(input.minLength).to.equal(3);
    });

    test('reportValidity reflects onto the visual invalid state', async () => {
      const el = await fixture<TextField>(html`<u-text-field required></u-text-field>`);
      await el.updateComplete;
      expect(el.reportValidity()).to.be.false;
      expect(el.invalid).to.be.true;
    });

    test('blocks native form submission while invalid', async () => {
      const formEl = await fixture<HTMLFormElement>(html`
        <form><u-text-field name="x" required></u-text-field></form>
      `);
      const tf = formEl.querySelector('u-text-field') as TextField;
      await tf.updateComplete;
      let submitted = false;
      formEl.addEventListener('submit', (e) => { e.preventDefault(); submitted = true; });
      formEl.requestSubmit();
      expect(submitted).to.be.false;
    });
  });

  suite('variant', () => {
    test('applies the filled variant class by default (via TextFieldBase init)', async () => {
      const el = await fixture<TextField>(html`<u-text-field></u-text-field>`);
      const container = el.shadowRoot!.querySelector('.container')!;
      expect(container.classList.contains('filled')).to.be.true;
    });

    test('applies the outlined variant class when variant="outlined"', async () => {
      const el = await fixture<TextField>(html`<u-text-field variant="outlined"></u-text-field>`);
      const container = el.shadowRoot!.querySelector('.container')!;
      expect(container.classList.contains('outlined')).to.be.true;
    });
  });
});
