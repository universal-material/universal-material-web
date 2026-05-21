import { customElement } from 'lit/decorators.js';

import { SetBase } from '../shared/sets/set-base.js';
import { styles } from './chip-set.styles.js';

@customElement('u-chip-set')
export class ChipSet extends SetBase {
  static override styles = [SetBase.styles, styles];
}

declare global {
  interface HTMLElementTagNameMap {
    'u-chip-set': ChipSet;
  }
}
