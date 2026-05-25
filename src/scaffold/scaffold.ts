import { ContextProvider } from '@lit/context';

import { html, HTMLTemplateResult, LitElement, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import type { ScaffoldPane, ScaffoldPanePosition } from './scaffold-pane.js';
import { styles } from './scaffold.styles.js';
import { scrollContainerContext } from './scroll-container-context.js';

export type ScaffoldLayout = 'list-detail' | 'supporting';

/**
 * Layout container that hosts the top app bar, navigation bar, scrollable
 * content, optional `u-scaffold-pane` regions and a floating FAB. The
 * scaffold publishes its internal scroll element through Lit context so
 * descendants like `u-top-app-bar`, `u-navigation-bar`, `u-fab` and
 * `u-fab-menu` can react to the same scroll source without manual wiring.
 *
 * Panes are declared as `u-scaffold-pane` light-DOM children with a
 * `position` attribute (`navigation`, `center` or `side`). The scaffold
 * auto-routes them into the matching slots and the grid template builds
 * itself from the pane host attributes — see the `layout` property for
 * the two supported column-sizing strategies.
 *
 * The scaffold reflects which lateral panes are currently expanded as an
 * `expanded-panes` host attribute (`""`, `"navigation"`, `"side"`, or
 * `"navigation side"`); the layout CSS keys off this attribute instead
 * of any media query so navigation and side panes can use independent
 * breakpoints.
 *
 * The internal layout is a flex-column: the top-bar and bottom-bar each
 * sit in their own positioned row, and the pane-row (navigation region |
 * scroll-container | center region | side region) fills the remaining
 * height. Slotted bars use `position="absolute"` (auto-applied by the
 * scaffold) so they anchor to their own row — they paint full-width
 * across the scaffold but sit above/below the pane row, not over it.
 * The FAB lives outside the layout column, anchored absolutely to the
 * scaffold host's bottom-right and offset above the navigation bar when
 * one is slotted.
 *
 * @slot top-bar - the top app bar.
 * @slot - the scrollable page content. Hidden when a `position="center"`
 *   pane is present (the center pane becomes the middle column).
 * @slot bottom-bar - the navigation bar (or any bottom-anchored bar).
 * @slot fab - floating action button area, always visible above the navigation bar.
 * @slot navigation-pane - auto-populated from `u-scaffold-pane[position=navigation]` children.
 * @slot center-pane - auto-populated from `u-scaffold-pane[position=center]` children.
 * @slot side-pane - auto-populated from `u-scaffold-pane[position=side]` children.
 *
 * @csspart scroll-container
 * @csspart top-bar
 * @csspart bottom-bar
 * @csspart fab
 * @csspart pane-row
 * @csspart navigation-pane-region
 * @csspart center-pane-region
 * @csspart side-pane-region
 *
 * @cssprop --u-pane-navigation-width - Default width of the navigation column when the pane is a custom-content pane (neither a `u-drawer` nor a `u-navigation-rail` is slotted). When the navigation pane hosts a drawer or rail, the pane resolves its own width and writes it on its host.
 * @cssprop --u-pane-fixed-width - Width of the column marked as "fixed" by the current `layout`. Under `list-detail` (default) this is the center column; under `supporting` it is the side column. Default `360px`.
 * @cssprop --u-app-bar-leading-icon-width - Written by the scaffold as the resolved navigation-pane width so a slotted `u-top-app-bar` can min-width its `.leading-icon` area and visually align its headline with the start of the center column. Consumed at `lg+`. Reset to `0px` when no navigation pane is expanded.
 *
 * @fires u-scaffold-pane-open - re-dispatched from a child pane opening; `detail.position` is `'navigation'`, `'side'` or `'center'`.
 * @fires u-scaffold-pane-close - re-dispatched from a child pane closing.
 */
@customElement('u-scaffold')
export class Scaffold extends LitElement {
  static override styles = [baseStyles, styles];

  /**
   * Which column-sizing strategy to apply to the pane row.
   *
   * - `list-detail` (default): the center column takes
   *   `--u-pane-fixed-width` and the side column flexes (the canonical
   *   email/inbox pattern — fixed list, dynamic detail).
   * - `supporting`: the center column flexes and the side column takes
   *   `--u-pane-fixed-width` (e.g. an editor with a fixed-width help
   *   panel on the right).
   *
   * Internally the scaffold mirrors the strategy as a `dynamic` class
   * on the region that should flex; the SCSS keys off that single
   * class instead of a cascade of attribute selectors.
   */
  @property({ type: String, reflect: true })
  layout: ScaffoldLayout = 'list-detail';

  @query('.scroll-container', true)
  private readonly _scrollContainer!: HTMLElement;

  @query('.bottom-bar-row', true)
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
      <div class="layout">
        <div class="top-bar-row" part="top-bar">
          <slot name="top-bar" @slotchange=${this.#autoSetAbsolutePosition}></slot>
        </div>
        <div class="pane-row" part="pane-row">
          <div class="navigation-pane-region" part="navigation-pane-region">
            <slot name="navigation-pane"></slot>
          </div>
          <div class="scroll-container" part="scroll-container">
            <slot></slot>
          </div>
          <div class="center-pane-region" part="center-pane-region">
            <slot name="center-pane"></slot>
          </div>
          <div class="side-pane-region" part="side-pane-region">
            <slot name="side-pane"></slot>
          </div>
        </div>
        <div class="bottom-bar-row" part="bottom-bar">
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

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('open', this.#onPaneOpen as EventListener);
    this.addEventListener('close', this.#onPaneClose as EventListener);
    this.addEventListener('expand', this.#onPaneExpansionChange as EventListener);
    this.addEventListener('collapse', this.#onPaneExpansionChange as EventListener);
    this.addEventListener('navigation-width-change', this.#onPaneExpansionChange as EventListener);
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
      attributeFilter: ['position', 'expanded'],
      subtree: false,
    });
  }

  protected override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    // `layout` changes which region carries the `.dynamic` class — re-sync.
    if (changedProperties.has('layout')) {
      this.#syncPaneSlots();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#bottomBarObserver?.disconnect();
    this.#bottomBarObserver = null;
    this.#paneChildObserver?.disconnect();
    this.#paneChildObserver = null;
    this.removeEventListener('open', this.#onPaneOpen as EventListener);
    this.removeEventListener('close', this.#onPaneClose as EventListener);
    this.removeEventListener('expand', this.#onPaneExpansionChange as EventListener);
    this.removeEventListener('collapse', this.#onPaneExpansionChange as EventListener);
    this.removeEventListener('navigation-width-change', this.#onPaneExpansionChange as EventListener);
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
        && (child.getAttribute('position') ?? 'navigation') === position
      ) {
        return child as ScaffoldPane;
      }
    }

    return null;
  }

  readonly #syncPaneSlots = (): void => {
    let hasNavigation = false;
    let hasCenter = false;
    let hasSide = false;
    let navigationExpanded = false;
    let sideExpanded = false;
    let centerPane: ScaffoldPane | null = null;

    for (const child of Array.from(this.children)) {
      if (child.tagName !== 'U-SCAFFOLD-PANE') {
        continue;
      }

      const position = (child.getAttribute('position') ?? 'navigation') as ScaffoldPanePosition;
      const target = position === 'side'
        ? 'side-pane'
        : position === 'center'
          ? 'center-pane'
          : 'navigation-pane';

      if (child.getAttribute('slot') !== target) {
        child.setAttribute('slot', target);
      }

      // Read from the property when the element is upgraded — the
      // attribute reflects on the next Lit update tick, so reading the
      // attribute here would miss the initial `expand` event that fires
      // synchronously from the pane's `connectedCallback`.
      const expanded = (child as Partial<ScaffoldPane>).expanded
        ?? child.hasAttribute('expanded');

      if (position === 'side') {
        hasSide = true;
        sideExpanded ||= expanded;
      } else if (position === 'center') {
        hasCenter = true;
        centerPane ??= child as ScaffoldPane;
      } else {
        hasNavigation = true;
        navigationExpanded ||= expanded;
      }
    }

    this.classList.toggle('has-navigation-pane', hasNavigation);
    this.classList.toggle('has-center-pane', hasCenter);
    this.classList.toggle('has-side-pane', hasSide);

    // The `layout` attribute picks which column flexes. Instead of a
    // cascade of `:host([layout=...]...) .region { flex: 1 1 0 }`
    // selectors in SCSS, mirror the choice as a single `.dynamic` class
    // on the relevant region wrapper. SCSS keeps one simple rule.
    const layout = this.layout;
    const navRegion = this.shadowRoot?.querySelector('.navigation-pane-region');
    const centerRegion = this.shadowRoot?.querySelector('.center-pane-region');
    const sideRegion = this.shadowRoot?.querySelector('.side-pane-region');
    navRegion?.classList.remove('dynamic');
    centerRegion?.classList.remove('dynamic');
    sideRegion?.classList.remove('dynamic');

    if (layout === 'list-detail' && hasSide && sideExpanded) {
      // Side fills the remaining row space; center pane (if any) stays
      // fixed at `--u-pane-fixed-width`.
      sideRegion?.classList.add('dynamic');
    } else if (layout === 'supporting' && hasCenter) {
      // Center pane flexes; side stays fixed. (When no center pane is
      // present, the default-slot `.scroll-container` already flexes.)
      centerRegion?.classList.add('dynamic');
    }

    const expanded: string[] = [];
    if (navigationExpanded) expanded.push('navigation');
    if (sideExpanded) expanded.push('side');

    const value = expanded.join(' ');

    if (value) {
      this.setAttribute('expanded-panes', value);
    } else {
      this.removeAttribute('expanded-panes');
    }

    // When a center pane is present, route the scroll-container context
    // to the center pane's internal `.content` so the top app bar's
    // collapse-on-scroll, FAB extension etc. react to scroll inside the
    // center pane (the legacy `.scroll-container` is hidden via CSS).
    const desired = centerPane?.scrollContainer ?? this._scrollContainer;

    if (this.#scrollContainerProvider.value !== desired) {
      this.#scrollContainerProvider.setValue(desired);
    }
  };

  readonly #onPaneExpansionChange = (event: Event): void => {
    const pane = event.target as Element | null;

    if (!pane || pane.tagName !== 'U-SCAFFOLD-PANE' || pane.parentElement !== this) {
      return;
    }

    this.#syncPaneSlots();
  };

  readonly #onPaneOpen = (event: Event): void => {
    const pane = event.target as Element | null;

    if (!pane || pane.tagName !== 'U-SCAFFOLD-PANE' || pane.parentElement !== this) {
      return;
    }

    const position = (pane.getAttribute('position') ?? 'navigation') as ScaffoldPanePosition;
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

    const position = (pane.getAttribute('position') ?? 'navigation') as ScaffoldPanePosition;
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
