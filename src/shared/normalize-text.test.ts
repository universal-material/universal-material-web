import { expect } from '@open-wc/testing';

import { normalizeText } from './normalize-text.js';

suite('normalizeText', () => {
  suite('null / empty inputs', () => {
    test('returns "" when input is null', () => {
      expect(normalizeText(null)).to.equal('');
    });

    test('returns "" when input is an empty string', () => {
      expect(normalizeText('')).to.equal('');
    });
  });

  suite('ASCII strings', () => {
    test('passes ASCII through unchanged', () => {
      expect(normalizeText('hello world')).to.equal('hello world');
    });

    test('preserves case', () => {
      expect(normalizeText('Hello World')).to.equal('Hello World');
    });

    test('preserves digits and punctuation', () => {
      expect(normalizeText('123 abc!?,.')).to.equal('123 abc!?,.');
    });
  });

  suite('diacritic stripping', () => {
    test('strips acute accents (é → e)', () => {
      expect(normalizeText('café')).to.equal('cafe');
    });

    test('strips grave accents (à → a)', () => {
      expect(normalizeText('voilà')).to.equal('voila');
    });

    test('strips circumflex (â → a)', () => {
      expect(normalizeText('pâté')).to.equal('pate');
    });

    test('strips tilde (ã, ñ → a, n)', () => {
      expect(normalizeText('mañana')).to.equal('manana');
      expect(normalizeText('São Paulo')).to.equal('Sao Paulo');
    });

    test('strips diaeresis (ü, ö → u, o)', () => {
      expect(normalizeText('über')).to.equal('uber');
      expect(normalizeText('schön')).to.equal('schon');
    });

    test('strips cedilla (ç → c)', () => {
      expect(normalizeText('Curaçao')).to.equal('Curacao');
    });

    test('preserves the cased base letter after stripping', () => {
      expect(normalizeText('ÉLAN')).to.equal('ELAN');
    });
  });

  suite('mixed strings', () => {
    test('handles a sentence with multiple accented characters', () => {
      expect(normalizeText('résumé naïve crème brûlée'))
        .to.equal('resume naive creme brulee');
    });
  });
});
