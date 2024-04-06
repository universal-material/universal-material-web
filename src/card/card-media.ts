import { HTMLTemplateResult, LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('u-card-media')
export class CardMedia extends LitElement {

  static override styles = css`
    :host {
      display: block;
      aspect-ratio: 1;
      border-radius: var(--u-card-shape, var(--u-shape-corner-medium, 12px));
    }

    :host([wide]) {
      aspect-ratio: 16/9;
    }
  `;

  @property({type: Boolean, reflect: true}) wide = false;

  override render(): HTMLTemplateResult {
    return html`
      <slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-card-media': CardMedia;
  }
}
