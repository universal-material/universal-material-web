import { CSSResultGroup } from '@lit/reactive-element/css-tag';
import { html, HTMLTemplateResult, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';

import { styles } from './text-field.styles.js';

import { UmTextFieldBase } from '../shared/text-field-base/text-field-base.js';

@customElement('u-text-field')
export class UmTextField extends UmTextFieldBase {

  static override styles: CSSResultGroup = [
    UmTextFieldBase.styles,
    styles
  ];

  #value: string = '';

  @property()
  get value() {
    return this.#value;
  }
  set value(value: string) {
    this.#value = value;
    this.empty = !value;
    this.elementInternals.setFormValue(value);
  }

  @property({attribute: 'prefix-text'}) prefixText: string | undefined;
  @property({attribute: 'suffix-text'}) suffixText: string | undefined;

  @query('input') input!: HTMLInputElement;

  override focus() {
    this.input.focus();
  }

  protected override renderControl(): HTMLTemplateResult {

    // const prefix = html`<span class="prefix" slot="prefix">${this.prefixText || html`<slot name="prefix"></slot>`}</span>`;
    // const suffix = html`<span class="suffix" slot="suffix">${this.suffixText || html`<slot name="suffix"></slot>`}</span>`;

    return html`
      <slot class="prefix" name="prefix">
        <span>${this.prefixText}</span>
      </slot>
      <div class="input">
        <input
          part="input"
          id=${this.id || nothing}
          aria-labelledby="label"
          aria-describedBy="supporting-text"
          ?disabled=${this.disabled}
          placeholder=${this.placeholder || nothing}
          .value=${live(this.#value)}
          @input=${this.#handleInput} />
      </div>
      <slot class="suffix" name="suffix">
        <span>${this.suffixText}</span>
      </slot>`;
  }

  #handleInput() {
    this.value = this.input.value;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-text-field': UmTextField;
  }
}
