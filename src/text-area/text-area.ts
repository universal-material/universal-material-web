import { CSSResultGroup } from '@lit/reactive-element/css-tag';

import { html, HTMLTemplateResult, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';

import { NativeTextFieldWrapper } from '../shared/char-count-text-field/native-text-field-wrapper.js';
import { TextFieldBase } from '../shared/text-field-base/text-field-base.js';
import { styles } from './text-area.styles.js';

@customElement('u-text-area')
export class TextArea extends NativeTextFieldWrapper {
  static override styles: CSSResultGroup = [TextFieldBase.styles, styles];

  /**
   * The minimum number of visible text rows
   */
  @property({ type: Number }) rows = 2;

  @query('textarea') override input!: HTMLTextAreaElement;

  protected override renderControl(): HTMLTemplateResult {
    return html`
      <div class="input">
        <textarea
          part="input"
          id=${this.id || nothing}
          aria-labelledby="label"
          aria-describedBy="supporting-text"
          ?disabled=${this.disabled}
          spellcheck=${this.spellcheck}
          autocomplete=${this.autocomplete}
          autocapitalize=${this.autocapitalize}
          role=${this.role ?? nothing}
          maxlength=${this.maxlength ?? nothing}
          .rows=${this.rows}
          .placeholder=${this.placeholder}
          .value=${live(this._value)}
          @input=${this._handleInput}></textarea>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-text-area': TextArea;
  }
}
