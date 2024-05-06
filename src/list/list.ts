import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { styles } from './list.styles.js';

@customElement('u-list')
export class UmList extends LitElement {
  static override styles = styles;

  override render(): HTMLTemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-list': UmList;
  }
}
