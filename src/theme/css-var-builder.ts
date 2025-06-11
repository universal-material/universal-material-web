import { hexFromArgb } from '@material/material-color-utilities';

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

    this.content += cssVar;

    return this;
  }

  addFromArgb(name: string, argb: number): CssVarBuilder {
    this.add(`--u-color-${name}`, hexFromArgb(argb));

    return this;
  }

  addLightAndDarkFromArgb(name: string, lightArgb: number, darkArgb: number): CssVarBuilder {
    this.add(`--u-color-${name}`, `light-dark(${hexFromArgb(lightArgb)}, ${hexFromArgb(darkArgb)})`);

    return this;
  }

  build(): string {
    return this.content;
  }
}
