import { expect } from '@open-wc/testing';

import { formatIsoDate, formatIsoDateRange, parseIsoDate } from './format.js';

suite('datepicker/format', () => {
  suite('parseIsoDate()', () => {
    test('parses a valid ISO date string at local midnight', () => {
      const date = parseIsoDate('2025-06-15');
      expect(date).to.not.equal(null);
      expect(date!.getFullYear()).to.equal(2025);
      expect(date!.getMonth()).to.equal(5); // 0-indexed June
      expect(date!.getDate()).to.equal(15);
      expect(date!.getHours()).to.equal(0);
      expect(date!.getMinutes()).to.equal(0);
    });

    test('returns null for malformed input', () => {
      expect(parseIsoDate('not-a-date')).to.equal(null);
      expect(parseIsoDate('2025-6-15')).to.equal(null);
      expect(parseIsoDate('')).to.equal(null);
      expect(parseIsoDate('2025/06/15')).to.equal(null);
    });
  });

  suite('formatIsoDate()', () => {
    test('passes the value through unchanged when format="iso"', () => {
      expect(formatIsoDate('2025-06-15', 'iso', null)).to.equal('2025-06-15');
    });

    test('passes the value through unchanged when value is empty', () => {
      expect(formatIsoDate('', 'short', null)).to.equal('');
    });

    test('passes the value through unchanged when it is not a valid ISO date', () => {
      expect(formatIsoDate('foo', 'short', null)).to.equal('foo');
    });

    test('formats valid ISO dates with the short style and en-US locale', () => {
      const formatted = formatIsoDate('2025-06-15', 'short', 'en-US');
      // en-US short → "6/15/25"
      expect(formatted).to.equal('6/15/25');
    });

    test('formats valid ISO dates with the long style and en-US locale', () => {
      const formatted = formatIsoDate('2025-06-15', 'long', 'en-US');
      expect(formatted).to.equal('June 15, 2025');
    });

    test('accepts an Intl.DateTimeFormatOptions object', () => {
      const formatted = formatIsoDate('2025-06-15', { year: 'numeric', month: '2-digit', day: '2-digit' }, 'en-US');
      expect(formatted).to.equal('06/15/2025');
    });

    test('passes null locale to use the browser default', () => {
      const formatted = formatIsoDate('2025-06-15', 'short', null);
      expect(formatted).to.be.a('string');
      expect(formatted.length).to.be.greaterThan(0);
    });
  });

  suite('formatIsoDateRange()', () => {
    test('passes the value through unchanged when format="iso"', () => {
      expect(formatIsoDateRange('2025-06-15 - 2025-06-20', 'iso', null)).to.equal('2025-06-15 - 2025-06-20');
    });

    test('passes the value through unchanged when empty', () => {
      expect(formatIsoDateRange('', 'short', null)).to.equal('');
    });

    test('passes the value through unchanged when the separator is missing', () => {
      expect(formatIsoDateRange('2025-06-15', 'short', null)).to.equal('2025-06-15');
    });

    test('formats both ends of a valid range using the chosen format', () => {
      const formatted = formatIsoDateRange('2025-06-15 - 2025-07-01', 'short', 'en-US');
      expect(formatted).to.equal('6/15/25 - 7/1/25');
    });

    test('preserves individual invalid pieces of a malformed pair', () => {
      const formatted = formatIsoDateRange('2025-06-15 - foo', 'short', 'en-US');
      expect(formatted).to.equal('6/15/25 - foo');
    });
  });
});
