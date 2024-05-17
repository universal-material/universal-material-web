import { html, HTMLTemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { styles } from './tab.styles.js';

import { UmButtonWrapper } from '../shared/button-wrapper.js';
import { UmTabBar } from './tab-bar.js';

@customElement('u-tab')
export class UmTab extends UmButtonWrapper {
  static override styles = [UmButtonWrapper.styles, styles];

  _bar: UmTabBar | null = null;

  @state()
  get active(): boolean {
    return this._bar?.activeTab === this;
  }
  set active(active: boolean) {

    if (!this._bar) {
      return;
    }

    if (active) {
      this._bar.activeTab = this;
      return;
    }

    this._bar.activeTabIndex = 0;
  }

  protected override renderContent(): HTMLTemplateResult {
    return html`
      <div class="tab-content ${this.active ? 'active' : ''}">
        <div class="label">
          <slot></slot>
        </div>
      </div>`;
  }

  override connectedCallback() {
    super.connectedCallback();
    this._bar?._updateTabIndicator();
    this._bar?._setScrollIndicatorsActive();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    if (!this._bar) {
      return;
    }

    if (this._bar.activeTab === this) {
      this._bar.activeTabIndex = 0;
    }

    this._bar._updateTabIndicator();
    this._bar._setScrollIndicatorsActive();

    this._bar = null;
  }

  protected override handleClick(_: UIEvent) {
    super.handleClick(_);

    if (!this._bar) {
      return;
    }

    this._bar.activeTab = this;
    this._bar.dispatchEvent(new Event('change', {bubbles: true}));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-tab': UmTab;
  }
}
