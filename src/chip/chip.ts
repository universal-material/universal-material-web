import { html, HTMLTemplateResult } from 'lit';
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './chip.styles.js';

import { UmRipple } from '../ripple/ripple.js';
import { UmButtonWrapper } from '../shared/button-wrapper.js';

import '../ripple/ripple.js';
import '../elevation/elevation.js';

@customElement('u-chip')
export class UmChip extends UmButtonWrapper {

  static override styles = [
    baseStyles,
    styles
  ];

  /**
   * Whether the chip is selected or not
   */
  @property({ type: Boolean, reflect: true }) selected = false;

  /**
   * Adds elevation to the chip
   */
  @property({ type: Boolean, reflect: true }) elevated = false;

  /**
   * When true, the chip will toggle between selected and unselected
   * states
   */
  @property({ type: Boolean, reflect: true }) toggle = false;

  /**
   * Set the trailing icon as an action
   */
  @property({ type: Boolean, reflect: true }) action = false;

  /**
   * Whether the chip has a leading icon or not
   *
   * _Note:_ Readonly
   */
  @property({type: Boolean, attribute: 'has-leading-icon', reflect: true}) hasLeadingIcon = false;

  /**
   * Whether the chip has a selected icon or not
   *
   * _Note:_ Readonly
   */
  @property({type: Boolean, attribute: 'has-selected-icon', reflect: true}) hasSelectedIcon = false;

  /**
   * Whether the chip has a trailing icon or not
   *
   * _Note:_ Readonly
   */
  @property({type: Boolean, attribute: 'has-trailing-icon', reflect: true}) hasTrailingIcon = false;

  @queryAssignedElements({slot: 'leading-icon', flatten: true})
  private readonly assignedLeadingIcons!: HTMLElement[];

  @queryAssignedElements({slot: 'selected-icon', flatten: true})
  private readonly assignedSelectedIcons!: HTMLElement[];

  @queryAssignedElements({slot: 'trailing-icon', flatten: true})
  private readonly assignedTrailingIcons!: HTMLElement[];

  @query('#action-ripple') actionRipple!: UmRipple;

  #handleActionClick(e: Event) {
    e.stopPropagation();

    if (!(<PointerEvent>e).pointerType) {
      this.actionRipple.createRipple();
    }

    this.dispatchEvent(new Event('action'));
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
    this.dispatchEvent(new Event('change', {bubbles: true}));
  }

  protected override renderContent(): HTMLTemplateResult {
    let trailing = html`<slot
        class="icon trailing"
        name="trailing-icon"
        @slotchange="${this.#handleTrailingIconSlotChange}"></slot>`;

    if (this.action) {
      trailing = html`
        <button 
          class="action focus-ring"
          @click=${this.#handleActionClick}>
          <u-ripple id="action-ripple"></u-ripple>
          ${trailing}
        </button>`
    }

    return html`
      <div class="container">
        <div class="outline"></div>
        <slot
          class="icon leading"
          name="leading-icon"
          @slotchange="${this.#handleLeadingIconSlotChange}">
        </slot>
        <slot
          class="icon leading"
          name="selected-icon"
          @slotchange="${this.#handleSelectedIconSlotChange}">
        </slot>
        <slot></slot>
        ${trailing}
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-chip': UmChip;
  }
}
