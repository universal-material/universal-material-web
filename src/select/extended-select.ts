import { ExtendedOption } from './extended-option.js';

export type ExtendedSelect = HTMLSelectElement & {
  options: ExtendedOption[];
  selectedOptions: ExtendedOption[];
};
