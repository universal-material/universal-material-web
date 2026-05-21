import { createContext } from '@lit/context';

import { FabColor } from './fab.js';

export const fabMenuColorContext = createContext<FabColor>(Symbol('fabMenuColorContext'));
