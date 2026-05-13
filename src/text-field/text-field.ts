import { CSSResultGroup } from '@lit/reactive-element/css-tag';

import { html, HTMLTemplateResult, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';

import { UmNativeTextFieldWrapper } from '../shared/char-count-text-field/native-text-field-wrapper.js';
import { UmTextFieldBase } from '../shared/text-field-base/text-field-base.js';
import { styles } from './text-field.styles.js';

@customElement('u-text-field')
export class UmTextField extends UmNativeTextFieldWrapper {
  static override styles: CSSResultGroup = [UmTextFieldBase.styles, styles];

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
          spellcheck=${this.spellcheck}
          autocomplete=${this.autocomplete ?? nothing}
          autocapitalize=${this.autocapitalize || nothing}
          ?autofocus=${this.autofocus}
          role=${this.role ?? nothing}
          maxlength=${this.maxlength ?? nothing}
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
}

declare global {
  interface HTMLElementTagNameMap {
    'u-text-field': UmTextField;
  }
}
