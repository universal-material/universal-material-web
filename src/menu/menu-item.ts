import { html, HTMLTemplateResult } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles';
import { UmButtonWrapper } from '../shared/button-wrapper';
import { styles as buttonWrapperStyles } from '../shared/button-wrapper.styles';
import { styles } from './menu-item.styles';

@customElement('u-menu-item')
export class UmMenuItem extends UmButtonWrapper {

  static override styles = [
    baseStyles,
    buttonWrapperStyles,
    styles
  ];

  /**
   * Whether the drawer item has icon or not
   *
   * _Note:_ Readonly
   */
  @property({type: Boolean, attribute: 'has-icon', reflect: true}) hasIcon = false;

  /**
   * Whether the drawer item has badge or not
   *
   * _Note:_ Readonly
   */
  @property({type: Boolean, attribute: 'has-badge', reflect: true}) hasBadge = false;

  @queryAssignedElements({slot: 'icon', flatten: true})
  private readonly assignedIcons!: HTMLElement[];

  protected override renderContent(): HTMLTemplateResult {
    return html`
      <div class="icon">
        <slot
          name="icon"
          aria-hidden="true"
          @slotchange="${this.handleIconSlotChange}"></slot>
      </div>
      <span class="label"><slot></slot></span>
    `;
  }

  private handleIconSlotChange() {
    this.hasIcon = this.assignedIcons.length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-menu-item': UmMenuItem;
  }
}
