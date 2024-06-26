import { html, HTMLTemplateResult } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';

import { styles } from './icon-button.styles.js';

import { UmButtonBase } from './button-base.js';

export type UmIconButtonVariant = 'standard' | 'filled' | 'tonal' | 'outlined';

@customElement('u-icon-button')
export class UmIconButton extends UmButtonBase {

  static override styles = [UmButtonBase.styles, styles];

  @property({reflect: true}) variant: UmIconButtonVariant = 'standard';

  /**
   * When true, the button will toggle between selected and unselected
   * states
   */
  @property({type: Boolean}) toggle = false;

  @property({type: Boolean, attribute: 'has-selection-icon', reflect: true}) hasSelectionIcon = false;

  /**
   * Sets the selected state. When false, displays the default icon. When true,
   * displays the selected icon, or the default icon If no `slot="selected"`
   * icon is provided.
   */
  @property({type: Boolean, reflect: true}) selected = false;

  /**
   * The `aria-label` of the button when the button is toggleable and selected.
   */
  @property({attribute: 'aria-label-selected'}) ariaLabelSelected = '';

  @queryAssignedElements({slot: 'selected', flatten: true})
  private readonly selectedIcons!: HTMLElement[];

  protected override renderContent(): HTMLTemplateResult {

    return html`
      <span class="icon" aria-hidden="true"><slot></slot></span>
      <span class="icon icon-selected" aria-hidden="true">
        <slot name="selected" @slotchange="${this.handleSlotChange}"></slot>
      </span>
    `;
  }

  protected override handleClick(event: UIEvent): void {
    super.handleClick(event);

    if (!this.toggle) {
      return;
    }

    this.selected = !this.selected;
    this.dispatchEvent(new Event('change', {bubbles: true}));
  }

  override getAriaLabel(): string | null {
    return this.selected
      ? this.ariaLabelSelected || super.getAriaLabel()
      : super.getAriaLabel();
  }

  private handleSlotChange() {
    this.hasSelectionIcon = this.selectedIcons.length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-icon-button': UmIconButton;
  }
}
