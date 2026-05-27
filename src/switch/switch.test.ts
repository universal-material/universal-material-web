import { expect, fixture, html, oneEvent } from '@open-wc/testing';

import { Switch } from './switch.js';

const internalInput = (el: Switch) =>
  el.shadowRoot!.querySelector<HTMLInputElement>('input')!;

suite('u-switch', () => {
  teardown(() => {
    document.querySelectorAll('u-switch').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-switch', () => {
      expect(customElements.get('u-switch')).to.equal(Switch);
    });

    test('is form-associated', () => {
      expect((Switch as unknown as { formAssociated: boolean }).formAssociated).to.be.true;
    });
  });

  suite('rendering', () => {
    test('renders a checkbox <input> internally (switch uses checkbox semantics)', async () => {
      const el = await fixture<Switch>(html`<u-switch></u-switch>`);
      expect(internalInput(el).type).to.equal('checkbox');
    });

    test('renders the indicator with handle', async () => {
      const el = await fixture<Switch>(html`<u-switch></u-switch>`);
      const handle = el.shadowRoot!.querySelector('.indicator .state-layer .handle');
      expect(handle).to.exist;
    });

    test('does not render an internal ripple', async () => {
      const el = await fixture<Switch>(html`<u-switch></u-switch>`);
      expect(el.shadowRoot!.querySelector('u-ripple')).to.be.null;
    });
  });

  suite('default property values', () => {
    test('defaults checked, disabled to false', async () => {
      const el = await fixture<Switch>(html`<u-switch></u-switch>`);
      expect(el.checked).to.be.false;
      expect(el.disabled).to.be.false;
    });

    test('defaults value to "on"', async () => {
      const el = await fixture<Switch>(html`<u-switch></u-switch>`);
      expect(el.value).to.equal('on');
    });
  });

  suite('checked property', () => {
    test('reflects to the internal input', async () => {
      const el = await fixture<Switch>(html`<u-switch></u-switch>`);
      el.checked = true;
      expect(internalInput(el).checked).to.be.true;
    });

    test('initial property binding is honored', async () => {
      const el = await fixture<Switch>(html`<u-switch .checked=${true}></u-switch>`);
      expect(el.checked).to.be.true;
    });
  });

  suite('disabled property', () => {
    test('reflects to the disabled attribute and the input', async () => {
      const el = await fixture<Switch>(html`<u-switch></u-switch>`);
      el.disabled = true;
      await el.updateComplete;
      expect(el.hasAttribute('disabled')).to.be.true;
      expect(internalInput(el).disabled).to.be.true;
    });
  });

  suite('change event', () => {
    test('re-dispatches the change event from the internal input', async () => {
      const el = await fixture<Switch>(html`<u-switch></u-switch>`);
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
    test('submits its value when checked', async () => {
      const formEl = await fixture<HTMLFormElement>(html`
        <form><u-switch name="notify" value="yes" .checked=${true}></u-switch></form>
      `);
      const data = new FormData(formEl);
      expect(data.get('notify')).to.equal('yes');
    });

    test('omits its value when unchecked', async () => {
      const formEl = await fixture<HTMLFormElement>(html`
        <form><u-switch name="notify" value="yes"></u-switch></form>
      `);
      const data = new FormData(formEl);
      expect(data.get('notify')).to.be.null;
    });
  });
});
