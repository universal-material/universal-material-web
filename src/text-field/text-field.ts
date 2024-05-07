import { html, HTMLTemplateResult, LitElement, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';

import { config } from '../config.js';
import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './text-field.styles.js';

import '../field/field.js';

@customElement('u-text-field')
export class UmTextField extends LitElement {
  static readonly formAssociated = true;

  static override styles = [baseStyles, styles];

  @property() variant = config.fields.defaultAppearance;
  @property() label: string | undefined;

  @property({type: Boolean, reflect: true}) disabled = false;
  @property({type: Boolean, reflect: true}) invalid = false;

  #value: string = '';

  get form(): HTMLFormElement | null {
    return this.#elementInternals.form;
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

  protected override render(): HTMLTemplateResult {
    const label = html`<label slot="label" id="label">${this.label}</label>`;

    return html`
      <u-field
        ?empty=${!this.#value}>
        ${this.label ? label : nothing}
        <input
          id=${this.id || nothing}
          aria-labelledby="label"
          .value=${live(this.#value)}
          @input=${this.#handleInput} />
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
