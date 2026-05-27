import { expect, fixture, html } from '@open-wc/testing';

import '../button/button-set.js';
import '../button/button.js';
import '../button/icon-button.js';
import '../calendar/calendar.js';
import '../menu/menu-item.js';
import '../menu/menu.js';
import '../ripple/ripple.js';
import { Datepicker } from './datepicker.js';

const inputOf = (el: Datepicker) =>
  el.shadowRoot!.querySelector<HTMLInputElement>('input')!;

suite('u-datepicker', () => {
  teardown(() => {
    document.querySelectorAll('u-datepicker').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-datepicker', () => {
      expect(customElements.get('u-datepicker')).to.equal(Datepicker);
    });

    test('is form-associated', () => {
      expect((Datepicker as unknown as { formAssociated: boolean }).formAssociated).to.be.true;
    });
  });

  suite('default property values', () => {
    test('locale defaults to null', async () => {
      const el = await fixture<Datepicker>(html`<u-datepicker></u-datepicker>`);
      expect(el.locale).to.equal(null);
    });

    test('format defaults to "short"', async () => {
      const el = await fixture<Datepicker>(html`<u-datepicker></u-datepicker>`);
      expect(el.format).to.equal('short');
    });

    test('editable defaults to false', async () => {
      const el = await fixture<Datepicker>(html`<u-datepicker></u-datepicker>`);
      expect(el.editable).to.be.false;
    });

    test('readOnly defaults to false', async () => {
      const el = await fixture<Datepicker>(html`<u-datepicker></u-datepicker>`);
      expect(el.readOnly).to.be.false;
    });

    test('menuPositioning defaults to "relative"', async () => {
      const el = await fixture<Datepicker>(html`<u-datepicker></u-datepicker>`);
      expect(el.menuPositioning).to.equal('relative');
    });
  });

  suite('input type swap', () => {
    test('inner input uses type="text" when not editable', async () => {
      const el = await fixture<Datepicker>(html`<u-datepicker></u-datepicker>`);
      expect(inputOf(el).type).to.equal('text');
    });

    test('inner input uses type="date" when editable', async () => {
      const el = await fixture<Datepicker>(html`<u-datepicker editable></u-datepicker>`);
      expect(inputOf(el).type).to.equal('date');
    });
  });

  suite('readonly behavior', () => {
    test('inner input is read-only when not editable', async () => {
      const el = await fixture<Datepicker>(html`<u-datepicker></u-datepicker>`);
      expect(inputOf(el).readOnly).to.be.true;
    });

    test('inner input is editable when editable=true and readOnly=false', async () => {
      const el = await fixture<Datepicker>(html`<u-datepicker editable></u-datepicker>`);
      expect(inputOf(el).readOnly).to.be.false;
    });

    test('inner input is read-only when readOnly=true even with editable=true', async () => {
      const el = await fixture<Datepicker>(html`<u-datepicker editable readonly></u-datepicker>`);
      expect(inputOf(el).readOnly).to.be.true;
    });
  });

  suite('reflection', () => {
    test('editable reflects to the editable attribute', async () => {
      const el = await fixture<Datepicker>(html`<u-datepicker></u-datepicker>`);
      el.editable = true;
      await el.updateComplete;
      expect(el.hasAttribute('editable')).to.be.true;
    });

    test('readOnly reflects to the read-only attribute', async () => {
      const el = await fixture<Datepicker>(html`<u-datepicker></u-datepicker>`);
      el.readOnly = true;
      await el.updateComplete;
      expect(el.hasAttribute('readonly')).to.be.true;
    });

    test('menuPositioning reflects to menu-positioning attribute', async () => {
      const el = await fixture<Datepicker>(html`<u-datepicker menu-positioning="fixed"></u-datepicker>`);
      expect(el.menuPositioning).to.equal('fixed');
    });
  });

  suite('value display formatting', () => {
    test('renders the ISO value in the inner input when editable=true', async () => {
      const el = await fixture<Datepicker>(html`<u-datepicker editable .value=${'2025-03-15'}></u-datepicker>`);
      await el.updateComplete;
      expect(inputOf(el).value).to.equal('2025-03-15');
    });

    test('format="iso" keeps the value as-is in the non-editable display', async () => {
      const el = await fixture<Datepicker>(html`<u-datepicker format="iso" .value=${'2025-03-15'}></u-datepicker>`);
      await el.updateComplete;
      expect(inputOf(el).value).to.equal('2025-03-15');
    });
  });

  suite('form association', () => {
    test('submits the current value with the form', async () => {
      const formEl = await fixture<HTMLFormElement>(html`
        <form><u-datepicker editable name="dt" .value=${'2025-03-15'}></u-datepicker></form>
      `);
      const data = new FormData(formEl);
      expect(data.get('dt')).to.equal('2025-03-15');
    });
  });
});
