import { html, LitElement, TemplateResult } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './tab-bar.styles.js';
import { Tab } from './tab.js';

@customElement('u-tab-bar')
export class TabBar extends LitElement {
  static override styles = [baseStyles, styles];

  #tabs: Tab[] = [];
  #activeTab: Tab | null = null;
  readonly #resizeObserver: ResizeObserver = new ResizeObserver(() => {
    this._setScrollIndicatorsActive();
    this._updateTabIndicator();
  });

  /**
   * The Tab Bar variant to render
   */
  @property({ reflect: true }) variant: 'primary' | 'secondary' = 'primary';

  @query('.scroll-left') private readonly _scrollLeft!: HTMLElement;
  @query('.scroll-right') private readonly _scrollRight!: HTMLElement;
  @query('.container') private readonly _container!: HTMLElement;
  @query('.tab-indicator') private readonly _tabIndicator?: HTMLElement;

  @queryAssignedElements({ flatten: true }) assignedElements!: HTMLElement[];

  get activeTabIndex(): number {
    if (!this.activeTab) {
      return -1;
    }

    return this.#tabs.indexOf(this.activeTab);
  }

  set activeTabIndex(index: number) {
    this.activeTab = this.#tabs[index];
  }

  get activeTab(): Tab | null {
    return this.#activeTab;
  }

  set activeTab(activeTab: Tab | null) {
    if (!this.#tabs.length) {
      this.#activeTab = null;
      this._updateTabIndicator();
      return;
    }

    if (
      !activeTab
      || this.#activeTab === activeTab
      || !this.#tabs.includes(activeTab)
    ) {
      return;
    }

    const previouslyActiveTab = this.#activeTab;
    this.#activeTab = activeTab;

    previouslyActiveTab?.requestUpdate();

    activeTab.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    activeTab.requestUpdate();
    this._updateTabIndicator();
  }

  override attributeChangedCallback(
    name: string,
    _old: string | null,
    _new: string | null,
  ) {
    super.attributeChangedCallback(name, _old, _new);

    if (name === 'variant') {
      this._updateTabIndicator();
    }
  }

  override connectedCallback() {
    super.connectedCallback();

    this.#attach();
  }

  protected override render(): TemplateResult {
    const classes = { secondary: this.variant === 'secondary' };

    return html`
      <div
        class="scroll-indicator scroll-left active"
        @click=${this.#scrollToLeft}>
        <u-elevation></u-elevation>
        <u-ripple></u-ripple>
        <slot name="scroll-left">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 -960 960 960"
            width="1em"
            fill="currentColor">
            <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
          </svg>
        </slot>
      </div>
      <div
        class="container ${classMap(classes)}"
        @scrollend=${this.#handleContainerScrollEnd}>
        <slot @slotchange=${this.#handleSlotChange}></slot>
        <div class="tab-indicator"></div>
      </div>
      <div
        class="scroll-indicator scroll-right active"
        @click=${this.#scrollToRight}>
        <u-elevation></u-elevation>
        <u-ripple></u-ripple>
        <slot name="scroll-right">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 -960 960 960"
            width="1em"
            fill="currentColor">
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
          </svg>
        </slot>
      </div>
    `;
  }

  constructor() {
    super();
    this.#resizeObserver.observe(this);
  }

  readonly #handleSlotChange = () => {
    this.#registerTabs();
  };

  // Re-acquire the slotted tabs and (re)bind their `_bar`. Tabs null their `_bar`
  // on disconnect, and the default slot's `slotchange` does NOT re-fire when the
  // bar is moved in the DOM as a unit — so without re-registering on connect, a
  // moved tab-bar's tabs go inert (clicks no-op, active indicator lost).
  #registerTabs(): void {
    const tabs = this.assignedElements.filter(
      (element): element is Tab => element instanceof Tab,
    );

    if (!tabs.length) {
      return;
    }

    this.#tabs = tabs;

    for (const tab of tabs) {
      tab._bar = this;
    }

    if (this.activeTabIndex < 0) {
      // Honor a `<u-tab active>` in markup for the initial selection; fall back
      // to the first tab. `tab.active` is derived from `bar.activeTab`, so the
      // attribute is the only initial-state signal a tab can carry on its own.
      this.activeTab = this.#tabs.find(tab => tab.hasAttribute('active')) ?? this.#tabs[0];
    } else {
      this.activeTab?.requestUpdate();
      this._updateTabIndicator();
    }
  }

  readonly #handleContainerScrollEnd = () => {
    this._setScrollIndicatorsActive();
  };

  _updateTabIndicator() {
    if (!this._tabIndicator) {
      return;
    }

    if (!this.activeTab) {
      this._tabIndicator.style.left = '0';
      this._tabIndicator.style.width = '0';
      return;
    }

    const padding = this.variant === 'primary'
      ? parseInt(this.activeTab._paddingInline, 10)
      : 0;

    this._tabIndicator.style.left = `${this.activeTab.offsetLeft + padding}px`;
    this._tabIndicator.style.width = `${
      this.activeTab.offsetWidth - padding * 2
    }px`;
  }

  readonly #scrollToLeft = () => {
    this._container.scrollBy({
      left: this._container.offsetWidth / -2,
      behavior: 'smooth',
    });
  };

  readonly #scrollToRight = () => {
    this._container.scrollBy({
      left: this._container.offsetWidth / 2,
      behavior: 'smooth',
    });
  };

  _setScrollIndicatorsActive() {
    const scrollSafeMargin = 1;

    const scrollLength =
      this._container.scrollWidth - this._container.offsetWidth;

    const isRtl = getComputedStyle(this._container).direction === 'rtl';
    const scrollStart = isRtl
      ? this._container.scrollLeft + scrollLength
      : this._container.scrollLeft;

    if (scrollStart - scrollSafeMargin <= 0) {
      this._container.scrollBy(-1, 0);
      this._scrollLeft.classList.remove('active');
    } else {
      this._scrollLeft.classList.add('active');
    }

    if (scrollStart >= scrollLength - scrollSafeMargin) {
      this._container.scrollBy(1, 0);
      this._scrollRight.classList.remove('active');
    } else {
      this._scrollRight.classList.add('active');
    }
  }

  async #attach(): Promise<void> {
    await this.updateComplete;
    this.#registerTabs();
    this._setScrollIndicatorsActive();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-tab-bar': TabBar;
  }
}
