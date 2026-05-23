import { html, HTMLTemplateResult } from 'lit';
import { customElement, property, query, queryAssignedElements, queryAssignedNodes, state } from 'lit/decorators.js';

import { Ripple } from '../ripple/ripple.js';
import { ButtonWrapper } from '../shared/button-wrapper.js';
import { styles } from './navigation-rail-item.styles.js';

import '../ripple/ripple.js';

export type NavRailItemVariant = 'collapsed' | 'expanded';

/**
 * A destination inside a `u-navigation-rail`. Renders two layouts depending
 * on `variant`:
 *
 * - `collapsed` (default): vertical — a 56×32dp pill around the 24dp icon
 *   with the label stacked below in label-medium type.
 * - `expanded`: horizontal — a full-width pill wraps icon + label inline
 *   (icon at the leading edge, label-large to its right), 56dp tall.
 *
 * Hover/focus/pressed feedback (state layer + ripple) is confined to the
 * active-indicator pill, never the full square. The click target itself
 * stays the full container — clicks anywhere on the item still navigate
 * and emit a ripple inside the pill.
 *
 * The parent `u-navigation-rail` sets `variant` automatically based on the
 * breakpoint and toggle state — consumers don't usually need to set it.
 *
 * Slots:
 *  - default: the destination label.
 *  - `icon`: the destination icon (24dp).
 *  - `badge`: an optional `u-badge` placed at the top-right of the icon.
 */
@customElement('u-navigation-rail-item')
export class NavigationRailItem extends ButtonWrapper {

  static override styles = [
    ButtonWrapper.styles,
    styles,
  ];

  @state() private _hasIcon = false;
  @state() private _hasLabel = false;

  /**
   * Whether the rail item is active (selected) or not.
   */
  @property({ type: Boolean, reflect: true }) active = false;

  /**
   * Layout variant. `collapsed` (default) stacks icon over label with a
   * 56×32dp pill around the icon. `expanded` lays icon + label side-by-side
   * inside a content-sized 56dp pill aligned to the rail's leading edge.
   *
   * Set automatically by `u-navigation-rail` based on which slot the item
   * is placed into (`slot="rail"` → collapsed, `slot="expanded"` → expanded).
   */
  @property({ reflect: true }) variant: NavRailItemVariant = 'collapsed';

  @queryAssignedElements({ slot: 'icon', flatten: true })
  private readonly assignedIcons!: HTMLElement[];

  @queryAssignedNodes({ flatten: true })
  private readonly assignedLabelNodes!: Node[];

  @query('.pill-ripple') private readonly _pillRipple!: Ripple;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('aria-labelledby', 'text');
    // Suppress the default ButtonWrapper ripple — the M3 nav-rail spec
    // confines feedback to the active-indicator pill (not the full square).
    // We render our own u-ripple inside the pill and forward pointer events
    // from the full container to it.
    this.renderRipple = false;
    this.addEventListener('mousedown', this.#handlePillMouseDown);
    this.addEventListener('touchstart', this.#handlePillTouchStart, { passive: true });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('mousedown', this.#handlePillMouseDown);
    this.removeEventListener('touchstart', this.#handlePillTouchStart);
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

    if (this.variant === 'expanded') {
      return html`
        <span class="active-indicator" part="active-indicator">
          <u-ripple class="pill-ripple" ?disabled=${this.disabled}></u-ripple>
          ${icon}
          ${label}
        </span>
      `;
    }

    return html`
      <span class="active-indicator" part="active-indicator">
        <u-ripple class="pill-ripple" ?disabled=${this.disabled}></u-ripple>
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

  #handlePillMouseDown = (e: MouseEvent): void => {
    if (this.disabled || !this._pillRipple) {
      return;
    }
    this._pillRipple.createRipple(e.clientX, e.clientY, 'mouseup');
  };

  #handlePillTouchStart = (e: TouchEvent): void => {
    if (this.disabled || !this._pillRipple || !e.touches[0]) {
      return;
    }
    this._pillRipple.createRipple(e.touches[0].clientX, e.touches[0].clientY, 'touchend');
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'u-navigation-rail-item': NavigationRailItem;
  }
}
