import { expect, fixture, html, oneEvent } from '@open-wc/testing';

import '../button/button-set.js';
import '../button/button.js';
import '../button/icon-button.js';
import '../ripple/ripple.js';
import { Calendar } from './calendar.js';
import { RangeCalendar } from './range-calendar.js';

suite('u-calendar', () => {
  teardown(() => {
    document.querySelectorAll('u-calendar').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-calendar', () => {
      expect(customElements.get('u-calendar')).to.equal(Calendar);
    });
  });

  suite('value property', () => {
    test('starts empty when no value is set', async () => {
      const el = await fixture<Calendar>(html`<u-calendar></u-calendar>`);
      expect(el.value).to.equal('');
    });

    test('round-trips an ISO date', async () => {
      const el = await fixture<Calendar>(html`<u-calendar></u-calendar>`);
      el.value = '2025-03-15';
      await el.updateComplete;
      expect(el.value).to.equal('2025-03-15');
    });

    test('clears when set to an empty string', async () => {
      const el = await fixture<Calendar>(html`<u-calendar></u-calendar>`);
      el.value = '2025-03-15';
      el.value = '';
      expect(el.value).to.equal('');
    });
  });

  suite('month/year navigation', () => {
    test('initial month/year reflect the current date', async () => {
      const el = await fixture<Calendar>(html`<u-calendar></u-calendar>`);
      const now = new Date();
      expect(el.month).to.equal(now.getMonth());
      expect(el.year).to.equal(now.getFullYear());
    });

    test('month setter updates the displayed month', async () => {
      const el = await fixture<Calendar>(html`<u-calendar></u-calendar>`);
      el.month = 0; // January
      expect(el.month).to.equal(0);
    });

    test('year setter updates the displayed year', async () => {
      const el = await fixture<Calendar>(html`<u-calendar></u-calendar>`);
      el.year = 2020;
      expect(el.year).to.equal(2020);
    });
  });

  suite('input/change events', () => {
    test('selecting a date fires input then change', async () => {
      const el = await fixture<Calendar>(html`<u-calendar></u-calendar>`);
      let inputFired = false;
      let changeFired = false;
      el.addEventListener('input', () => (inputFired = true));
      el.addEventListener('change', () => (changeFired = true));

      // Use the protected method indirectly: clicking a day cell.
      // Simulating with the abstract _selectDate via type cast.
      (el as unknown as { _selectDate: (d: Date) => void })._selectDate(new Date(2025, 5, 10));

      expect(inputFired).to.be.true;
      expect(changeFired).to.be.true;
    });
  });
});

suite('u-range-calendar', () => {
  teardown(() => {
    document.querySelectorAll('u-range-calendar').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-range-calendar', () => {
      expect(customElements.get('u-range-calendar')).to.equal(RangeCalendar);
    });
  });

  suite('value getter/setter', () => {
    test('defaults to empty string', async () => {
      const el = await fixture<RangeCalendar>(html`<u-range-calendar></u-range-calendar>`);
      expect(el.value).to.equal('');
    });

    test('parses "YYYY-MM-DD - YYYY-MM-DD"', async () => {
      const el = await fixture<RangeCalendar>(html`<u-range-calendar></u-range-calendar>`);
      el.value = '2025-01-10 - 2025-02-20';
      await el.updateComplete;
      expect(el.startDateValue).to.not.be.null;
      expect(el.endDateValue).to.not.be.null;
      expect(el.value).to.equal('2025-01-10 - 2025-02-20');
    });

    test('clears both dates when set to an empty string', async () => {
      const el = await fixture<RangeCalendar>(html`<u-range-calendar></u-range-calendar>`);
      el.value = '2025-01-10 - 2025-02-20';
      el.value = '';
      expect(el.startDateValue).to.equal(null);
      expect(el.endDateValue).to.equal(null);
    });

    test('rejects malformed value (clears both dates)', async () => {
      const el = await fixture<RangeCalendar>(html`<u-range-calendar></u-range-calendar>`);
      el.value = '2025-01-10';
      expect(el.startDateValue).to.equal(null);
      expect(el.endDateValue).to.equal(null);
    });
  });

  suite('event sequence on first/second selection', () => {
    test('first selection sets only start; second selection sets end and dispatches events', async () => {
      const el = await fixture<RangeCalendar>(html`<u-range-calendar></u-range-calendar>`);

      const select = (d: Date) =>
        (el as unknown as { _selectDate: (d: Date) => void })._selectDate(d);

      // First click — start only
      const startDate = new Date(2025, 5, 10);
      setTimeout(() => select(startDate));
      const firstEvent = await oneEvent(el, 'change');
      expect(firstEvent).to.exist;
      expect(el.startDateValue?.getTime()).to.equal(startDate.getTime());
      expect(el.endDateValue).to.equal(null);

      // Second click — end is set
      const endDate = new Date(2025, 5, 20);
      setTimeout(() => select(endDate));
      const secondEvent = await oneEvent(el, 'change');
      expect(secondEvent).to.exist;
      expect(el.endDateValue?.getTime()).to.equal(endDate.getTime());
    });
  });
});
