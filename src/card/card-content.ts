import { HTMLTemplateResult, LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('u-card-content')
export class CardContent extends LitElement {

  static override styles = css`
    :host {
      display: block;
      padding: var(--u-card-padding, 16px);
    }
  `;

  override render(): HTMLTemplateResult {
    return html`
      <slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-card-content': CardContent;
  }
}
