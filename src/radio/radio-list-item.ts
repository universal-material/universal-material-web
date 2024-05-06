import { customElement } from 'lit/decorators.js';

import { mixinSelectionControlListItem } from '../shared/selection-control/selection-control-list-item';
import { UmRadio } from './radio';

@customElement('u-radio-list-item')
export class UmRadioListItem extends mixinSelectionControlListItem(UmRadio) {

}

declare global {
  interface HTMLElementTagNameMap {
    'u-radio-list-item': UmRadioListItem;
  }
}
