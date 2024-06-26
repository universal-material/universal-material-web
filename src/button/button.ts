import { html, HTMLTemplateResult, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles } from './button.styles.js';

import { UmButtonBase } from './button-base.js';

import '../ripple/ripple.js';

export type UmButtonVariant = 'filled' | 'tonal' | 'elevated' | 'outlined' | 'text';
export type UmButtonColor = 'primary' | 'secondary' | 'tertiary' | 'error' | undefined;

@customElement('u-button')
export class UmButton extends UmButtonBase {
  static override styles = [UmButtonBase.styles, styles];

  /**
   * The Button variant to render
   */
  @property({ reflect: true }) variant: UmButtonVariant = 'filled';

  /**
   * The Button color
   *
   1
   */
  @property({ reflect: true }) color: UmButtonColor;

  @property({ type: Boolean, attribute: 'trailing-icon', reflect: true }) trailingIcon = false;

  /**
   * Whether the button has icon or not
   *
   * _Note:_ Readonly
   */
  @property({ type: Boolean, attribute: 'has-icon', reflect: true }) hasIcon = false;

  protected override renderContent(): HTMLTemplateResult {
    const icon = html`
      <span class="icon">
        <slot name="icon" aria-hidden="true" @slotchange="${this.handleSlotChange}"></slot>
      </span>
    `;

    return html`
      ${this.trailingIcon ? nothing : icon}
      <span id="text"><slot></slot></span>
      ${this.trailingIcon ? icon : nothing}
    `;
  }

  private handleSlotChange(e: Event) {
    this.hasIcon = (<HTMLSlotElement>e.target).assignedElements({ flatten: true }).length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-button': UmButton;
  }
}
