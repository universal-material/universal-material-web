import { customElement, property } from 'lit/decorators.js';

import { UmSetBase } from '../shared/sets/set-base.js';
import { styles } from './button-set.styles.js';

@customElement('u-button-set')
export class UmButtonSet extends UmSetBase {

  static override styles = [UmSetBase.styles, styles];

  /**
   * Whether to render the buttons stacked or not
   */
  @property({ type: Boolean, reflect: true }) stack = false;

  override alignment: 'start' | 'center' | 'end' = 'end';
}

declare global {
  interface HTMLElementTagNameMap {
    'u-button-set': UmButtonSet;
  }
}
