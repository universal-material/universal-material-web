import { createContext } from '@lit/context';

import { FieldDefaults } from './field-defaults.js';

export const fieldDefaultsContext = createContext<FieldDefaults>('u-field-defaults-context');
