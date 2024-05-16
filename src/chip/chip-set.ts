import { customElement } from 'lit/decorators.js';

import { styles } from './chip-set.styles.js';

import { UmSetBase } from '../shared/sets/set-base.js';

@customElement('u-chip-set')
export class UmChipSet extends UmSetBase {
  static override styles = [UmSetBase.styles, styles];
}

declare global {
  interface HTMLElementTagNameMap {
    'u-chip-set': UmChipSet;
  }
}
