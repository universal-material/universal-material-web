import { property } from 'lit/decorators.js';

import { UmTextFieldBase } from '../text-field-base/text-field-base.js';

export abstract class UmNativeTextFieldWrapper extends UmTextFieldBase {
  protected _value = '';
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

  @property({ reflect: true }) autocomplete: 'on' | 'off' | string | undefined;

  #maxlength: number | undefined;

  @property({ type: Number, reflect: true })
  get maxlength(): number | undefined {
    return this.#maxlength;
  }

  set maxlength(value: number) {
    this.#maxlength = value;
    this.#updateCounter();
  }

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
