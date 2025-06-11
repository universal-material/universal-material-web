import { PropertyValues } from '@lit/reactive-element';
import { CSSResultGroup } from '@lit/reactive-element/css-tag';

import { html, HTMLTemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import { styles } from './button.styles.js';
import { UmToggleButton } from './toggle-button.js';

import '../ripple/ripple.js';

export type UmButtonVariant = 'filled' | 'tonal' | 'elevated' | 'outlined' | 'text';
export type UmButtonColor = 'primary' | 'secondary' | 'tertiary' | 'error' | undefined;

@customElement('u-button')
export class UmButton extends UmToggleButton {
  static override styles: CSSResultGroup = [UmToggleButton.styles, styles];

  /**
   * The Button variant to render
   */
  @property({ reflect: true }) variant: UmButtonVariant = 'filled';

  /**
   * The Button color
   */
  @property({ reflect: true }) color: UmButtonColor;

  @property({ type: Boolean, attribute: 'trailing-icon', reflect: true }) trailingIcon = false;

  /**
   * Whether the button has icon or not
   *
   * _Note:_ Readonly
   */
  @property({ type: Boolean, attribute: 'has-icon', reflect: true }) hasIcon = false;

  @property({ type: Boolean, attribute: 'has-selection-label', reflect: true }) hasSelectionLabel = false;

  @query('.label-container', true) private readonly _textWrapper!: HTMLElement;
  @query('#label', true) private readonly _text!: HTMLElement;

  #textSizeObserver!: ResizeObserver | null;

  override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);

    this.#textSizeObserver = new ResizeObserver(() => this.#setTextWrapperWidth());
    this.#textSizeObserver.observe(this._text);
    this.#setTextWrapperWidth();
  }

  #setTextWrapperWidth(): void {
    this._textWrapper.style.width = `${this._text.offsetWidth}px`;
  }

  protected override renderContent(): HTMLTemplateResult {
    return html`
      <span class="icon-container" aria-hidden="true">
        <span class="icon icon-default">
          <slot name="icon" @slotchange="${this.handleIconSlotChange}"></slot>
        </span>
        <span class="icon icon-selected">
          <slot name="icon-selected" @slotchange="${this.handleSelectedIconSlotChange}"></slot>
        </span>
      </span>

      <span class="label-container">
        <span id="label">
          <span class="label label-default">
            <slot></slot>
          </span>
          <span class="label label-selected">
            <slot name="label-selected" @slotchange="${this.handleSelectedLabelSlotChange}"></slot>
          </span>
        </span>
      </span>
    `;
  }

  private handleIconSlotChange(e: Event) {
    this.hasIcon = (e.target as HTMLSlotElement).assignedElements({ flatten: true }).length > 0;
  }

  protected handleSelectedLabelSlotChange(e: Event): void {
    this.hasSelectionLabel = (e.target as HTMLSlotElement).assignedElements({ flatten: true }).length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-button': UmButton;
  }
}
