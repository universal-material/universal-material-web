import { CSSResult, html, HTMLTemplateResult, nothing } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';

import { styles as buttonWrapperStyles } from '../shared/button-wrapper.styles.js';
import { UmButtonBase } from './button-base.js';
import { styles } from './button.styles.js';
import '../ripple/ripple.js';

export type UmButtonVariant = 'filled' | 'tonal' | 'elevated' | 'outlined' | 'text';
export type UmButtonColor = 'primary' | 'secondary' | 'tertiary' | 'error' | undefined;

@customElement('u-button')
export class UmButton extends UmButtonBase {

  static override styles: CSSResult | CSSResult[] = [buttonWrapperStyles, styles];

  /**
   * The Button variant to render
   */
  @property({reflect: true}) variant: UmButtonVariant = 'filled';

  /**
   * The Button color
   *
   * _Note:_ Filled buttons only
   */
  @property({reflect: true}) color: UmButtonColor;

  @property({type: Boolean, attribute: 'trailing-icon', reflect: true}) trailingIcon = false;

  /**
   * Whether the button has icon or not
   *
   * _Note:_ Readonly
   */
  @property({type: Boolean, attribute: 'has-icon', reflect: true}) hasIcon = false;

  @queryAssignedElements({slot: 'icon', flatten: true})
  private readonly assignedIcons!: HTMLElement[];

  protected override renderContent(): HTMLTemplateResult {
    const icon = html`
      <span class="icon">
        <slot
          name="icon"
          aria-hidden="true"
          @slotchange="${this.handleSlotChange}"></slot>
      </span>`;

    return html`
      ${this.trailingIcon ? nothing : icon}
      <span><slot></slot></span>
      ${this.trailingIcon ? icon : nothing}
    `;
  }

  private handleSlotChange() {
    this.hasIcon = this.assignedIcons.length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-button': UmButton;
  }
}
