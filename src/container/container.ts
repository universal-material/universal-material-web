import { html, HTMLTemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles';
import { styles } from './container.styles';
import { GridBase } from './grid-base';
import { styles as gridBaseStyles } from './grid-base.styles';

@customElement('u-container')
export class UmContainer extends GridBase {

  static override styles = [
    baseStyles,
    gridBaseStyles,
    styles
  ];

  override render(): HTMLTemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-container': UmContainer;
  }
}
