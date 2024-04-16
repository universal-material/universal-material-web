import { TonalPalette } from '@material/material-color-utilities';

import { Color } from './color';

export interface ThemeColor extends Color {
  tonalPalette: TonalPalette;
}
