import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles } from './divider.styles';

@customElement('u-divider')
export class UmDivider extends LitElement {

  static override styles = styles;

  /**
   * When true, remove the margin of the divider
   */
  @property({type: Boolean, attribute: 'no-margin', reflect: true}) noMargin = false;
}

declare global {
  interface HTMLElementTagNameMap {
    'u-divider': UmDivider;
  }
}
