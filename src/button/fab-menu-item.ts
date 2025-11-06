import { consume } from '@lit/context';

import { html, HTMLTemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { UmButtonBase } from './button-base.js';
import { fabMenuColorContext } from './fab-menu-color-context.js';
import { styles } from './fab-menu-item.styles.js';
import { fabMenuOpenContext } from './fab-menu-open-context.js';
import { UmFabColor } from './fab.js';

@customElement('u-fab-menu-item')
export class UmFabMenuItem extends UmButtonBase {

  static override styles = [UmButtonBase.styles, styles];
  #index = 0;

  @consume({ context: fabMenuColorContext, subscribe: true })
  @state()
  private readonly _color!: UmFabColor;

  @consume({ context: fabMenuOpenContext, subscribe: true })
  @state()
  private readonly _menuOpen!: boolean;

  /**
   * The text to display the FAB menu item.
   */
  @property() label: string | null = null;

  @state() private _hasIcon = false;

  @state()
  get _index() {
    return this.#index;
  }

  set _index(value) {
    this.#index = value;
    this.style.setProperty('--_animation-delay-increment', value.toString());
  }

  protected override _getContainerClasses(): Record<string, boolean> {
    return {
      ...super._getContainerClasses(),
      open: this._menuOpen,
      [this._color]: true,
      'has-icon': this._hasIcon,
    };
  }

  protected override _renderContent(): HTMLTemplateResult {
    return html`
      <span class="clipper"></span>
      <span class="icon" aria-hidden="true">
        <slot @slotchange=${this.#handleIconSlotChange}></slot>
      </span>
      <span class="label">${this.label}</span>
    `;
  }

  #handleIconSlotChange(e: Event) {
    this._hasIcon = (e.target as HTMLSlotElement).assignedElements({ flatten: true }).length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-fab-menu-item': UmFabMenuItem;
  }
}
