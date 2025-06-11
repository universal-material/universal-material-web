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

  @property() type = 'text';
  @property({ attribute: 'prefix-text' }) prefixText: string | undefined;
  @property({ attribute: 'suffix-text' }) suffixText: string | undefined;
  @property({ type: Boolean, reflect: true }) readOnly = false;
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
          autocomplete=${this.autocomplete}
          autocapitalize=${this.autocapitalize}
          role=${this.role}
          maxlength=${this.maxlength ?? nothing}
          .placeholder=${this.placeholder}
          .value=${live(this._value)}
          @input=${this._handleInput} />
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
