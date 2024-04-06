import { css, html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { BaseStyles } from '../shared/base-styles';

@customElement('u-td')
export class TableCell extends LitElement {

  static override styles = [
    BaseStyles.styles,
    css`
      :host {
        display: table-cell;
        padding: var(--u-td-padding, 13px 16px);
        font-size: var(--u-td-font-size, .875rem);
        font-weight: var(--u-td-font-weight, var(--u-font-weight-medium, 500));
        text-align: start;
      }
  `];

  protected override render(): HTMLTemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-td': TableCell;
  }
}
