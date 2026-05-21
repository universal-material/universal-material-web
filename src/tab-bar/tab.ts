import { html, HTMLTemplateResult } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { ButtonWrapper } from '../shared/button-wrapper.js';
import { TabBar } from './tab-bar.js';
import { styles } from './tab.styles.js';

@customElement('u-tab')
export class Tab extends ButtonWrapper {
  static override styles = [ButtonWrapper.styles, styles];

  _bar: TabBar | null = null;

  readonly #resizeObserver: ResizeObserver = new ResizeObserver(() => {
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

  /**
   * Whether the tab has an icon slotted in the `icon` slot
   *
   * _Note:_ Readonly
   */
  @property({ type: Boolean }) hasIcon = false;
  @query('.container') private readonly _container!: HTMLElement;

  get _paddingInline(): string {
    return getComputedStyle(this._container).paddingInline;
  }

  constructor() {
    super();
    this.#resizeObserver.observe(this);
  }

  protected override _renderContent(): HTMLTemplateResult {
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

  protected override _handleClick(_: UIEvent) {
    super._handleClick(_);

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
    const slot = e.target as HTMLSlotElement;
    this.hasIcon = !!slot.assignedElements({ flatten: true }).length;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-tab': Tab;
  }
}
