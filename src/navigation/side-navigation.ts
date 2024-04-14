import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './side-navigation.styles.js';

@customElement('u-side-navigation')
export class UmSideNavigation extends LitElement {
  static override styles = [
    baseStyles,
    styles
  ];

  @property({type: Boolean, attribute: 'toggle-drawer', reflect: true}) toggleDrawer = false;

  override render(): HTMLTemplateResult {
    return html`
      <div class="grid">
        <div>
          <div class="navigation">
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
}

declare global {
  interface HTMLElementTagNameMap {
    'u-side-navigation': UmSideNavigation;
  }
}
