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

  private partial = false;
  #corePalette: CorePalette;

  private constructor(primaryColorHex: string) {
    this.cssClass = null;

    this.#corePalette = CorePalette.of(argbFromHex(primaryColorHex));
    this.addColorFromPalette('primary', this.#corePalette.a1);
  }

  static create(primaryColorHex: string): ThemeBuilder {
    return new ThemeBuilder(primaryColorHex);
  }

  static createPartial(primaryColorHex: string): ThemeBuilder {
    const themeBuilder = new ThemeBuilder(primaryColorHex);
    themeBuilder.partial = true;

    return themeBuilder;
  }

  addColorFromHex(name: string, hex: string): ThemeBuilder {
    const palette = TonalPalette.fromInt(argbFromHex(hex));

    this.addColorFromPalette(name, palette);
    return this;
  }

  addColorFromPalette(name: string, palette: TonalPalette): ThemeBuilder {
    this.colors.push({ name, lightTone: 40, darkTone: 80, tonalPalette: palette });
    this.colors.push({ name: `on-${name}`, lightTone: 100, darkTone: 20, tonalPalette: palette });
    this.colors.push({ name: `${name}-container`, lightTone: 90, darkTone: 30, tonalPalette: palette });
    this.colors.push({ name: `on-${name}-container`, lightTone: 10, darkTone: 90, tonalPalette: palette });

    this.colors.push({ name: `${name}-fixed`, fixedTone: 90, tonalPalette: palette });
    this.colors.push({ name: `${name}-fixed-dim`, fixedTone: 80, tonalPalette: palette });
    this.colors.push({ name: `on-${name}-fixed`, fixedTone: 10, tonalPalette: palette });
    this.colors.push({ name: `on-${name}-fixed-variant`, fixedTone: 30, tonalPalette: palette });
    return this;
  }

  addStaticColor(name: string, hex: string, tone: number = 80): ThemeBuilder {
    const palette = TonalPalette.fromInt(argbFromHex(hex));
    this.colors.push({ name, fixedTone: tone, tonalPalette: palette });
    this.colors.push({ name: `on-${name}`, fixedTone: 15, tonalPalette: palette });
    this.colors.push({ name: `${name}-container`, fixedTone: 90, tonalPalette: palette });
    this.colors.push({ name: `on-${name}-container`, fixedTone: 15, tonalPalette: palette });
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
    if (!this.colors.find(c => c.name === 'secondary')) {
      this.addColorFromPalette('secondary', this.#corePalette.a2);
    }

    if (!this.colors.find(c => c.name === 'tertiary')) {
      this.addColorFromPalette('tertiary', this.#corePalette.a3);
    }
  }

  private ensureStatusColors(): void {
    if (!this.colors.find(c => c.name === 'success')) {
      this.addStaticColor('success', '#198754', 60);
    }

    if (!this.colors.find(c => c.name === 'info')) {
      this.addStaticColor('info', '#0dcaf0');
    }

    if (!this.colors.find(c => c.name === 'warning')) {
      this.addStaticColor('warning', '#ffc107');
    }

    if (!this.colors.find(c => c.name === 'error')) {
      this.addColorFromHex('error', '#b3261e');
    }
  }

  private getNeutralVariables(dark: boolean): string {
    const builder = CssVarBuilder.create();

    this.addColors(builder, neutralColors, this.#corePalette.n1, dark);

    builder
      .add('--u-color-body', 'var(--u-color-surface)')
      .add('--u-color-body-rgb', 'var(--u-color-surface-rgb)')
      .add('--u-color-inverse-body', 'var(--u-color-inverse-surface)')
      .add('--u-color-inverse-body-rgb', 'var(--u-color-inverse-surface-rgb)')
      .add('--u-color-on-body', 'var(--u-color-on-surface)')
      .add('--u-color-on-body-rgb', 'var(--u-color-on-surface-rgb)')
      .add('--u-color-on-inverse-body', 'var(--u-color-on-inverse-surface)')
      .add('--u-color-on-inverse-body-rgb', 'var(--u-color-on-inverse-surface-rgb)')
      .add('--u-current-text-color', 'var(--u-color-on-body)')
      .add('--u-current-text-color-rgb', 'var(--u-color-on-body-rgb)');

    return builder.build();
  }

  private getNeutralVariantVariables(dark: boolean): string {
    const builder = CssVarBuilder.create();

    this.addColors(builder, neutralVariantColors, this.#corePalette.n2, dark);

    return builder.build();
  }

  getColorVariables(color: ThemeColor, dark: boolean): string {
    const builder = CssVarBuilder.create();

    this.addToneColor(builder, color, color.tonalPalette, dark);

    return builder.build();
  }

  private getColorsVariables(dark: boolean): string {
    let variables = '';

    for (const color of this.colors) {
      variables += this.getColorVariables(color, dark);
    }

    variables += this.getNeutralVariables(dark);
    variables += this.getNeutralVariantVariables(dark);

    return variables;
  }

  private addColors(builder: CssVarBuilder, colors: Color[], palette: TonalPalette, dark: boolean): void {
    for (const color of colors) {
      this.addToneColor(builder, color, palette, dark);
    }
  }

  private addToneColor(builder: CssVarBuilder, color: Color, palette: TonalPalette, dark: boolean): void {
    if (color.fixedTone !== undefined) {
      if (!dark) {
        builder.addFromArgb(color.name, palette.tone(color.fixedTone));
      }

      return;
    }

    const tone = dark ? color.darkTone! : color.lightTone!;

    const inverseTone = dark ? color.lightTone! : color.darkTone!;

    const inverseName = `inverse-${color.name}`.replace('inverse-on', 'on-inverse');

    builder.addFromArgb(color.name, palette.tone(tone)).addFromArgb(inverseName, palette.tone(inverseTone));

    if (color.name === 'surface' || color.name === 'on-surface') {
      const prefix = color.name.startsWith('on-') ? 'on-' : '';

      builder.addFromArgb(`${prefix}light-surface`, palette.tone(color.lightTone!));
      builder.addFromArgb(`${prefix}dark-surface`, palette.tone(color.darkTone!));
    }

    if (dark) {
      return;
    }
  }

  build(): string {
    this.ensureCssClassStartsWithDot();

    const lightCssClass = this.cssClass ?? ':root';
    const darkCssClass = this.cssClass
      ? `${this.cssClass}.u-dark-mode,
${this.cssClass} .u-dark-mode`
      : '.u-dark-mode';

    this.ensureThemeColors();

    if (!this.partial) {
      this.ensureStatusColors();
    }

    const variables = `${getCss(lightCssClass, `${this.getColorsVariables(false)}`)}

${getCss(darkCssClass, this.getColorsVariables(true))}
`;
    return variables;
  }
}
