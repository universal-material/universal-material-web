import { HTMLTemplateResult, LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles } from './button-set.styles';

@customElement('u-button-set')
export class ButtonSet extends LitElement {

  static override styles = styles;

  /**
   * Set the alignment of the buttons at the `start`, `center` or at the `end`.
   */
  @property({reflect: true}) align: 'start' | 'center' | 'end' = 'end';

  /**
   * Whether ot not render the buttons stacked
   */
  @property({type: Boolean, reflect: true}) stack = false;

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
