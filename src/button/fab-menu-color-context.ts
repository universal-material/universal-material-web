import { createContext } from '@lit/context';

import { UmFabColor } from './fab.js';

export const fabMenuColorContext = createContext<UmFabColor>(Symbol('fabMenuColorContext'));
