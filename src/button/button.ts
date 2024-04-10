import { CSSResult, html, HTMLTemplateResult, nothing } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';

import { ButtonBase } from './button-base';
import { styles as buttonBaseStyles } from './button-base.styles';
import { styles } from './button.styles';
import '../ripple/ripple.js';

@customElement('u-button')
export class UmButton extends ButtonBase {

  static override styles: CSSResult | CSSResult[] = [buttonBaseStyles, styles];

  /**
   * The Button variant to render
   */
  @property({reflect: true}) variant: 'filled' | 'tonal' | 'elevated' | 'outlined' | 'text' = 'filled';

  /**
   * The Button color
   *
   * _Note:_ Filled buttons only
   */
  @property({reflect: true}) color: 'primary' | 'secondary' | 'tertiary' | 'error' | undefined;

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
      <slot
        name="icon"
        aria-hidden="true"
        @slotchange="${this.handleSlotChange}"></slot>`;

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
