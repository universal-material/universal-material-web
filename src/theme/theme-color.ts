import { TonalPalette } from '@material/material-color-utilities';

import { Color } from './color.js';

export interface ThemeColor extends Color {
  tonalPalette: TonalPalette;
}
