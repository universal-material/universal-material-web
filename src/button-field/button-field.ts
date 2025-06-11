import { html, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { html as staticHtml } from 'lit/static-html.js';

import { UmTextFieldBase } from '../shared/text-field-base/text-field-base.js';
import { styles } from './button-field.styles';

@customElement('u-button-field')
export class UmButtonField extends UmTextFieldBase {
  static override styles = [UmTextFieldBase.styles, styles];

  protected _value = '';
  @property()
  get value() {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
    this.empty = !value;
    this.elementInternals.setFormValue(value);
  }

  @query('.button', true) _button!: HTMLButtonElement;
  @query('.input', true) _input!: HTMLElement;

  protected override renderControl(): TemplateResult {
    return staticHtml`
      <button 
         class="button"
         aria-expanded="false"
         aria-owns="select"
         ?disabled=${this.disabled}></button>
      <div class="input">
        <slot>${this.value}</slot>
      </div>
      <u-ripple ?disabled=${this.disabled}></u-ripple>`;
  }

  protected override renderAfterContent(): TemplateResult {
    return html`
      <u-menu>
        <slot></slot>
      </u-menu>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-button-field': UmButtonField;
  }
}
