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
import { UmTab } from './tab.js';

@customElement('u-tab-bar')
export class UmTabBar extends LitElement {
  static override styles = [baseStyles, styles];

  #tabs: UmTab[] = [];
  #activeTab: UmTab | null = null;
  readonly #resizeObserver: ResizeObserver = new ResizeObserver(() => {
    this._setScrollIndicatorsActive();
    this._updateTabIndicator();
  });

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

  get activeTab(): UmTab | null {
    return this.#activeTab;
  }

  set activeTab(activeTab: UmTab | null) {
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
    _: string | null,
    __: string | null,
  ) {
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

  readonly #handleSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    this.#tabs =
      slot.assignedElements({ flatten: true }).filter(element => element instanceof UmTab);

    for (const tab of this.#tabs) {
      tab._bar = this;
    }

    if (this.activeTabIndex > -1) {
      return;
    }

    this.activeTab = this.#tabs[0];
  };

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

    const tabStyles = getComputedStyle(this.activeTab);
    const padding =
      this.variant === 'primary' ? parseInt(tabStyles.paddingInline, 10) : 0;

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
    this._setScrollIndicatorsActive();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-tab-bar': UmTabBar;
  }
}
