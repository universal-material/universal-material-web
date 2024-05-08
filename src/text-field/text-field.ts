import { html, HTMLTemplateResult, LitElement, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './text-field.styles.js';

import { config } from '../config.js';
import { mixinAttributeProperties } from '../shared/mixin-attribute-properties.js';

import '../field/field.js';

const supportingTextAttribute = 'supporting-text';
const errorTextAttribute = 'error-text';
const prefixTextAttribute = 'prefix-text';
const suffixTextAttribute = 'suffix-text';

const textFieldBase = mixinAttributeProperties(
  LitElement,
  supportingTextAttribute,
  errorTextAttribute,
  prefixTextAttribute,
  suffixTextAttribute);

@customElement('u-text-field')
export class UmTextField extends textFieldBase {
  static readonly formAssociated = true;

  static override styles = [baseStyles, styles];

  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  @property() variant = config.fields.defaultAppearance;
  @property() label: string | undefined;
  @property() counter: string | undefined;
  @property({reflect: true}) placeholder: string | undefined;
  @property({attribute: supportingTextAttribute}) supportingText: string | undefined;
  @property({attribute: errorTextAttribute}) errorText: string | undefined;
  @property({attribute: 'prefix-text'}) prefixText: string | undefined;
  @property({attribute: 'suffix-text'}) suffixText: string | undefined;

  @property({type: Boolean, reflect: true}) disabled = false;
  @property({type: Boolean, reflect: true}) invalid = false;

  #value: string = '';

  get form(): HTMLFormElement | null {
    return this.#elementInternals.form;
  }

  get [supportingTextAttribute](): string | undefined {
    return this.supportingText;
  }
  set [supportingTextAttribute](value: string | undefined) {
    this.supportingText = value;
  }

  @property()
  get value() {
    return this.#value;
  }
  set value(value: string) {
    this.#value = value;
    this.#elementInternals.setFormValue(value);
  }

  readonly #elementInternals: ElementInternals;
  @query('input') input!: HTMLInputElement;

  constructor() {
    super();
    this.#elementInternals = this.attachInternals();
  }

  override focus() {
    this.input.focus();
  }

  protected override render(): HTMLTemplateResult {
    const label = this.label
      ? html`<label slot="label" id="label">${this.label}</label>`
      : html`<slot slot="label" name="label"></slot>`;

    const supportingText = this.supportingText
      ? html`<span slot="supporting-text">${this.supportingText}</span>`
      : html`<slot slot="supporting-text" name="supporting-text"></slot>`;

    const errorText = this.errorText
      ? html`<span slot="error-text">${this.errorText}</span>`
      : html`<slot slot="error-text" name="error-text"></slot>`;
    const prefix = html`<span class="prefix" slot="prefix">${this.prefixText || html`<slot name="prefix"></slot>`}</span>`;
    const suffix = html`<span class="suffix" slot="suffix">${this.suffixText || html`<slot name="suffix"></slot>`}</span>`;
    const counter = this.counter
      ? html`<span slot="counter">${this.counter}</span>`
      : html`<slot slot="counter" name="counter"></slot>`;

    return html`
      <u-field
        .variant=${this.variant}
        ?invalid=${this.invalid}
        ?disabled=${this.disabled}
        ?empty=${!this.#value}>
        ${label}
        <slot slot="leading-icon" name="leading-icon"></slot>
        ${prefix}
        <input
          part="input"
          id=${this.id || nothing}
          aria-labelledby="label"
          ?disabled=${this.disabled}
          placeholder=${this.placeholder || nothing}
          .value=${live(this.#value)}
          @input=${this.#handleInput} />
        ${suffix}
        <slot slot="trailing-icon" name="trailing-icon"></slot>
        ${supportingText}
        ${errorText}
        ${counter}
      </u-field>`;
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
