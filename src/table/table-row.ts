import { css, html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { BaseStyles } from '../shared/base-styles';

@customElement('u-tr')
export class TableRow extends LitElement {

  static override styles = [
    BaseStyles.styles,
    css`
      :host {
        display: table-row;
      }
  `];

  protected override render(): HTMLTemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-tr': TableRow;
  }
}
