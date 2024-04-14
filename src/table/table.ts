import { html, HTMLTemplateResult, LitElement } from 'lit';

import './table-head.js';
import './table-body.js';
import './table-row.js';
import './table-cell.js';
import './table-header-cell.js';
import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './table.styles.js';

export class UmTable extends LitElement {
  static override styles = [baseStyles, styles];

  protected override render(): HTMLTemplateResult {
    return html`
      <slot name="header"></slot>
      <slot></slot>
`;
  }
}

customElements.define('u-table', UmTable);

declare global {
  interface HTMLElementTagNameMap {
    'u-table': UmTable;
  }
}
