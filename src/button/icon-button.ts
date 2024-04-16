import { CSSResult, html, HTMLTemplateResult, nothing } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';

import '../ripple/ripple';
import { styles as buttonWrapperStyles } from '../shared/button-wrapper.styles';
import { UmButtonBase } from './button-base';
import { styles } from './icon-button.styles';

export type UmIconButtonVariant = 'standard' | 'filled' | 'tonal' | 'outlined';

@customElement('u-icon-button')
export class UmIconButton extends UmButtonBase {

  static override styles: CSSResult | CSSResult[] = [buttonWrapperStyles, styles];

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

    if (this.toggle) {
      this.selected = !this.selected;
    }
  }

  override getAriaLabel(): string | null | typeof nothing {
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
