import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { styles } from './elevation.styles.js';

@customElement('u-elevation')
export class Elevation extends LitElement {
  static override styles = styles;

  override connectedCallback() {
    super.connectedCallback();
    this.ariaHidden = 'true';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-elevation': Elevation;
  }
}
