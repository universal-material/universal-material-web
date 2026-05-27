import { expect } from '@open-wc/testing';

import { normalizedStartsWith } from './compare-text.js';

suite('normalizedStartsWith', () => {
  suite('null inputs', () => {
    test('returns true when both are null (empty starts with empty)', () => {
      expect(normalizedStartsWith(null, null)).to.be.true;
    });

    test('returns true when text is non-empty and term is null', () => {
      // term normalizes to '' — every string starts with the empty string.
      expect(normalizedStartsWith('hello', null)).to.be.true;
    });

    test('returns false when text is null and term is non-empty', () => {
      expect(normalizedStartsWith(null, 'h')).to.be.false;
    });
  });

  suite('basic ASCII matching', () => {
    test('matches when text starts with the term (same case)', () => {
      expect(normalizedStartsWith('hello world', 'hel')).to.be.true;
    });

    test('does not match when term is elsewhere in the text', () => {
      expect(normalizedStartsWith('hello world', 'world')).to.be.false;
    });

    test('matches the full text', () => {
      expect(normalizedStartsWith('hello', 'hello')).to.be.true;
    });

    test('does not match when text is shorter than the term', () => {
      expect(normalizedStartsWith('hi', 'hello')).to.be.false;
    });
  });

  suite('case-insensitive matching', () => {
    test('matches regardless of text case', () => {
      expect(normalizedStartsWith('Hello', 'hel')).to.be.true;
    });

    test('matches regardless of term case', () => {
      expect(normalizedStartsWith('hello', 'HEL')).to.be.true;
    });

    test('matches with mixed casing on both sides', () => {
      expect(normalizedStartsWith('HeLLo', 'heLL')).to.be.true;
    });
  });

  suite('diacritic-insensitive matching', () => {
    test('matches an accented text against an unaccented term', () => {
      expect(normalizedStartsWith('São Paulo', 'sao')).to.be.true;
    });

    test('matches an unaccented text against an accented term', () => {
      expect(normalizedStartsWith('Sao Paulo', 'são')).to.be.true;
    });

    test('matches both with accents', () => {
      expect(normalizedStartsWith('café', 'café')).to.be.true;
    });

    test('combines case + accent insensitivity', () => {
      expect(normalizedStartsWith('Über alles', 'uber')).to.be.true;
    });
  });
});
