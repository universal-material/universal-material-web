import { customElement } from 'lit/decorators.js';

import { mixinSelectionControlListItem } from '../shared/selection-control/selection-control-list-item';
import { UmSwitch } from './switch';

@customElement('u-switch-list-item')
export class UmSwitchListItem extends mixinSelectionControlListItem(UmSwitch) {

}

declare global {
  interface HTMLElementTagNameMap {
    'u-switch-list-item': UmSwitchListItem;
  }
}
