import { css, html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { BaseStyles } from '../shared/base-styles';

@customElement('u-th')
export class TableHeaderCell extends LitElement {

  static override styles = [
    BaseStyles.styles,
    css`
      :host {
        display: table-cell;
        padding: var(--u-th-padding, 13px 16px);
        font-size: var(--u-th-font-size, .8125rem);
        font-weight: var(--u-th-font-weigh, var(--u-font-weight-medium, 500));
        text-align: start;
        color: var(--u-low-emphasis-color, rgba(28, 27, 30, .75));
      }
  `];

  protected override render(): HTMLTemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-th': TableHeaderCell;
  }
}
