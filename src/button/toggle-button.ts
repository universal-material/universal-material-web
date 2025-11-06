import { CSSResultGroup } from '@lit/reactive-element/css-tag';

import { property, state } from 'lit/decorators.js';

import { UmButtonBase } from './button-base.js';
import { styles } from './toggle-button.styles.js';

export type UmButtonShape = 'round' | 'square';
export type UmButtonSize = 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large';

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
  @property({ reflect: true }) shape: UmButtonShape = 'round';

  /**
   * Sets the size of the button
   */
  @property({ reflect: true }) size: UmButtonSize = 'small';

  /**
   * The `aria-label` of the button when the button is toggleable and selected.
   */
  @property({ attribute: 'aria-label-selected' }) ariaLabelSelected = '';

  @state() _hasSelectionIcon = false;

  protected override _getContainerClasses(): Record<string, boolean> {
    return {
      ...super._getContainerClasses(),
      [this.shape]: true,
      [this.size]: true,
      selected: this.selected,
      toggle: this.toggle,
      'toggle-shape': this.toggleShape,
      'selection-icon': this._hasSelectionIcon,
    };
  }

  protected override _handleClick(event: UIEvent): void {
    super._handleClick(event);

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

  protected _handleSelectedIconSlotChange(e: Event): void {
    this._hasSelectionIcon = (e.target as HTMLSlotElement).assignedElements({ flatten: true }).length > 0;
  }
}
