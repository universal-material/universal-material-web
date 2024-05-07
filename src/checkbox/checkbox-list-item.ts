import { customElement } from 'lit/decorators.js';

import { mixinSelectionControlListItem } from '../shared/selection-control/selection-control-list-item.js';
import { UmCheckbox } from './checkbox.js';

@customElement('u-checkbox-list-item')
export class UmCheckboxListItem extends mixinSelectionControlListItem(UmCheckbox) {

}

declare global {
  interface HTMLElementTagNameMap {
    'u-checkbox-list-item': UmCheckboxListItem;
  }
}
