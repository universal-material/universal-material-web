import { property } from 'lit/decorators.js';

import { TextFieldBase } from '../text-field-base/text-field-base.js';

export abstract class NativeTextFieldWrapper extends TextFieldBase {
  protected _value = '';

  /**
   * The current text value of the field, submitted with the associated form
   */
  @property()
  get value() {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
    this.empty = !value;
    this.elementInternals.setFormValue(value);
    this.#updateCounter();
  }

  /**
   * Mirrors the native `autocomplete` attribute on the underlying input
   */
  @property({ reflect: true }) autocomplete: 'on' | 'off' | string | undefined;

  #maxlength: number | undefined;

  /**
   * Maximum number of characters the field accepts. When set, drives the
   * automatic character counter shown in the supporting text.
   */
  @property({ type: Number, reflect: true })
  get maxlength(): number | undefined {
    return this.#maxlength;
  }

  set maxlength(value: number) {
    this.#maxlength = value;
    this.#updateCounter();
  }

  /**
   * The ARIA role applied to the inner input element
   */
  @property({ reflect: true }) override role: string | null = null;

  override focus() {
    this.input.focus();
  }

  abstract input: HTMLInputElement | HTMLTextAreaElement;

  protected _handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.elementInternals.form?.requestSubmit();
    }
  }

  protected _handleInput() {
    this.value = this.input.value;
    this.#updateCounter();
  }

  #updateCounter() {
    if (this.maxlength) {
      this._innerCounter = `${this.value.length}/${this.maxlength}`;
      return;
    }

    this._innerCounter = undefined;
  }
}
