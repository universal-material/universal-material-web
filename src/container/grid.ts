import { html, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import './container';
import { styles as baseStyles } from '../shared/base.styles';
import { GridBase, UmSpacingSizes } from './grid-base';
import { styles as gridBaseStyles } from './grid-base.styles';
import { styles } from './grid.styles';

@customElement('u-grid')
export class UmGrid extends GridBase {

  static override styles = [
    baseStyles,
    gridBaseStyles,
    styles
  ];

  @property({reflect: true}) gutter: UmSpacingSizes | undefined;
  @property({attribute: 'gutter-sm', reflect: true}) gutterSmall: UmSpacingSizes | undefined;
  @property({attribute: 'gutter-md', reflect: true}) gutterMedium: UmSpacingSizes | undefined;
  @property({attribute: 'gutter-lg', reflect: true}) gutterLarge: UmSpacingSizes | undefined;
  @property({attribute: 'gutter-xl', reflect: true}) gutterExtraLarge: UmSpacingSizes | undefined;

  @property({reflect: true}) cols = 1;
  @property({attribute: 'cols-sm', reflect: true}) colsSmall: number | undefined;
  @property({attribute: 'cols-md', reflect: true}) colsMedium: number | undefined;
  @property({attribute: 'cols-lg', reflect: true}) colsLarge: number | undefined;
  @property({attribute: 'cols-xl', reflect: true}) colsExtraLarge: number | undefined;

  @property({attribute: 'template-columns', reflect: true}) templateColumns: number | undefined = undefined;
  @property({attribute: 'template-columns-sm', reflect: true}) templateColumnsSmall: number | undefined;
  @property({attribute: 'template-columns-md', reflect: true}) templateColumnsMedium: number | undefined;
  @property({attribute: 'template-columns-lg', reflect: true}) templateColumnsLarge: number | undefined;
  @property({attribute: 'template-columns-xl', reflect: true}) templateColumnsExtraLarge: number | undefined;

  override render(): HTMLTemplateResult {
    return html`<slot></slot>`;
  }

  override attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    super.attributeChangedCallback(name, _old, value);

    if (name.startsWith('cols')) {
      this.setColumnsVariable(name, value);
      return;
    }

    if (name.startsWith('template-columns')) {
      this.setTemplateColumnsVariable(name, value);
      return;
    }
  }

  private setColumnsVariable(name: string, value: string | null): void {

    const propertyName = `--_${name}`;

    this.setProperty(propertyName, value
      ? `repeat(${value}, minmax(0, 1fr))`
      : null);
  }

  private setTemplateColumnsVariable(name: string, value: string | null): void {

    const propertyName = `--_${name}`;
    this.setProperty(propertyName, value);
  }

  private setProperty(name: string, value: string | null): void {
    if (value) {
      this.style.setProperty(name, value)
      return;
    }

    this.style.removeProperty(name);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-grid': UmGrid;
  }
}
