import { expect } from '@open-wc/testing';

import { DefaultCalendarAdapter } from './default-calendar-adapter.js';

suite('DefaultCalendarAdapter', () => {
  suite('defaults', () => {
    test('weekDayFormat defaults to "narrow"', () => {
      const adapter = new DefaultCalendarAdapter();
      expect(adapter.weekDayFormat).to.equal('narrow');
    });

    test('locale defaults to "pt-br"', () => {
      const adapter = new DefaultCalendarAdapter();
      expect(adapter.locale).to.equal('pt-br');
    });
  });

  suite('getFirstDayOfWeek', () => {
    test('returns 0 (Sunday) for en-US', () => {
      const adapter = new DefaultCalendarAdapter();
      expect(adapter.getFirstDayOfWeek('en-US')).to.equal(0);
    });

    test('returns 1 (Monday) for de-DE', () => {
      const adapter = new DefaultCalendarAdapter();
      expect(adapter.getFirstDayOfWeek('de-DE')).to.equal(1);
    });

    test('returns 1 (Monday) for fr-FR', () => {
      const adapter = new DefaultCalendarAdapter();
      expect(adapter.getFirstDayOfWeek('fr-FR')).to.equal(1);
    });
  });

  suite('getWeekDays', () => {
    test('returns exactly 7 entries', () => {
      const adapter = new DefaultCalendarAdapter();
      expect(adapter.getWeekDays('en-US')).to.have.lengthOf(7);
    });

    test('returns all non-empty strings', () => {
      const adapter = new DefaultCalendarAdapter();
      const days = adapter.getWeekDays('en-US');
      for (const day of days) {
        expect(day).to.be.a('string');
        expect(day.length).to.be.greaterThan(0);
      }
    });

    test('respects the weekDayFormat for output length (narrow = 1-2 chars)', () => {
      const adapter = new DefaultCalendarAdapter();
      adapter.weekDayFormat = 'narrow';
      const days = adapter.getWeekDays('en-US');
      // narrow is typically a single grapheme (S, M, T, ...).
      for (const day of days) {
        expect(day.length).to.be.lessThan(4);
      }
    });

    test('"long" format yields longer strings than "narrow"', () => {
      const narrowAdapter = new DefaultCalendarAdapter();
      narrowAdapter.weekDayFormat = 'narrow';
      const longAdapter = new DefaultCalendarAdapter();
      longAdapter.weekDayFormat = 'long';

      const narrow = narrowAdapter.getWeekDays('en-US');
      const long = longAdapter.getWeekDays('en-US');

      // At least one long-format day must be longer than its narrow counterpart.
      const someLonger = narrow.some((n, i) => long[i].length > n.length);
      expect(someLonger).to.be.true;
    });
  });

  suite('getDay', () => {
    test('returns the day-of-month as a locale-formatted string', () => {
      const adapter = new DefaultCalendarAdapter();
      adapter.locale = 'en-US';
      const date = new Date(2025, 0, 15); // Jan 15, 2025
      expect(adapter.getDay(date)).to.equal('15');
    });
  });

  suite('getMonth', () => {
    test('returns "month year" formatted with the configured locale', () => {
      const adapter = new DefaultCalendarAdapter();
      adapter.locale = 'en-US';
      const date = new Date(2025, 0, 1);
      const result = adapter.getMonth(date);
      // Some locales emit non-breaking spaces; just check the substrings.
      expect(result.toLowerCase()).to.include('january');
      expect(result).to.include('2025');
    });
  });

  suite('getYear', () => {
    test('returns just the year as a string', () => {
      const adapter = new DefaultCalendarAdapter();
      adapter.locale = 'en-US';
      const date = new Date(2025, 0, 1);
      expect(adapter.getYear(date)).to.equal('2025');
    });
  });

  suite('getMonthShort', () => {
    test('returns the short month name for the given numeric month', () => {
      const adapter = new DefaultCalendarAdapter();
      expect(adapter.getMonthShort(0, 'en-US').toLowerCase()).to.include('jan');
      expect(adapter.getMonthShort(11, 'en-US').toLowerCase()).to.include('dec');
    });

    test('uses the locale parameter, not adapter.locale', () => {
      const adapter = new DefaultCalendarAdapter();
      adapter.locale = 'en-US';
      // German short months: "Jan."–"Dez."
      const result = adapter.getMonthShort(11, 'de-DE');
      expect(result.toLowerCase()).to.include('dez');
    });
  });
});
