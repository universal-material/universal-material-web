import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { styles } from './elevation.styles.js';

@customElement('u-elevation')
export class UmElevation extends LitElement {
  static override styles = styles;

  override ariaHidden = "true";
}

declare global {
  interface HTMLElementTagNameMap {
    'u-elevation': UmElevation;
  }
}
