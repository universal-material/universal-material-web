import { blueFromArgb, greenFromArgb, redFromArgb } from '@material/material-color-utilities';

export class RgbColor {
  r: number;
  g: number;
  b: number;

  constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  static fromArgb(argb: number): RgbColor {
    return new RgbColor(redFromArgb(argb), greenFromArgb(argb), blueFromArgb(argb));
  }

  toString = (): string => `${this.r},${this.g},${this.b}`;
}
