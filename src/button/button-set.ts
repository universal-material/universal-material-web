import { customElement, property } from 'lit/decorators.js';

import { SetBase } from '../shared/sets/set-base.js';
import { styles } from './button-set.styles.js';

@customElement('u-button-set')
export class ButtonSet extends SetBase {

  static override styles = [SetBase.styles, styles];

  /**
   * Whether to render the buttons stacked or not
   */
  @property({ type: Boolean, reflect: true }) stack = false;

  override alignment: 'start' | 'center' | 'end' = 'end';
}

declare global {
  interface HTMLElementTagNameMap {
    'u-button-set': ButtonSet;
  }
}
