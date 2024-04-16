import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles';
import { styles } from './side-navigation.styles';

@customElement('u-side-navigation')
export class UmSideNavigation extends LitElement {
  static override styles = [
    baseStyles,
    styles
  ];

  /**
   * Toggle the navigation drawer visibility
   *
   * _Modal drawer_: Open if `true`, closed if `false`
   * _Standard drawer_: Collapsed if `true`, visible if `false`
   */
  @property({type: Boolean, attribute: 'toggle-drawer'}) toggleDrawer = false;

  override render(): HTMLTemplateResult {
    return html`
      <div class="grid">
        <div>
          <div class="navigation">
            <div class="scrim ${this.toggleDrawer ? 'toggle' : ''}" @click="${this.scrimClick}"></div>
            <div class="drawer ${this.toggleDrawer ? 'toggle' : ''}">
                <slot name="drawer"></slot>
            </div>
            <slot name="rail"></slot>
          </div>
        </div>
        <div class="content">
            <slot></slot>
        </div>
      </div>
    `;
  }

  private scrimClick() {
    this.toggleDrawer = false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-side-navigation': UmSideNavigation;
  }
}
