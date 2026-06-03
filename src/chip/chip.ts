import { html, HTMLTemplateResult, nothing } from 'lit';
import { customElement, property, query, queryAssignedElements, state } from 'lit/decorators.js';

import { Ripple } from '../ripple/ripple.js';
import { ButtonWrapper } from '../shared/button-wrapper.js';
import { styles } from './chip.styles.js';

import '../ripple/ripple.js';
import '../elevation/elevation.js';

@customElement('u-chip')
export class Chip extends ButtonWrapper {
  static override styles = [ButtonWrapper.styles, styles];

  #clickable = false;
  #toggle = false;

  /**
   * Whether the chip is selected or not
   */
  @property({ type: Boolean, reflect: true }) selected = false;

  /**
   * Whether the chip is interactive and renders a ripple on click
   */
  @property({ type: Boolean, reflect: true })
  get clickable(): boolean {
    return this.#clickable;
  }

  set clickable(value: boolean) {
    this.#clickable = value;
    this.renderRipple = this.#clickable || this.#toggle;
  }

  /**
   * Adds elevation to the chip
   */
  @property({ type: Boolean, reflect: true }) elevated = false;

  /**
   * When true, the chip will toggle between selected and unselected
   * states
   */
  @property({ type: Boolean, reflect: true })
  get toggle(): boolean {
    return this.#toggle;
  }

  set toggle(value: boolean) {
    this.#toggle = value;
    this.renderRipple = this.#clickable || this.#toggle;
  }

  /**
   * Add the remove icon
   */
  @property({ type: Boolean, reflect: true }) removable = false;

  /**
   * Hide the selected icon
   */
  @property({ type: Boolean, attribute: 'hide-selected-icon', reflect: true }) hideSelectedIcon = false;

  @state() private _hasLeadingIcon = false;
  @state() private _hasSelectedIcon = false;
  @state() private _hasTrailingIcon = false;

  @queryAssignedElements({ slot: 'leading-icon', flatten: true })
  private readonly _assignedLeadingIcons!: HTMLElement[];

  @queryAssignedElements({ slot: 'icon-selected', flatten: true })
  private readonly _assignedSelectedIcons!: HTMLElement[];

  @queryAssignedElements({ slot: 'trailing-icon', flatten: true })
  private readonly _assignedTrailingIcons!: HTMLElement[];

  @query('#remove-ripple') removeRipple!: Ripple;

  override connectedCallback() {
    super.connectedCallback();
    this.renderRipple = this.#clickable || this.#toggle;
  }

  #handleRemoveClick(e: Event) {
    e.stopPropagation();

    if (!(e as PointerEvent).pointerType) {
      this.removeRipple.createRipple();
    }

    const removeEvent = new Event('remove', { bubbles: true, composed: true, cancelable: true });
    this.dispatchEvent(removeEvent);

    if (!removeEvent.defaultPrevented) {
      this.remove();
    }
  }

  #handleTrailingIconSlotChange() {
    this._hasTrailingIcon = this._assignedTrailingIcons.length > 0;
  }

  #handleLeadingIconSlotChange() {
    this._hasLeadingIcon = this._assignedLeadingIcons.length > 0;
  }

  #handleSelectedIconSlotChange() {
    this._hasSelectedIcon = this._assignedSelectedIcons.length > 0;
  }

  protected override _handleClick(event: UIEvent): void {
    super._handleClick(event);

    if (!this.toggle) {
      return;
    }

    this.selected = !this.selected;
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  protected override _getContainerClasses(): Record<string, boolean> {
    return {
      ...super._getContainerClasses(),
      clickable: this.clickable,
      toggle: this.toggle,
      selected: this.selected,
      removable: this.removable,
      elevated: this.elevated && !this.disabled,
      'trailing-icon': this._hasTrailingIcon,
      'leading-icon': this._hasLeadingIcon,
      'selected-icon': this._hasSelectedIcon,
      'hide-selected-icon': this.hideSelectedIcon,
    };
  }

  protected override _renderContent(): HTMLTemplateResult {
    const remove = html`
      <button class="icon remove-button focus-ring" ?disabled=${this.disabled} @click=${this.#handleRemoveClick}>
        <u-ripple id="remove-ripple" ?disabled=${this.disabled}></u-ripple>
        <slot name="remove-icon">
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
            <path
              d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </slot>
      </button>
    `;

    const outline = !this.disabled && !this.elevated && !this.selected
      ? html`<div class="outline"></div>`
      : nothing;

    return html`
      ${outline}
      <span class="icon leading" part="icon leading">
        <slot name="leading-icon" @slotchange="${this.#handleLeadingIconSlotChange}"></slot>
      </span>
      <span class="icon icon-selected" part="icon selected">
        <slot name="icon-selected" @slotchange="${this.#handleSelectedIconSlotChange}">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 -960 960 960"
            width="1em"
            fill="currentColor">
            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
          </svg>
        </slot>
      </span>
      <div class="label">
        <slot></slot>
      </div>
      <slot
        class="icon trailing"
        part="icon trailing"
        name="trailing-icon"
        @slotchange="${this.#handleTrailingIconSlotChange}"></slot>
      ${this.removable ? remove : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-chip': Chip;
  }
}
