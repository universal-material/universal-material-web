import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles } from './button-set.styles';

@customElement('u-button-set')
export class UmButtonSet extends LitElement {

  static override styles = styles;

  /**
   * Set the alignment of the buttons at the `start`, `center` or at the `end`.
   */
  @property({reflect: true}) align: 'start' | 'center' | 'end' = 'end';

  /**
   * Whether to render the buttons stacked or not
   */
  @property({type: Boolean, reflect: true}) stack = false;

  override render(): HTMLTemplateResult {
    return html`
      <slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-button-set': UmButtonSet;
  }
}
