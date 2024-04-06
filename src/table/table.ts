import { css, html, HTMLTemplateResult, LitElement } from 'lit';

import { BaseStyles } from '../shared/base-styles';

import './table-head';
import './table-body';
import './table-row';
import './table-cell';
import './table-header-cell';

export class Table extends LitElement {
  static override styles = [
    BaseStyles.styles,
    css`
      :host {
        display: table;
        min-width: 100%;
        border-collapse: collapse;
      }

      ::slotted(u-thead:not(:first-child)),
      ::slotted(u-tbody:not(:first-child)),
      ::slotted(u-tfooter:not(:first-child)),
      ::slotted(u-tr:not(:first-child)) {
        border-top: 1px solid var(--u-outline-variant-color, #cac5ca);
      }
    `
  ];

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
