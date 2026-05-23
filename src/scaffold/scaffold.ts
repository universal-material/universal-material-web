import { ContextProvider } from '@lit/context';

import { html, HTMLTemplateResult, LitElement, PropertyValues } from 'lit';
import { customElement, query } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import type { ScaffoldPane, ScaffoldPanePosition } from './scaffold-pane.js';
import { styles } from './scaffold.styles.js';
import { scrollContainerContext } from './scroll-container-context.js';

/**
 * Layout container that hosts the top app bar, navigation bar, scrollable
 * content, optional side panes and a floating FAB. The scaffold publishes
 * its internal scroll element through Lit context so descendants like
 * `u-top-app-bar`, `u-navigation-bar`, `u-fab` and `u-fab-menu` can react
 * to the same scroll source without manual wiring.
 *
 * Side panes are declared as `u-scaffold-pane` light-DOM children with a
 * `position` attribute (`start` or `end`). The scaffold auto-routes them
 * into the `start-pane` / `end-pane` slots and reserves grid columns for
 * them at the `lg` breakpoint and above. Below `lg`, panes hide and open
 * as modal overlays (see `u-scaffold-pane` for collapse behavior).
 *
 * The scroll container spans the main column — slotted bars use
 * `position="absolute"` (auto-applied by the scaffold) and their internal
 * `.spacing` filler reserves the bar's height inside the scrolled flow so
 * content does not get obscured. The FAB lives outside the scroll
 * container, anchored absolutely to the scaffold's bottom-right and
 * offset above the navigation bar when one is slotted.
 *
 * @slot top-bar - the top app bar.
 * @slot - the scrollable page content.
 * @slot bottom-bar - the navigation bar (or any bottom-anchored bar).
 * @slot fab - floating action button area, always visible above the navigation bar.
 * @slot start-pane - auto-populated from `u-scaffold-pane[position=start]` light children.
 * @slot end-pane - auto-populated from `u-scaffold-pane[position=end]` light children.
 *
 * @csspart scroll-container
 * @csspart top-bar
 * @csspart bottom-bar
 * @csspart fab
 * @csspart pane-row
 * @csspart start-pane-region
 * @csspart end-pane-region
 *
 * @fires u-scaffold-pane-open - re-dispatched from a child pane opening; `detail.position` is `'start'` or `'end'`.
 * @fires u-scaffold-pane-close - re-dispatched from a child pane closing.
 */
@customElement('u-scaffold')
export class Scaffold extends LitElement {
  static override styles = [baseStyles, styles];

  @query('.scroll-container', true)
  private readonly _scrollContainer!: HTMLElement;

  @query('.bottom-bar', true)
  private readonly _bottomBar!: HTMLElement;

  readonly #scrollContainerProvider = new ContextProvider(this, {
    context: scrollContainerContext,
    initialValue: undefined,
  });

  #bottomBarObserver: ResizeObserver | null = null;

  #paneChildObserver: MutationObserver | null = null;

  /**
   * The internal scrollable element. Exposed for callers that need a stable
   * reference (e.g. tests). Provided to descendants via context.
   */
  get scrollContainer(): HTMLElement | undefined {
    return this.#scrollContainerProvider.value;
  }

  protected override render(): HTMLTemplateResult {
    return html`
      <div class="pane-row" part="pane-row">
        <div class="start-pane-region" part="start-pane-region">
          <slot name="start-pane"></slot>
        </div>
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
        <div class="end-pane-region" part="end-pane-region">
          <slot name="end-pane"></slot>
        </div>
      </div>
      <div class="fab" part="fab">
        <slot name="fab"></slot>
      </div>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('open', this.#onPaneOpen as EventListener);
    this.addEventListener('close', this.#onPaneClose as EventListener);
  }

  protected override firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);
    this.#scrollContainerProvider.setValue(this._scrollContainer);
    this.#measureBottomBar();

    if (typeof ResizeObserver !== 'undefined') {
      this.#bottomBarObserver = new ResizeObserver(() => this.#measureBottomBar());
      this.#bottomBarObserver.observe(this._bottomBar);
    }

    this.#syncPaneSlots();
    this.#paneChildObserver = new MutationObserver(() => this.#syncPaneSlots());
    this.#paneChildObserver.observe(this, {
      childList: true,
      attributes: true,
      attributeFilter: ['position'],
      subtree: false,
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#bottomBarObserver?.disconnect();
    this.#bottomBarObserver = null;
    this.#paneChildObserver?.disconnect();
    this.#paneChildObserver = null;
    this.removeEventListener('open', this.#onPaneOpen as EventListener);
    this.removeEventListener('close', this.#onPaneClose as EventListener);
  }

  /**
   * Opens the pane at the given position, if one is present as a light-DOM
   * child. No-op if the pane is missing.
   */
  openPane(position: ScaffoldPanePosition): void {
    const pane = this.#findPane(position);

    if (pane) {
      pane.open = true;
    }
  }

  /**
   * Closes the pane at the given position.
   */
  closePane(position: ScaffoldPanePosition): void {
    const pane = this.#findPane(position);

    if (pane) {
      pane.open = false;
    }
  }

  /**
   * Toggles the pane at the given position.
   */
  togglePane(position: ScaffoldPanePosition): void {
    const pane = this.#findPane(position);

    if (pane) {
      pane.open = !pane.open;
    }
  }

  #findPane(position: ScaffoldPanePosition): ScaffoldPane | null {
    for (const child of Array.from(this.children)) {
      if (
        child.tagName === 'U-SCAFFOLD-PANE'
        && (child.getAttribute('position') ?? 'start') === position
      ) {
        return child as ScaffoldPane;
      }
    }

    return null;
  }

  readonly #syncPaneSlots = (): void => {
    let hasStart = false;
    let hasEnd = false;

    for (const child of Array.from(this.children)) {
      if (child.tagName !== 'U-SCAFFOLD-PANE') {
        continue;
      }

      const position = child.getAttribute('position') ?? 'start';
      const target = position === 'end' ? 'end-pane' : 'start-pane';

      if (child.getAttribute('slot') !== target) {
        child.setAttribute('slot', target);
      }

      if (position === 'end') {
        hasEnd = true;
      } else {
        hasStart = true;
      }
    }

    this.toggleAttribute('has-start-pane', hasStart);
    this.toggleAttribute('has-end-pane', hasEnd);
  };

  readonly #onPaneOpen = (event: Event): void => {
    const pane = event.target as Element | null;

    if (!pane || pane.tagName !== 'U-SCAFFOLD-PANE' || pane.parentElement !== this) {
      return;
    }

    const position = (pane.getAttribute('position') ?? 'start') as ScaffoldPanePosition;
    this.dispatchEvent(new CustomEvent('u-scaffold-pane-open', {
      detail: { position },
      bubbles: true,
      composed: true,
    }));
  };

  readonly #onPaneClose = (event: Event): void => {
    const pane = event.target as Element | null;

    if (!pane || pane.tagName !== 'U-SCAFFOLD-PANE' || pane.parentElement !== this) {
      return;
    }

    const position = (pane.getAttribute('position') ?? 'start') as ScaffoldPanePosition;
    this.dispatchEvent(new CustomEvent('u-scaffold-pane-close', {
      detail: { position },
      bubbles: true,
      composed: true,
    }));
  };

  readonly #handleBottomBarSlotChange = (event: Event): void => {
    this.#autoSetAbsolutePosition(event);
    this.#measureBottomBar();
  };

  readonly #measureBottomBar = (): void => {
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
  readonly #autoSetAbsolutePosition = (event: Event): void => {
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
    'u-scaffold': Scaffold;
  }
}
