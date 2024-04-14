import { html, HTMLTemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './container.styles.js';
import { GridBase } from './grid-base.js';
import { styles as gridBaseStyles } from './grid-base.styles.js';

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
