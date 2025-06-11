import { html, HTMLTemplateResult, nothing } from 'lit';
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js';

import { UmRipple } from '../ripple/ripple.js';
import { UmButtonWrapper } from '../shared/button-wrapper.js';
import { styles } from './chip.styles.js';

import '../ripple/ripple.js';
import '../elevation/elevation.js';

@customElement('u-chip')
export class UmChip extends UmButtonWrapper {
  static override styles = [UmButtonWrapper.styles, styles];

  #clickable = false;
  #toggle = false;

  /**
   * Whether the chip is selected or not
   */
  @property({ type: Boolean, reflect: true }) selected = false;

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

  /**
   * Whether the chip has a leading icon or not
   *
   * _Note:_ Readonly
   */
  @property({ type: Boolean, attribute: 'has-leading-icon', reflect: true }) hasLeadingIcon = false;

  /**
   * Whether the chip has a selected icon or not
   *
   * _Note:_ Readonly
   */
  @property({ type: Boolean, attribute: 'has-selected-icon', reflect: true }) hasSelectedIcon = false;

  /**
   * Whether the chip has a trailing icon or not
   *
   * _Note:_ Readonly
   */
  @property({ type: Boolean, attribute: 'has-trailing-icon', reflect: true }) hasTrailingIcon = false;

  @queryAssignedElements({ slot: 'leading-icon', flatten: true })
  private readonly assignedLeadingIcons!: HTMLElement[];

  @queryAssignedElements({ slot: 'icon-selected', flatten: true })
  private readonly assignedSelectedIcons!: HTMLElement[];

  @queryAssignedElements({ slot: 'trailing-icon', flatten: true })
  private readonly assignedTrailingIcons!: HTMLElement[];

  @query('#remove-ripple') removeRipple!: UmRipple;

  override connectedCallback() {
    super.connectedCallback();
    this.renderRipple = this.#clickable || this.#toggle;
  }

  #handleRemoveClick(e: Event) {
    e.stopPropagation();

    if (!(e as PointerEvent).pointerType) {
      this.removeRipple.createRipple();
    }

    const removeEvent = new Event('remove', { cancelable: true });
    this.dispatchEvent(removeEvent);

    if (!removeEvent.defaultPrevented) {
      this.remove();
    }
  }

  #handleTrailingIconSlotChange() {
    this.hasTrailingIcon = this.assignedTrailingIcons.length > 0;
  }

  #handleLeadingIconSlotChange() {
    this.hasLeadingIcon = this.assignedLeadingIcons.length > 0;
  }

  #handleSelectedIconSlotChange() {
    this.hasSelectedIcon = this.assignedSelectedIcons.length > 0;
  }

  protected override handleClick(event: UIEvent): void {
    super.handleClick(event);

    if (!this.toggle) {
      return;
    }

    this.selected = !this.selected;
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  protected override renderContent(): HTMLTemplateResult {
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

    return html`
      <div class="container">
        <div class="outline"></div>
        <span class="icon leading" part="icon leading">
          <slot name="leading-icon" @slotchange="${this.#handleLeadingIconSlotChange}"></slot>
        </span>
        <span class="icon selected" part="icon selected">
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
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-chip': UmChip;
  }
}
