import { html, HTMLTemplateResult } from 'lit';
import { customElement, property, queryAssignedElements, state } from 'lit/decorators.js';

import { UmButtonWrapper } from '../shared/button-wrapper.js';
import { styles } from './drawer-item.styles.js';

@customElement('u-drawer-item')
export class UmDrawerItem extends UmButtonWrapper {

  static override styles = [
    UmButtonWrapper.styles,
    styles,
  ];

  @state() _hasIcon = false;
  @state() _hasBadge = false;

  /**
   * Whether the drawer item is active or not
   *
   * _Note:_ Readonly
   */
  @property({ type: Boolean, reflect: true }) active = false;

  /**
   * If true, it will not attempt to close de navigation drawer on click
   */
  @property({ type: Boolean, attribute: 'keep-drawer-open', reflect: true }) keepDrawerOpen = false;

  @queryAssignedElements({ slot: 'icon', flatten: true })
  private readonly assignedIcons!: HTMLElement[];

  @queryAssignedElements({ slot: 'badge', flatten: true })
  private readonly assignedBadges!: HTMLElement[];

  override connectedCallback() {
    super.connectedCallback();
    this.setAttribute('aria-labelledby', 'label');
  }

  protected override _getContainerClasses(): Record<string, boolean> {
    return {
      ...super._getContainerClasses(),
      'has-icon': this._hasIcon,
      'has-badge': this._hasBadge,
    };
  }

  protected override _renderContent(): HTMLTemplateResult {
    return html`
      <div class="icon">
        <slot
          name="icon"
          aria-hidden="true"
          @slotchange="${this.handleIconSlotChange}"></slot>
      </div>
      <span class="label" id="text"><slot></slot></span>
      <span class="badge">
        <slot
          name="badge"
          @slotchange="${this.handleBadgeSlotChange}"></slot>
      </span>
    `;
  }

  private handleIconSlotChange() {
    this._hasIcon = this.assignedIcons.length > 0;
  }

  private handleBadgeSlotChange() {
    this._hasBadge = this.assignedBadges.length > 0;
  }

  override _handleClick(): void {
    if (this.keepDrawerOpen) {
      return;
    }

    const sideNavigation = this.closest('u-side-navigation');

    if (sideNavigation) {
      sideNavigation.toggleDrawer = false;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-drawer-item': UmDrawerItem;
  }
}
