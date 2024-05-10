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
    this.elementInternals.setFormValue(value);
  }

  @property({attribute: 'prefix-text'}) prefixText: string | undefined;
  @property({attribute: 'suffix-text'}) suffixText: string | undefined;

  @query('input') input!: HTMLInputElement;

  override focus() {
    this.input.focus();
  }

  protected override renderContent(): HTMLTemplateResult {

    const prefix = html`<span class="prefix" slot="prefix">${this.prefixText || html`<slot name="prefix"></slot>`}</span>`;
    const suffix = html`<span class="suffix" slot="suffix">${this.suffixText || html`<slot name="suffix"></slot>`}</span>`;

    return html`
      ${prefix}
      <input
        part="input"
        id=${this.id || nothing}
        aria-labelledby="label"
        ?disabled=${this.disabled}
        placeholder=${this.placeholder || nothing}
        .value=${live(this.#value)}
        @input=${this.#handleInput} />
      ${suffix}`;
  }

  override get empty(): boolean {
    return !this.#value
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
