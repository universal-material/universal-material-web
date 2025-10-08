import { PropertyValues } from '@lit/reactive-element';

import { html, HTMLTemplateResult, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { UmNativeTextFieldWrapper } from '../shared/char-count-text-field/native-text-field-wrapper.js';
import { styles } from './search.styles.js';

@customElement('u-search')
export class UmSearch extends UmNativeTextFieldWrapper {

  static override styles = [baseStyles, styles];

  @property({ reflect: true })
  position: 'fixed' | 'absolute' | 'static' = 'fixed';

  @query('input') input!: HTMLInputElement;

  #containerSizeObserver: ResizeObserver | null = null;

  protected override renderControl(): HTMLTemplateResult {
    return html``;
  }

  override render(): HTMLTemplateResult {
    const classes = classMap({
      'inner-container': true,
    });

    return html`<div class="container">
      <div class="${classes}">
        <div class="content">
          <div class="icon leading-icon" part="icon leading">
            <slot name="leading-icon" @slotchange="${this.#handleLeadingIconSlotChange}"></slot>
          </div>
          <input
            class="input"
            part="input"
            id=${this.id || nothing}
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
    
          <div class="icon trailing-icon" part="icon trailing">
            <slot name="trailing-icon" @slotchange="${this.#handleTrailingIconSlotChange}"></slot>
          </div>
        </div>
      </div>
    </div>`;
  }

  #handleLeadingIconSlotChange() {
    this.hasLeadingIcon = this.assignedLeadingIcons.length > 0;
  }

  #handleTrailingIconSlotChange() {
    this.hasTrailingIcon = this.assignedTrailingIcons.length > 0;
  }

  override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    this.#containerSizeObserver = new ResizeObserver(() => this.#setContentHeightProperty());
    this.#containerSizeObserver.observe(this._container);
    this.#setContentHeightProperty();
  }

  #setContentHeightProperty() {
    this.style.setProperty('--_content-height', `${this._container.clientHeight}px`);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-search': UmSearch;
  }
}
