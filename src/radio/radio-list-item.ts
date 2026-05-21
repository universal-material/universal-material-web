import { customElement } from 'lit/decorators.js';

import { mixinSelectionControlListItem } from '../shared/selection-control/selection-control-list-item.js';
import { Radio } from './radio.js';

@customElement('u-radio-list-item')
export class RadioListItem extends mixinSelectionControlListItem(Radio) {

}

declare global {
  interface HTMLElementTagNameMap {
    'u-radio-list-item': RadioListItem;
  }
}
