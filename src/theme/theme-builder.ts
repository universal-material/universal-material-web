import { argbFromHex, CorePalette, TonalPalette } from '@material/material-color-utilities';

import { Color } from './color.js';
import { CssVarBuilder } from './css-var-builder.js';
import { neutralColors, neutralVariantColors } from './neutral-colors.js';
import { ThemeColor } from './theme-color.js';

function getCss(selector: string, content: string): string {
  return `${selector} {
${content}}`;
}

export class ThemeBuilder {
  cssClass: string | null;
  colors: ThemeColor[] = [];
  commonColors: ThemeColor[] = [];
  neutralColorPalette!: TonalPalette;
  neutralVariantColorPalette!: TonalPalette;

  private partial = false;

  private constructor() {
    this.cssClass = null;
  }

  static create(primaryColorHex: string): ThemeBuilder {
    return new ThemeBuilder()
      .addColorFromHex('primary', primaryColorHex);
  }

  static createPartial(): ThemeBuilder {
    const themeBuilder = new ThemeBuilder();
    themeBuilder.partial = true;

    return themeBuilder;
  }

  addColorFromHex(name: string, hex: string): ThemeBuilder {
    const palette = TonalPalette.fromInt(argbFromHex(hex));

    this.addColorFromPalette(name, palette);
    return this;
  }

  addColorFromPalette(name: string, palette: TonalPalette): ThemeBuilder {
    this.colors.push({name, lightTone: 40, darkTone: 80, tonalPalette: palette});
    this.colors.push({name: `on-${name}`, lightTone: 100, darkTone: 20, tonalPalette: palette});
    this.colors.push({name: `${name}-container`, lightTone: 90, darkTone: 30, tonalPalette: palette});
    this.colors.push({name: `on-${name}-container`, lightTone: 10, darkTone: 90, tonalPalette: palette});

    this.colors.push({name: `${name}-fixed`, fixedTone: 90, tonalPalette: palette});
    this.colors.push({name: `${name}-fixed-dim`, fixedTone: 800, tonalPalette: palette});
    this.colors.push({name: `on-${name}-fixed`, fixedTone: 10, tonalPalette: palette});
    this.colors.push({name: `on-${name}-fixed-variant`, fixedTone: 30, tonalPalette: palette});
    return this;
  }

  addCommonColor(name: string, hex: string): ThemeBuilder {
    this.commonColors.push({name, tonalPalette: TonalPalette.fromInt(argbFromHex(hex))})
    return this;
  }

  setCssClass(cssClass: string): ThemeBuilder {
    this.cssClass = cssClass;
    return this;
  }

  private ensureCssClassStartsWithDot(): void {
    if (!this.cssClass || this.cssClass.startsWith('.')) {
      return;
    }

    this.cssClass = `.${this.cssClass}`;
  }

  private ensureThemeColors(): void {

    const primaryColor = this.colors.find(c => c.name === 'primary')!;

    const palette = CorePalette.of(primaryColor.tonalPalette.tone(40));

    if (!this.colors.find(c => c.name === 'secondary')) {
      this.addColorFromPalette('secondary', palette.a2);
    }

    if (!this.colors.find(c => c.name === 'tertiary')) {
      this.addColorFromPalette('tertiary', palette.a3);
    }

    if (!this.neutralColorPalette) {
      this.neutralColorPalette = palette.n1;
    }

    if (!this.neutralVariantColorPalette) {
      this.neutralVariantColorPalette = palette.n2;
    }
  }

  private getNeutralVariables(dark: boolean): string {
    const builder = CssVarBuilder.create();

    this.addColors(builder, neutralColors, this.neutralColorPalette, dark);

    builder
      .add('--u-color-background', "var(--u-color-surface-container-highest)")
      .add('--u-color-inverse-background', "var(--u-color-inverse-surface-container-highest)")
      .add('--u-color-on-background', "var(--u-color-on-surface)")
      .add('--u-color-on-inverse-background', "var(--u-color-inverse-on-surface)");

    return builder.build();
  }

  private getNeutralVariantVariables(dark: boolean): string {
    const builder = CssVarBuilder.create();

    this.addColors(builder, neutralVariantColors, this.neutralColorPalette, dark);

    return builder.build()
  }

  getColorVariables(color: ThemeColor, dark: boolean): string {

    const builder = CssVarBuilder.create();

    this.addToneColor(builder, color, color.tonalPalette, dark)

    return builder.build();
  }

  private getColorsVariables(dark: boolean): string {
    let variables = '';

    for (const color of this.colors) {
      variables += this.getColorVariables(color, dark);
    }

    if (this.neutralColorPalette) {
      variables += this.getNeutralVariables(dark);
    }

    if (this.neutralVariantColorPalette) {
      variables += this.getNeutralVariantVariables(dark);
    }

    return variables;
  }

  private addColors(builder: CssVarBuilder, colors: Color[], palette: TonalPalette, dark: boolean): void {
    for (const color of colors) {
      this.addToneColor(builder, color, palette, dark);
    }
  }

  private addToneColor(builder: CssVarBuilder, color: Color, palette: TonalPalette, dark: boolean): void {
    if (color.fixedTone !== undefined) {
      builder.addFromArgb(color.name, palette.tone(color.fixedTone));
      return;
    }

    const tone = dark
      ? color.darkTone!
      : color.lightTone!;

    const inverseTone = dark
      ? color.lightTone!
      : color.darkTone!;

    builder
      .addFromArgb(color.name, palette.tone(tone))
      .addFromArgb(`inverse-${color.name}`, palette.tone(inverseTone));

    if (dark) {
      return;
    }

    builder
      .addFromArgb(`light-${color.name}`, palette.tone(color.lightTone!))
      .addFromArgb(`dark-${color.name}`, palette.tone(color.darkTone!));
  }

  build(): string {

    this.ensureCssClassStartsWithDot();

    const lightCssClass = this.cssClass ?? ':root';
    const darkCssClass = this.cssClass
      ? `${this.cssClass}.u-dark-mode,
${this.cssClass} .u-dark-mode`
      : '.u-dark-mode';

    if (!this.partial) {
      this.ensureThemeColors();
    }

    const variables = `${getCss(lightCssClass, `${this.getColorsVariables(false)}`)}

${getCss(darkCssClass, this.getColorsVariables(true))}
`;
    return variables;
  }
}
