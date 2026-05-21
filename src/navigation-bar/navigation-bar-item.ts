import { html, HTMLTemplateResult } from 'lit';
import { customElement, property, queryAssignedElements, queryAssignedNodes, state } from 'lit/decorators.js';

import { UmButtonWrapper } from '../shared/button-wrapper.js';
import { styles } from './navigation-bar-item.styles.js';

export type UmNavBarItemVariant = 'vertical' | 'horizontal';

/**
 * A destination inside a `u-navigation-bar`. Renders an M3 active indicator
 * pill around the icon (vertical) or around icon + label (horizontal), with
 * the destination label.
 *
 * Slots:
 *  - default: the destination label.
 *  - `icon`: the destination icon (24dp).
 *  - `badge`: an optional `u-badge` placed at the top-right of the icon.
 */
@customElement('u-navigation-bar-item')
export class UmNavigationBarItem extends UmButtonWrapper {

  static override styles = [
    UmButtonWrapper.styles,
    styles,
  ];

  @state() private _hasIcon = false;
  @state() private _hasLabel = false;

  /**
   * Whether the navigation item is active (selected) or not.
   */
  @property({ type: Boolean, reflect: true }) active = false;

  /**
   * Layout variant. `'vertical'` (default) stacks the icon over the label
   * with a 56×32dp active indicator pill around the icon. `'horizontal'`
   * places icon and label side-by-side inside a 40dp-high pill.
   */
  @property({ reflect: true }) variant: UmNavBarItemVariant = 'vertical';

  @queryAssignedElements({ slot: 'icon', flatten: true })
  private readonly assignedIcons!: HTMLElement[];

  @queryAssignedNodes({ flatten: true })
  private readonly assignedLabelNodes!: Node[];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('aria-labelledby', 'text');
  }

  protected override _getContainerClasses(): Record<string, boolean> {
    return {
      ...super._getContainerClasses(),
      'has-icon': this._hasIcon,
      'has-label': this._hasLabel,
    };
  }

  protected override _renderContent(): HTMLTemplateResult {
    const icon = html`
      <span class="icon" part="icon">
        <slot
          name="icon"
          aria-hidden="true"
          @slotchange=${this.#handleIconSlotChange}></slot>
        <slot name="badge"></slot>
      </span>
    `;

    const label = html`
      <span class="label" id="text" part="label">
        <slot @slotchange=${this.#handleLabelSlotChange}></slot>
      </span>
    `;

    if (this.variant === 'horizontal') {
      return html`
        <span class="active-indicator" part="active-indicator">
          ${icon}
          ${label}
        </span>
      `;
    }

    return html`
      <span class="active-indicator" part="active-indicator">
        ${icon}
      </span>
      ${label}
    `;
  }

  #handleIconSlotChange = (): void => {
    this._hasIcon = this.assignedIcons.length > 0;
  };

  #handleLabelSlotChange = (): void => {
    this._hasLabel = this.assignedLabelNodes.some(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return !!node.textContent?.trim();
      }
      return true;
    });
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'u-navigation-bar-item': UmNavigationBarItem;
  }
}
