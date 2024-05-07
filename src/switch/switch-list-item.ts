import { customElement } from 'lit/decorators.js';

import { mixinSelectionControlListItem } from '../shared/selection-control/selection-control-list-item.js';
import { UmSwitch } from './switch.js';

@customElement('u-switch-list-item')
export class UmSwitchListItem extends mixinSelectionControlListItem(UmSwitch) {

}

declare global {
  interface HTMLElementTagNameMap {
    'u-switch-list-item': UmSwitchListItem;
  }
}
