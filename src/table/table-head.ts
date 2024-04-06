import { css, html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { BaseStyles } from '../shared/base-styles';

@customElement('u-thead')
export class TableHead extends LitElement {

  static override styles = [
    BaseStyles.styles,
    css`
      :host {
        display: table-header-group;
      }

      ::slotted(u-tr:not(:first-child)) {
        border-top: 1px solid var(--u-outline-variant-color, #cac5ca);
      }
  `];

  protected override render(): HTMLTemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-thead': TableHead;
  }
}
