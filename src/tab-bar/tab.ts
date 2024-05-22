import { html, HTMLTemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { styles } from './tab.styles.js';

import { UmButtonWrapper } from '../shared/button-wrapper.js';
import { UmTabBar } from './tab-bar.js';

@customElement('u-tab')
export class UmTab extends UmButtonWrapper {
  static override styles = [UmButtonWrapper.styles, styles];

  _bar: UmTabBar | null = null;

  #resizeObserver: ResizeObserver = new ResizeObserver(() => {
    if (this.active) {
      this._bar?._updateTabIndicator();
    }
  });

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

  @property({ type: Boolean }) hasIcon = false;

  constructor() {
    super();
    this.#resizeObserver.observe(this);
  }

  protected override renderContent(): HTMLTemplateResult {
    const classes = { active: this.active, ['has-icon']: this.hasIcon };

    return html`
      <div class="tab-content ${classMap(classes)}">
        <div class="icon" part="icon">
          <slot name="icon" @slotchange=${this.#iconSlotChange}></slot>
        </div>
        <div class="label" part="label">
          <slot></slot>
        </div>
      </div>
    `;
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

    const changePrevented = !this._bar.dispatchEvent(
      new Event('changing', { bubbles: true, cancelable: true }),
    );

    if (changePrevented) {
      return;
    }

    this._bar.activeTab = this;
    this._bar.dispatchEvent(new Event('change', { bubbles: true }));
  }

  #iconSlotChange(e: Event) {
    const slot = <HTMLSlotElement>e.target;
    this.hasIcon = !!slot.assignedElements({ flatten: true }).length;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-tab': UmTab;
  }
}
