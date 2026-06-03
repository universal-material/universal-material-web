import { CSSResultGroup } from '@lit/reactive-element/css-tag';

import { html, HTMLTemplateResult, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';

import { NativeTextFieldWrapper } from '../shared/char-count-text-field/native-text-field-wrapper.js';
import { FieldValidity, TextFieldBase } from '../shared/text-field-base/text-field-base.js';
import { styles } from './text-field.styles.js';

@customElement('u-text-field')
export class TextField extends NativeTextFieldWrapper {
  static override styles: CSSResultGroup = [TextFieldBase.styles, styles];

  /**
   * The input type. Mirrors the native `input` element's `type` attribute
   * (e.g. `text`, `email`, `password`, `number`).
   */
  @property() type = 'text';

  /**
   * Text rendered in the default `prefix` slot, shown before the input
   */
  @property({ attribute: 'prefix-text' }) prefixText: string | undefined;

  /**
   * Text rendered in the default `suffix` slot, shown after the input
   */
  @property({ attribute: 'suffix-text' }) suffixText: string | undefined;

  /**
   * Whether the field's value is read-only
   */
  @property({ type: Boolean, reflect: true }) readOnly = false;

  /**
   * A regular expression the value must match for constraint validation
   * (mirrors the native `input` `pattern` attribute)
   */
  @property() pattern: string | undefined;

  /**
   * Minimum number of characters required for constraint validation
   * (mirrors the native `input` `minlength` attribute)
   */
  @property({ type: Number }) minlength: number | undefined;

  /**
   * Mirrors the native `autocapitalize` attribute on the underlying input
   */
  @property({ reflect: true }) override autocapitalize!: string;

  @query('input') input!: HTMLInputElement;

  protected override renderControl(): HTMLTemplateResult {
    return html`
      <slot class="prefix" name="prefix">
        <span>${this.prefixText}</span>
      </slot>
      <div class="input">
        <input
          type=${this.type}
          part="input"
          id=${this.id || nothing}
          aria-labelledby="label"
          aria-describedBy="supporting-text"
          ?readonly=${this.readOnly}
          ?disabled=${this.disabled}
          ?required=${this.required}
          spellcheck=${this.spellcheck}
          autocomplete=${this.autocomplete ?? nothing}
          autocapitalize=${this.autocapitalize || nothing}
          ?autofocus=${this.autofocus}
          role=${this.role ?? nothing}
          maxlength=${this.maxlength ?? nothing}
          minlength=${this.minlength ?? nothing}
          pattern=${this.pattern ?? nothing}
          .placeholder=${this.placeholder ?? nothing}
          .value=${live(this._value)}
          @input=${this._handleInput}
          @keydown=${this._handleKeyDown} />
      </div>
      <slot class="suffix" name="suffix">
        <span>${this.suffixText}</span>
      </slot>
    `;
  }

  protected override _getValidity(): FieldValidity {
    // Delegate to the native input: `required`/`pattern`/`minlength`/`maxlength`
    // are mirrored onto it, so its ValidityState is the single source of truth.
    if (!this.input) {
      return super._getValidity();
    }

    const v = this.input.validity;

    return {
      flags: {
        valueMissing: v.valueMissing,
        typeMismatch: v.typeMismatch,
        patternMismatch: v.patternMismatch,
        tooLong: v.tooLong,
        tooShort: v.tooShort,
        rangeUnderflow: v.rangeUnderflow,
        rangeOverflow: v.rangeOverflow,
        stepMismatch: v.stepMismatch,
        badInput: v.badInput,
        customError: v.customError,
      },
      message: this.input.validationMessage,
      anchor: this.input,
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-text-field': TextField;
  }
}
