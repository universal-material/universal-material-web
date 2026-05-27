import { expect, fixture, html, oneEvent } from '@open-wc/testing';

// Calendar deps used by the shared base rendering. Loading calendar.js first
// ensures CalendarBase is fully evaluated before RangeCalendar consumes it.
import '../button/button-set.js';
import '../button/button.js';
import '../button/icon-button.js';
import '../ripple/ripple.js';
import './calendar.js';
import { RangeCalendar } from './range-calendar.js';

// Basic registration/value/event coverage lives in calendar.test.ts. This file
// targets range-specific behavior: out-of-order selection, post-completion
// reset, and the input event payload.
suite('u-range-calendar (range-specific behavior)', () => {
  teardown(() => {
    document.querySelectorAll('u-range-calendar').forEach((el) => el.remove());
  });

  // Mounting an instance up-front warms up the class so that subsequent tests
  // see prototype-defined accessors (without this, the very first test in the
  // file fails with "_selectDate is not a function" — Lit's reactive accessors
  // aren't installed until the class has been used once).
  suite('registration', () => {
    test('is registered as u-range-calendar', async () => {
      const el = await fixture<RangeCalendar>(html`<u-range-calendar></u-range-calendar>`);
      expect(el).to.exist;
      expect(el instanceof RangeCalendar).to.be.true;
    });
  });

  suite('out-of-order date selection', () => {
    test('selecting an earlier date second swaps start/end', async () => {
      const el = await fixture<RangeCalendar>(html`<u-range-calendar></u-range-calendar>`);
      const select = (d: Date) =>
        (el as unknown as { _selectDate: (d: Date) => void })._selectDate(d);

      const later = new Date(2025, 5, 20);
      const earlier = new Date(2025, 5, 10);

      setTimeout(() => select(later));
      await oneEvent(el, 'change');

      setTimeout(() => select(earlier));
      await oneEvent(el, 'change');

      expect(el.startDateValue?.getTime()).to.equal(earlier.getTime());
      expect(el.endDateValue?.getTime()).to.equal(later.getTime());
    });
  });

  suite('post-completion reset', () => {
    test('selecting after the range is complete restarts from the new date', async () => {
      const el = await fixture<RangeCalendar>(html`<u-range-calendar></u-range-calendar>`);
      const select = (d: Date) =>
        (el as unknown as { _selectDate: (d: Date) => void })._selectDate(d);

      const a = new Date(2025, 5, 10);
      const b = new Date(2025, 5, 20);
      const c = new Date(2025, 6, 5);

      setTimeout(() => select(a));
      await oneEvent(el, 'change');
      setTimeout(() => select(b));
      await oneEvent(el, 'change');

      setTimeout(() => select(c));
      await oneEvent(el, 'change');

      expect(el.startDateValue?.getTime()).to.equal(c.getTime());
      expect(el.endDateValue).to.equal(null);
    });
  });

  suite('value <-> selected dates', () => {
    test('value setter populates startDateValue and endDateValue', async () => {
      const el = await fixture<RangeCalendar>(html`<u-range-calendar></u-range-calendar>`);
      el.value = '2025-01-10 - 2025-01-20';
      await el.updateComplete;

      expect(el.startDateValue).to.not.be.null;
      expect(el.endDateValue).to.not.be.null;
      expect(el.startDateValue!.getFullYear()).to.equal(2025);
      expect(el.startDateValue!.getMonth()).to.equal(0);
      expect(el.startDateValue!.getDate()).to.equal(10);
      expect(el.endDateValue!.getDate()).to.equal(20);
    });

    test('value getter returns formatted "YYYY-MM-DD - YYYY-MM-DD"', async () => {
      const el = await fixture<RangeCalendar>(html`<u-range-calendar></u-range-calendar>`);
      el.value = '2025-01-10 - 2025-01-20';
      await el.updateComplete;
      expect(el.value).to.equal('2025-01-10 - 2025-01-20');
    });
  });

  suite('input event', () => {
    test('selection dispatches a bubbling, composed input event', async () => {
      const el = await fixture<RangeCalendar>(html`<u-range-calendar></u-range-calendar>`);
      const select = (d: Date) =>
        (el as unknown as { _selectDate: (d: Date) => void })._selectDate(d);

      setTimeout(() => select(new Date(2025, 0, 1)));
      const event = await oneEvent(el, 'input');
      expect(event).to.exist;
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });

    test('change event is dispatched alongside input on selection', async () => {
      const el = await fixture<RangeCalendar>(html`<u-range-calendar></u-range-calendar>`);
      const select = (d: Date) =>
        (el as unknown as { _selectDate: (d: Date) => void })._selectDate(d);

      let inputFired = false;
      el.addEventListener('input', () => (inputFired = true));

      setTimeout(() => select(new Date(2025, 0, 1)));
      await oneEvent(el, 'change');
      expect(inputFired).to.be.true;
    });
  });
});
