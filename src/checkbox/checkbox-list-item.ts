import { customElement } from 'lit/decorators.js';

import { mixinSelectionControlListItem } from '../shared/selection-control/selection-control-list-item.js';
import { Checkbox } from './checkbox.js';

@customElement('u-checkbox-list-item')
export class CheckboxListItem extends mixinSelectionControlListItem(Checkbox) {

}

declare global {
  interface HTMLElementTagNameMap {
    'u-checkbox-list-item': CheckboxListItem;
  }
}
