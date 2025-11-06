import { html, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles } from './icon-button.styles.js';
import { UmToggleButton } from './toggle-button.js';

export type UmIconButtonVariant = 'standard' | 'filled' | 'tonal' | 'outlined';
export type UmIconButtonWidth = 'default' | 'narrow' | 'wide';

@customElement('u-icon-button')
export class UmIconButton extends UmToggleButton {

  static override styles = [UmToggleButton.styles, styles];

  @property() variant: UmIconButtonVariant = 'standard';
  @property() width: UmIconButtonWidth = 'default';

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
    'u-icon-button': UmIconButton;
  }
}
