import { HTMLTemplateResult, LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { styles } from './button-set.styles';

@customElement('u-button-set')
export class ButtonSet extends LitElement {

  static override styles = styles;

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
