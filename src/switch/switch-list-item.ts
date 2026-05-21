import { customElement } from 'lit/decorators.js';

import { mixinSelectionControlListItem } from '../shared/selection-control/selection-control-list-item.js';
import { Switch } from './switch.js';

@customElement('u-switch-list-item')
export class SwitchListItem extends mixinSelectionControlListItem(Switch) {

}

declare global {
  interface HTMLElementTagNameMap {
    'u-switch-list-item': SwitchListItem;
  }
}
