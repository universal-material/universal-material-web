import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles } from './badge.styles.js';

@customElement('u-badge')
export class UmBadge extends LitElement {
  static override styles = styles;

  @property({ type: Boolean, reflect: true }) static = false;

  protected override render(): HTMLTemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-badge': UmBadge;
  }
}
