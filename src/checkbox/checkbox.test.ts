import { expect, fixture, html, oneEvent } from '@open-wc/testing';

import { Checkbox } from './checkbox.js';

const internalInput = (el: Checkbox) =>
  el.shadowRoot!.querySelector<HTMLInputElement>('input')!;

suite('u-checkbox', () => {
  teardown(() => {
    document.querySelectorAll('u-checkbox').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-checkbox', () => {
      expect(customElements.get('u-checkbox')).to.equal(Checkbox);
    });

    test('is form-associated', () => {
      expect((Checkbox as unknown as { formAssociated: boolean }).formAssociated).to.be.true;
    });
  });

  suite('rendering', () => {
    test('renders a checkbox <input> internally', async () => {
      const el = await fixture<Checkbox>(html`<u-checkbox></u-checkbox>`);
      const input = internalInput(el);
      expect(input.type).to.equal('checkbox');
    });

    test('renders the indicator', async () => {
      const el = await fixture<Checkbox>(html`<u-checkbox></u-checkbox>`);
      const indicator = el.shadowRoot!.querySelector('.border .indicator');
      expect(indicator).to.exist;
    });

    test('renders the ripple by default', async () => {
      const el = await fixture<Checkbox>(html`<u-checkbox></u-checkbox>`);
      const ripple = el.shadowRoot!.querySelector('u-ripple');
      expect(ripple).to.exist;
    });
  });

  suite('default property values', () => {
    test('defaults checked, indeterminate, disabled to false', async () => {
      const el = await fixture<Checkbox>(html`<u-checkbox></u-checkbox>`);
      expect(el.checked).to.be.false;
      expect(el.indeterminate).to.be.false;
      expect(el.disabled).to.be.false;
    });

    test('defaults value to "on"', async () => {
      const el = await fixture<Checkbox>(html`<u-checkbox></u-checkbox>`);
      expect(el.value).to.equal('on');
    });

    test('defaults hideStateLayer to false', async () => {
      const el = await fixture<Checkbox>(html`<u-checkbox></u-checkbox>`);
      expect(el.hideStateLayer).to.be.false;
      expect(el.hasAttribute('hide-state-layer')).to.be.false;
    });
  });

  suite('checked property', () => {
    test('reflects to the internal input', async () => {
      const el = await fixture<Checkbox>(html`<u-checkbox></u-checkbox>`);
      el.checked = true;
      expect(internalInput(el).checked).to.be.true;
    });

    test('initial property binding is honored', async () => {
      const el = await fixture<Checkbox>(html`<u-checkbox .checked=${true}></u-checkbox>`);
      expect(el.checked).to.be.true;
      expect(internalInput(el).checked).to.be.true;
    });

    test('honors the initial `checked` attribute (markup)', async () => {
      const el = await fixture<Checkbox>(html`<u-checkbox checked></u-checkbox>`);
      expect(el.checked).to.be.true;
      expect(internalInput(el).checked).to.be.true;
    });

    test('setting checked=true clears indeterminate', async () => {
      const el = await fixture<Checkbox>(html`<u-checkbox></u-checkbox>`);
      el.indeterminate = true;
      expect(el.indeterminate).to.be.true;
      el.checked = true;
      expect(el.indeterminate).to.be.false;
    });
  });

  suite('indeterminate property', () => {
    test('adds the "indeterminate" class to the input when true', async () => {
      const el = await fixture<Checkbox>(html`<u-checkbox></u-checkbox>`);
      el.indeterminate = true;
      expect(internalInput(el).classList.contains('indeterminate')).to.be.true;
    });

    test('removes the "indeterminate" class when set back to false', async () => {
      const el = await fixture<Checkbox>(html`<u-checkbox></u-checkbox>`);
      el.indeterminate = true;
      el.indeterminate = false;
      expect(internalInput(el).classList.contains('indeterminate')).to.be.false;
    });
  });

  suite('hideStateLayer', () => {
    test('reflects to the hide-state-layer attribute', async () => {
      const el = await fixture<Checkbox>(html`<u-checkbox></u-checkbox>`);
      el.hideStateLayer = true;
      await el.updateComplete;
      expect(el.hasAttribute('hide-state-layer')).to.be.true;
    });
  });

  suite('disabled property', () => {
    test('reflects to the disabled attribute', async () => {
      const el = await fixture<Checkbox>(html`<u-checkbox></u-checkbox>`);
      el.disabled = true;
      await el.updateComplete;
      expect(el.hasAttribute('disabled')).to.be.true;
    });

    test('disables the internal input', async () => {
      const el = await fixture<Checkbox>(html`<u-checkbox disabled></u-checkbox>`);
      expect(internalInput(el).disabled).to.be.true;
    });
  });

  suite('change event', () => {
    test('re-dispatches the change event from the internal input', async () => {
      const el = await fixture<Checkbox>(html`<u-checkbox></u-checkbox>`);
      const input = internalInput(el);

      setTimeout(() => {
        input.checked = true;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });

      const event = await oneEvent(el, 'change');
      expect(event).to.exist;
    });
  });

  suite('form association', () => {
    test('exposes the parent form via .form', async () => {
      const formEl = await fixture<HTMLFormElement>(html`
        <form><u-checkbox name="agree" checked></u-checkbox></form>
      `);
      const checkbox = formEl.querySelector('u-checkbox') as Checkbox;
      expect(checkbox.form).to.equal(formEl);
    });

    test('submits its value when checked', async () => {
      const formEl = await fixture<HTMLFormElement>(html`
        <form><u-checkbox name="agree" value="yes" .checked=${true}></u-checkbox></form>
      `);
      const data = new FormData(formEl);
      expect(data.get('agree')).to.equal('yes');
    });

    test('omits its value when unchecked', async () => {
      const formEl = await fixture<HTMLFormElement>(html`
        <form><u-checkbox name="agree" value="yes"></u-checkbox></form>
      `);
      const data = new FormData(formEl);
      expect(data.get('agree')).to.be.null;
    });
  });
});
