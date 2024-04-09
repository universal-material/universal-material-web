import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles } from './divider.styles';

@customElement('u-divider')
export class Divider extends LitElement {

  static override styles = styles;

  @property({type: Boolean, attribute: 'no-margin', reflect: true}) noMargin = false;
}

declare global {
  interface HTMLElementTagNameMap {
    'u-divider': Divider;
  }
}
