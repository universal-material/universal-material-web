import { hexFromArgb } from '@material/material-color-utilities';

import { RgbColor } from './rgb-color.js';

export class CssVarBuilder {

  private content = '';

  private constructor() {
  }

  static create(): CssVarBuilder {
    return new CssVarBuilder();
  }

  add(name: string, value: string): CssVarBuilder {

    const cssVar = `  ${name}: ${value};
`;

    this.content += cssVar

    return this;
  }

  addFromArgb(name: string, argb: number): CssVarBuilder {
    this.add(`--u-color-${name}`, hexFromArgb(argb));
    this.add(`--u-color-${name}-rgb`, RgbColor.fromArgb(argb).toString());

    return this;
  }

  build(): string {
    return this.content;
  }
}
