import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('u-datepicker')
export class UmDatepicker extends LitElement {

}

declare global {
  interface HTMLElementTagNameMap {
    'u-datepicker': UmDatepicker;
  }
}
