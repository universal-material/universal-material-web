import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles';
import { styles } from './table-body.styles';

@customElement('u-tbody')
export class TableBody extends LitElement {

  static override styles = [baseStyles, styles];

  protected override render(): HTMLTemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-tbody': TableBody;
  }
}
