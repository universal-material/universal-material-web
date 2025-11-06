import { html, HTMLTemplateResult, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { UmButtonWrapper } from '../shared/button-wrapper.js';
import { styles } from './menu-item.styles.js';

@customElement('u-menu-item')
export class UmMenuItem extends UmButtonWrapper {
  static override styles = [UmButtonWrapper.styles, styles];

  @property({ type: Boolean, reflect: true }) active = false;

  @state() private _hasLeadingIcon = false;
  @state() private _hasTrailingIcon = false;
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

  readonly #handleMouseEnter = () => this.dispatchEvent(new CustomEvent<UmMenuItem>('menu-item-mouseenter', { bubbles: true }));

  protected override _getContainerClasses(): Record<string, boolean> {
    return {
      ...super._getContainerClasses(),
      'force-focus-ring': this.active,
      'leading-icon': this._hasLeadingIcon,
      'trailing-icon': this._hasTrailingIcon,
    };
  }

  protected override _renderContent(): HTMLTemplateResult {
    return html`
      <div class="icon leading">
        <slot name="leading-icon" aria-hidden="true" @slotchange="${this.#handleLeadingIconSlotChange}"></slot>
      </div>
      <span class="label" id="text">
        <slot></slot>
      </span>
      <div class="icon trailing">
        <slot name="trailing-icon" aria-hidden="true" @slotchange="${this.#handleTrailingIconSlotChange}">
          <span>${this._renderDefaultTrailingIcon()}</span>
        </slot>
      </div>
    `;
  }

  protected _renderDefaultTrailingIcon(): TemplateResult | typeof nothing {
    return nothing;
  }

  #handleLeadingIconSlotChange(e: Event) {
    this._hasLeadingIcon = (e.target as HTMLSlotElement).assignedElements({ flatten: true }).length > 0;
  }

  #handleTrailingIconSlotChange(e: Event) {
    this._hasTrailingIcon = (e.target as HTMLSlotElement).assignedElements({ flatten: true }).length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-menu-item': UmMenuItem;
  }
}
