import { normalizeText } from './normalize-text.js';

export function normalizedStartsWith(text: string | null, term: string | null): boolean {
  return normalizeText(text).toLowerCase().startsWith(normalizeText(term).toLowerCase());
}
