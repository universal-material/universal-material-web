import { expect, fixture, html } from '@open-wc/testing';

import { Field } from './field.js';

suite('u-field', () => {
  teardown(() => {
    document.querySelectorAll('u-field').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-field', () => {
      expect(customElements.get('u-field')).to.equal(Field);
    });
  });

  suite('rendering', () => {
    test('renders prefix, default (input), and suffix slots', async () => {
      const el = await fixture<Field>(html`<u-field><input /></u-field>`);
      expect(el.shadowRoot!.querySelector('slot[name="prefix"]')).to.exist;
      expect(el.shadowRoot!.querySelector('slot[name="suffix"]')).to.exist;
      expect(el.shadowRoot!.querySelector('.input slot:not([name])')).to.exist;
    });

    test('slots the consumer-provided control into the input slot', async () => {
      const el = await fixture<Field>(html`<u-field><input id="real" /></u-field>`);
      const slot = el.shadowRoot!.querySelector('.input slot:not([name])')!;
      const assigned = (slot as HTMLSlotElement).assignedElements();
      expect(assigned.length).to.equal(1);
      expect((assigned[0] as HTMLElement).id).to.equal('real');
    });
  });

  suite('autoEmpty property', () => {
    test('defaults to false', async () => {
      const el = await fixture<Field>(html`<u-field><input /></u-field>`);
      expect(el.autoEmpty).to.be.false;
    });

    test('sets empty based on the slotted control value when autoEmpty=true', async () => {
      const el = await fixture<Field>(html`<u-field .autoEmpty=${true}><input value="hello" /></u-field>`);
      await el.updateComplete;
      expect(el.empty).to.be.false;
    });

    test('sets empty=true when slotted control is empty and autoEmpty=true', async () => {
      const el = await fixture<Field>(html`<u-field .autoEmpty=${true}><input value="" /></u-field>`);
      await el.updateComplete;
      expect(el.empty).to.be.true;
    });

    test('updates empty as the user types when autoEmpty=true', async () => {
      const el = await fixture<Field>(html`<u-field .autoEmpty=${true}><input /></u-field>`);
      const input = el.querySelector('input')!;
      input.value = 'x';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      expect(el.empty).to.be.false;

      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      expect(el.empty).to.be.true;
    });

    test('does not update empty when autoEmpty=false', async () => {
      const el = await fixture<Field>(html`<u-field><input /></u-field>`);
      // empty defaults to false on FieldBase; setting input value shouldn't move it
      const input = el.querySelector('input')!;
      input.value = 'x';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      expect(el.empty).to.be.false; // unchanged from initial
    });
  });

  suite('FieldBase inheritance', () => {
    test('renders label, supportingText, errorText via base template', async () => {
      const el = await fixture<Field>(html`
        <u-field label="Name" supporting-text="required" error-text="invalid"><input /></u-field>
      `);
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.label')!.textContent!.trim()).to.equal('Name');
      expect(el.shadowRoot!.querySelector('[name="supporting-text"]')!.textContent!.trim()).to.equal('required');
      expect(el.shadowRoot!.querySelector('[name="error-text"]')!.textContent!.trim()).to.equal('invalid');
    });

    test('variant attribute selects filled / outlined renderings', async () => {
      const filled = await fixture<Field>(html`<u-field variant="filled"><input /></u-field>`);
      const outlined = await fixture<Field>(html`<u-field variant="outlined"><input /></u-field>`);
      expect(filled.shadowRoot!.querySelector('.container.filled')).to.exist;
      expect(outlined.shadowRoot!.querySelector('.container.outlined')).to.exist;
    });
  });
});
