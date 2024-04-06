import { HTMLTemplateResult, LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('u-button-set')
export class ButtonSet extends LitElement {

  static override styles = css`
    :host {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: flex-end;
      flex-wrap: wrap;
    }
  `;

  override render(): HTMLTemplateResult {
    return html`
      <slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-button-set': ButtonSet;
  }
}
