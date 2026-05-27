import { expect, fixture, html } from '@open-wc/testing';

import '../button/button-set.js';
import '../button/button.js';
import '../button/icon-button.js';
import '../calendar/range-calendar.js';
import '../menu/menu-item.js';
import '../menu/menu.js';
import '../ripple/ripple.js';
import { RangeDatepicker } from './range-datepicker.js';

const inputOf = (el: RangeDatepicker) =>
  el.shadowRoot!.querySelector<HTMLInputElement>('input')!;

suite('u-range-datepicker', () => {
  teardown(() => {
    document.querySelectorAll('u-range-datepicker').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-range-datepicker', () => {
      expect(customElements.get('u-range-datepicker')).to.equal(RangeDatepicker);
    });

    test('is form-associated', () => {
      expect((RangeDatepicker as unknown as { formAssociated: boolean }).formAssociated).to.be.true;
    });
  });

  suite('default property values', () => {
    test('locale defaults to null', async () => {
      const el = await fixture<RangeDatepicker>(html`<u-range-datepicker></u-range-datepicker>`);
      expect(el.locale).to.equal(null);
    });

    test('format defaults to "short"', async () => {
      const el = await fixture<RangeDatepicker>(html`<u-range-datepicker></u-range-datepicker>`);
      expect(el.format).to.equal('short');
    });

    test('editable defaults to false', async () => {
      const el = await fixture<RangeDatepicker>(html`<u-range-datepicker></u-range-datepicker>`);
      expect(el.editable).to.be.false;
    });

    test('readOnly defaults to false', async () => {
      const el = await fixture<RangeDatepicker>(html`<u-range-datepicker></u-range-datepicker>`);
      expect(el.readOnly).to.be.false;
    });

    test('menuPositioning defaults to "relative"', async () => {
      const el = await fixture<RangeDatepicker>(html`<u-range-datepicker></u-range-datepicker>`);
      expect(el.menuPositioning).to.equal('relative');
    });
  });

  suite('readonly behavior', () => {
    test('inner input is read-only when not editable', async () => {
      const el = await fixture<RangeDatepicker>(html`<u-range-datepicker></u-range-datepicker>`);
      expect(inputOf(el).readOnly).to.be.true;
    });

    test('inner input is editable when editable=true and readOnly=false', async () => {
      const el = await fixture<RangeDatepicker>(html`<u-range-datepicker editable></u-range-datepicker>`);
      expect(inputOf(el).readOnly).to.be.false;
    });

    test('inner input is read-only when readOnly=true even with editable=true', async () => {
      const el = await fixture<RangeDatepicker>(html`<u-range-datepicker editable readonly></u-range-datepicker>`);
      expect(inputOf(el).readOnly).to.be.true;
    });
  });

  suite('reflection', () => {
    test('editable reflects to the editable attribute', async () => {
      const el = await fixture<RangeDatepicker>(html`<u-range-datepicker></u-range-datepicker>`);
      el.editable = true;
      await el.updateComplete;
      expect(el.hasAttribute('editable')).to.be.true;
    });

    test('readOnly reflects to the readonly attribute', async () => {
      const el = await fixture<RangeDatepicker>(html`<u-range-datepicker></u-range-datepicker>`);
      el.readOnly = true;
      await el.updateComplete;
      expect(el.hasAttribute('readonly')).to.be.true;
    });
  });

  suite('value display formatting', () => {
    test('renders the raw ISO range in editable mode', async () => {
      const el = await fixture<RangeDatepicker>(html`
        <u-range-datepicker editable .value=${'2025-06-15 - 2025-07-01'}></u-range-datepicker>
      `);
      await el.updateComplete;
      expect(inputOf(el).value).to.equal('2025-06-15 - 2025-07-01');
    });

    test('format="iso" keeps the value as-is in non-editable mode', async () => {
      const el = await fixture<RangeDatepicker>(html`
        <u-range-datepicker format="iso" .value=${'2025-06-15 - 2025-07-01'}></u-range-datepicker>
      `);
      await el.updateComplete;
      expect(inputOf(el).value).to.equal('2025-06-15 - 2025-07-01');
    });

    test('format="short" with en-US formats both ends', async () => {
      const el = await fixture<RangeDatepicker>(html`
        <u-range-datepicker locale="en-US" format="short" .value=${'2025-06-15 - 2025-07-01'}></u-range-datepicker>
      `);
      await el.updateComplete;
      expect(inputOf(el).value).to.equal('6/15/25 - 7/1/25');
    });
  });

  suite('form association', () => {
    test('submits the current range with the form', async () => {
      const formEl = await fixture<HTMLFormElement>(html`
        <form><u-range-datepicker editable name="r" .value=${'2025-06-15 - 2025-07-01'}></u-range-datepicker></form>
      `);
      const data = new FormData(formEl);
      expect(data.get('r')).to.equal('2025-06-15 - 2025-07-01');
    });
  });
});
