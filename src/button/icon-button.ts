import { html, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles } from './icon-button.styles.js';
import { ToggleButton } from './toggle-button.js';

export type IconButtonVariant = 'standard' | 'filled' | 'tonal' | 'outlined';
export type IconButtonWidth = 'default' | 'narrow' | 'wide';

@customElement('u-icon-button')
export class IconButton extends ToggleButton {

  static override styles = [ToggleButton.styles, styles];

  /**
   * The Icon Button variant to render
   */
  @property() variant: IconButtonVariant = 'standard';

  /**
   * The width of the Icon Button
   */
  @property() width: IconButtonWidth = 'default';

  protected override _getContainerClasses(): Record<string, boolean> {
    return {
      ...super._getContainerClasses(),
      [this.variant]: true,
      [this.width]: true,
    };
  }

  protected override _renderContent(): HTMLTemplateResult {

    return html`
      <span class="icon-container" aria-hidden="true">
        <span class="icon icon-default">
          <slot></slot>
        </span>
        <span class="icon icon-selected">
          <slot name="selected" @slotchange="${this._handleSelectedIconSlotChange}"></slot>
        </span>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-icon-button': IconButton;
  }
}
