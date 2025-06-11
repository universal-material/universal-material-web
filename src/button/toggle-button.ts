import { CSSResultGroup } from '@lit/reactive-element/css-tag';

import { property } from 'lit/decorators.js';

import { UmButtonBase } from './button-base.js';
import { styles } from './toggle-button.styles.js';

export type UmButtonShape = 'round' | 'square' | undefined;
export type UmButtonSize = 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large' | undefined;

export abstract class UmToggleButton extends UmButtonBase {

  static override styles: CSSResultGroup = [UmButtonBase.styles, styles];

  /**
   * When true, the button will toggle between selected and unselected
   * states
   */
  @property({ type: Boolean, reflect: true }) toggle = false;

  /**
   * When true, the button will toggle between round and square shapes
   */
  @property({ attribute: 'toggle-shape', type: Boolean, reflect: true }) toggleShape = false;

  /**
   * Sets the selected state
   */
  @property({ type: Boolean, reflect: true }) selected = false;

  /**
   * Sets the shape of the button
   */
  @property({ reflect: true }) shape: UmButtonShape;

  /**
   * Sets the size of the button
   */
  @property({ reflect: true }) size: UmButtonSize;

  /**
   * The `aria-label` of the button when the button is toggleable and selected.
   */
  @property({ attribute: 'aria-label-selected' }) ariaLabelSelected = '';

  @property({ type: Boolean, attribute: 'has-selection-icon', reflect: true }) hasSelectionIcon = false;

  protected override handleClick(event: UIEvent): void {
    super.handleClick(event);

    if (!this.toggle) {
      return;
    }

    this.selected = !this.selected;
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  override getAriaLabel(): string | null {
    return this.selected
      ? this.ariaLabelSelected || super.getAriaLabel()
      : super.getAriaLabel();
  }

  protected handleSelectedIconSlotChange(e: Event): void {
    this.hasSelectionIcon = (e.target as HTMLSlotElement).assignedElements({ flatten: true }).length > 0;
  }
}
