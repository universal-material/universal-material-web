import { ContextProvider } from '@lit/context';

import { html, HTMLTemplateResult, LitElement, PropertyValues } from 'lit';
import { customElement, query } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './scaffold.styles.js';
import { scrollContainerContext } from './scroll-container-context.js';

/**
 * Layout container that hosts the top app bar, navigation bar, scrollable
 * content and a floating FAB. The scaffold publishes its internal scroll
 * element through Lit context so descendants like `u-top-app-bar`,
 * `u-navigation-bar`, `u-fab` and `u-fab-menu` can react to the same scroll
 * source without manual wiring.
 *
 * The scroll container spans the scaffold's full height — slotted bars use
 * `position="absolute"` (auto-applied by the scaffold) and their internal
 * `.spacing` filler reserves the bar's height inside the scrolled flow so
 * content does not get obscured. The FAB lives outside the scroll container,
 * anchored absolutely to the scaffold's bottom-right and offset above the
 * navigation bar when one is slotted.
 *
 * Slots:
 *  - `top-bar`: the top app bar.
 *  - default: the scrollable page content.
 *  - `bottom-bar`: the navigation bar (or any bottom-anchored bar).
 *  - `fab`: floating action button area, always visible above the
 *    navigation bar.
 *
 * Parts:
 *  - `scroll-container`, `top-bar`, `bottom-bar`, `fab`.
 */
@customElement('u-scaffold')
export class UmScaffold extends LitElement {
  static override styles = [baseStyles, styles];

  @query('.scroll-container', true)
  private readonly _scrollContainer!: HTMLElement;

  @query('.bottom-bar', true)
  private readonly _bottomBar!: HTMLElement;

  #scrollContainerProvider = new ContextProvider(this, {
    context: scrollContainerContext,
    initialValue: undefined,
  });

  #bottomBarObserver: ResizeObserver | null = null;

  /**
   * The internal scrollable element. Exposed for callers that need a stable
   * reference (e.g. tests). Provided to descendants via context.
   */
  get scrollContainer(): HTMLElement | undefined {
    return this.#scrollContainerProvider.value;
  }

  protected override render(): HTMLTemplateResult {
    return html`
      <div class="scroll-container" part="scroll-container">
        <div class="top-bar" part="top-bar">
          <slot name="top-bar" @slotchange=${this.#autoSetAbsolutePosition}></slot>
        </div>
        <slot></slot>
        <div class="bottom-bar" part="bottom-bar">
          <slot
            name="bottom-bar"
            @slotchange=${this.#handleBottomBarSlotChange}></slot>
        </div>
      </div>
      <div class="fab" part="fab">
        <slot name="fab"></slot>
      </div>
    `;
  }

  protected override firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);
    this.#scrollContainerProvider.setValue(this._scrollContainer);
    this.#measureBottomBar();

    if (typeof ResizeObserver !== 'undefined') {
      this.#bottomBarObserver = new ResizeObserver(() => this.#measureBottomBar());
      this.#bottomBarObserver.observe(this._bottomBar);
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#bottomBarObserver?.disconnect();
    this.#bottomBarObserver = null;
  }

  #handleBottomBarSlotChange = (event: Event): void => {
    this.#autoSetAbsolutePosition(event);
    this.#measureBottomBar();
  };

  #measureBottomBar = (): void => {
    if (!this._bottomBar) {
      return;
    }
    const height = this._bottomBar.offsetHeight;
    this.style.setProperty('--_u-scaffold-bottom-bar-height', `${height}px`);
  };

  /**
   * Ensures a slotted top/bottom bar uses `position="absolute"` so it
   * anchors against the scaffold host. Only overrides the default
   * `'fixed'` positioning — any explicit `'static'` or `'absolute'` set by
   * the consumer (or at runtime) is respected.
   */
  #autoSetAbsolutePosition = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    for (const el of slot.assignedElements({ flatten: true })) {
      const tag = el.tagName;
      if (tag !== 'U-TOP-APP-BAR' && tag !== 'U-NAVIGATION-BAR') {
        continue;
      }
      const bar = el as Element & { position: 'fixed' | 'absolute' | 'static' };
      if (bar.position === 'fixed') {
        bar.position = 'absolute';
      }
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'u-scaffold': UmScaffold;
  }
}
