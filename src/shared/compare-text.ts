import { normalizeText } from './normalize-text.js';

export const normalizedStartsWith = (text: string | null, term: string | null): boolean =>
  normalizeText(text)
    .toLowerCase()
    .startsWith(normalizeText(term).toLowerCase());
