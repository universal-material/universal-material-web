import { html, HTMLTemplateResult, nothing, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles } from './menu-item.styles.js';

import { UmButtonWrapper } from '../shared/button-wrapper.js';

@customElement('u-menu-item')
export class UmMenuItem extends UmButtonWrapper {
  static override styles = [UmButtonWrapper.styles, styles];

  #active = false;

  /**
   * Force show focus ring
   */
  @property({ type: Boolean, reflect: true })
  get active(): boolean {
    return this.#active;
  }
  set active(active: boolean) {
    this.#active = active;

    if (active) {
      this.classList.add('force-focus-ring');
      return;
    }

    this.classList.remove('force-focus-ring');
  }

  /**
   * Whether the menu item has leading icon or not
   *
   * _Note:_ Readonly
   */
  @property({ type: Boolean, attribute: 'has-leading-icon', reflect: true }) hasLeadingIcon = false;

  /**
   * Whether the menu item has trailing icon or not
   *
   * _Note:_ Readonly
   */
  @property({ type: Boolean, attribute: 'has-trailing-icon', reflect: true }) hasTrailingIcon = false;

  /**
   * Whether the drawer item has badge or not
   *
   * _Note:_ Readonly
   */
  @property({ type: Boolean, attribute: 'has-badge', reflect: true }) hasBadge = false;

  override innerRole = 'menuitem';

  override connectedCallback() {
    super.connectedCallback();
    this.role = 'presentation';
    this.addEventListener('mouseenter', this.#handleMouseEnter);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('mouseenter', this.#handleMouseEnter);
  }

  #handleMouseEnter = () => this.dispatchEvent(new CustomEvent<UmMenuItem>('menu-item-mouseenter', { bubbles: true }));

  protected override renderContent(): HTMLTemplateResult {
    return html`
      <div class="icon leading">
        <slot name="leading-icon" aria-hidden="true" @slotchange="${this.#handleLeadingIconSlotChange}"></slot>
      </div>
      <span class="label" id="text">
        <slot></slot>
      </span>
      <div class="icon trailing">
        <slot name="trailing-icon" aria-hidden="true" @slotchange="${this.#handleTrailingIconSlotChange}">
          <span>${this.renderDefaultTrailingIcon()}</span>
        </slot>
      </div>
    `;
  }

  protected renderDefaultTrailingIcon(): TemplateResult | typeof nothing {
    return nothing;
  }

  #handleLeadingIconSlotChange(e: Event) {
    this.hasLeadingIcon = (<HTMLSlotElement>e.target).assignedElements({ flatten: true }).length > 0;
  }

  #handleTrailingIconSlotChange(e: Event) {
    this.hasTrailingIcon = (<HTMLSlotElement>e.target).assignedElements({ flatten: true }).length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-menu-item': UmMenuItem;
  }
}
