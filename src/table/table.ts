import { html, HTMLTemplateResult, LitElement } from 'lit';

import './table-head';
import './table-body';
import './table-row';
import './table-cell';
import './table-header-cell';
import { styles as baseStyles } from '../shared/base.styles';
import { styles } from './table.styles';

export class Table extends LitElement {
  static override styles = [baseStyles, styles];

  protected override render(): HTMLTemplateResult {
    return html`
      <slot name="header"></slot>
      <slot></slot>
`;
  }
}

customElements.define('u-table', Table);

declare global {
  interface HTMLElementTagNameMap {
    'u-table': Table;
  }
}
