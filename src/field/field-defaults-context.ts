import { createContext } from '@lit/context';

import { UmFieldDefaults } from './field-defaults.js';

export const fieldDefaultsContext = createContext<UmFieldDefaults>('u-field-defaults-context');
