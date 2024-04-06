import { css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('u-divider')
export class Divider extends LitElement {

  static override styles = css`
    :host {
      --_divider-thickness: var(--u-divider-thickness, 1px);
      display: block;
      margin-block: 8px;
      height: var(--_divider-thickness);
      background-color: var(--u-divider-color, var(--u-outline-variant-color, #cac4d0));
    }

    :host([no-margin]) {
      margin: 0;
    }
  `;

  @property({type: Boolean, attribute: 'no-margin', reflect: true}) noMargin = false;
}

declare global {
  interface HTMLElementTagNameMap {
    'u-divider': Divider;
  }
}
