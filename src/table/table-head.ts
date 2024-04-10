import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles';
import { styles } from './table-head.styles';

@customElement('u-thead')
export class UmTableHead extends LitElement {

  static override styles = [baseStyles, styles];

  protected override render(): HTMLTemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-thead': UmTableHead;
  }
}
