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
 * each pane that reports itself as expanded (see the pane's
 * `collapse-breakpoint`). When a pane is collapsed it leaves the flow and
 * renders as an overlay anchored to the scaffold (sidebar drawer or
 * fullscreen takeover, controlled by `collapse-mode`).
 *
 * The scaffold reflects which panes are currently expanded as an
 * `expanded-panes` host attribute (`""`, `"start"`, `"end"`, or
 * `"start end"`); the layout CSS keys off this attribute instead of any
 * media query so the start and end panes can use independent breakpoints.
 *
 * The internal layout is a flex-column: the top-bar and bottom-bar each
 * sit in their own positioned row, and the pane-row (start-pane region |
 * scroll-container | end-pane region) fills the remaining height. Slotted
 * bars use `position="absolute"` (auto-applied by the scaffold) so they
 * anchor to their own row — they paint full-width across the scaffold but
 * sit above/below the pane row, not over it. The FAB lives outside the
 * layout column, anchored absolutely to the scaffold host's bottom-right
 * and offset above the navigation bar when one is slotted.
 *
 * @slot top-bar - the top app bar.
 * @slot - the scrollable page content. Hidden when a `position="center"`
 *   pane is present (the center pane becomes the middle column).
 * @slot bottom-bar - the navigation bar (or any bottom-anchored bar).
 * @slot fab - floating action button area, always visible above the navigation bar.
 * @slot start-pane - auto-populated from `u-scaffold-pane[position=start]` light children.
 * @slot center-pane - auto-populated from `u-scaffold-pane[position=center]` light children.
 * @slot end-pane - auto-populated from `u-scaffold-pane[position=end]` light children.
 *
 * @csspart scroll-container
 * @csspart top-bar
 * @csspart bottom-bar
 * @csspart fab
 * @csspart pane-row
 * @csspart start-pane-region
 * @csspart center-pane-region
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
          <div class="start-pane-region" part="start-pane-region">
            <slot name="start-pane"></slot>
          </div>
          <div class="scroll-container" part="scroll-container">
            <slot></slot>
          </div>
          <div class="center-pane-region" part="center-pane-region">
            <slot name="center-pane"></slot>
          </div>
          <div class="end-pane-region" part="end-pane-region">
            <slot name="end-pane"></slot>
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
    this.addEventListener('width-change', this.#onPaneExpansionChange as EventListener);
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
      attributeFilter: ['position', 'expanded', 'width', 'style'],
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
    this.removeEventListener('expand', this.#onPaneExpansionChange as EventListener);
    this.removeEventListener('collapse', this.#onPaneExpansionChange as EventListener);
    this.removeEventListener('width-change', this.#onPaneExpansionChange as EventListener);
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
    let hasCenter = false;
    let hasEnd = false;
    let startExpanded = false;
    let endExpanded = false;
    let startWidth: string | null = null;
    let centerWidth: string | null = null;
    let endWidth: string | null = null;
    let centerPane: ScaffoldPane | null = null;

    for (const child of Array.from(this.children)) {
      if (child.tagName !== 'U-SCAFFOLD-PANE') {
        continue;
      }

      const position = (child.getAttribute('position') ?? 'start') as ScaffoldPanePosition;
      const target = position === 'end'
        ? 'end-pane'
        : position === 'center'
          ? 'center-pane'
          : 'start-pane';

      if (child.getAttribute('slot') !== target) {
        child.setAttribute('slot', target);
      }

      // Read from the property when the element is upgraded — the
      // attribute reflects on the next Lit update tick, so reading the
      // attribute here would miss the initial `expand` event that fires
      // synchronously from the pane's `connectedCallback`.
      const expanded = (child as Partial<ScaffoldPane>).expanded
        ?? child.hasAttribute('expanded');

      const width = this.#resolvePaneWidth(child as HTMLElement);

      if (position === 'end') {
        hasEnd = true;
        endExpanded ||= expanded;
        endWidth ??= width;
      } else if (position === 'center') {
        hasCenter = true;
        centerWidth ??= width;
        centerPane ??= child as ScaffoldPane;
      } else {
        hasStart = true;
        startExpanded ||= expanded;
        startWidth ??= width;
      }
    }

    this.toggleAttribute('has-start-pane', hasStart);
    this.toggleAttribute('has-center-pane', hasCenter);
    this.toggleAttribute('has-end-pane', hasEnd);

    const setOrRemove = (name: string, value: string | null): void => {
      if (value) {
        this.style.setProperty(name, value);
      } else {
        this.style.removeProperty(name);
      }
    };

    setOrRemove('--_u-scaffold-start-pane-width', startWidth);
    setOrRemove('--_u-scaffold-center-pane-width', centerWidth);
    setOrRemove('--_u-scaffold-end-pane-width', endWidth);

    const expanded: string[] = [];
    if (startExpanded) expanded.push('start');
    if (endExpanded) expanded.push('end');

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

  /**
   * Resolve a pane's expanded-column width. Priority:
   *   1. `width` attribute on the pane — bare number → `${n}px`, anything
   *      else passes through as a CSS length / function.
   *   2. `--u-scaffold-pane-width` inline on the pane.
   *   3. `null` — caller falls back to the scaffold-level `--u-scaffold-
   *      {start,end}-pane-width` host var.
   */
  #resolvePaneWidth(pane: HTMLElement): string | null {
    const attr = pane.getAttribute('width');

    if (attr) {
      return /^\d+(\.\d+)?$/.test(attr.trim()) ? `${attr.trim()}px` : attr;
    }

    const cssVar = getComputedStyle(pane)
      .getPropertyValue('--u-scaffold-pane-width')
      .trim();

    return cssVar || null;
  }

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
