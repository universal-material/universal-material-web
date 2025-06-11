import { html, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles } from './icon-button.styles.js';
import { UmToggleButton } from './toggle-button.js';

export type UmIconButtonVariant = 'standard' | 'filled' | 'tonal' | 'outlined';
export type UmIconButtonWidth = 'default' | 'narrow' | 'wide' | undefined;

@customElement('u-icon-button')
export class UmIconButton extends UmToggleButton {

  static override styles = [UmToggleButton.styles, styles];

  @property({ reflect: true }) variant: UmIconButtonVariant = 'standard';
  @property({ reflect: true }) width: UmIconButtonWidth;

  protected override renderContent(): HTMLTemplateResult {

    return html`
      <span class="icon-container" aria-hidden="true">
        <span class="icon icon-default">
          <slot></slot>
        </span>
        <span class="icon icon-selected">
          <slot name="selected" @slotchange="${this.handleSelectedIconSlotChange}"></slot>
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
