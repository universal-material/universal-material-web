import { html, HTMLTemplateResult, LitElement, PropertyValues } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './scaffold-pane.styles.js';

export type ScaffoldPanePosition = 'navigation' | 'center' | 'side';
export type ScaffoldPaneVariant = 'transparent' | 'filled';
export type ScaffoldPaneCollapseMode = 'sidebar' | 'fullscreen' | 'hidden';
export type ScaffoldPaneCollapseBreakpoint = 'sm' | 'md' | 'lg';

// Mirror of `$breakpoints` in `scss/_variables.scss`. Keep in sync when the
// SCSS map changes — the pane needs the numeric value at runtime to wire up
// a `matchMedia` listener.
const BREAKPOINT_MIN: Record<ScaffoldPaneCollapseBreakpoint, number> = {
  sm: 600,
  md: 840,
  lg: 1200,
};

// Defaults for the navigation pane absorption matrix. Pulled from the M3
// drawer / rail tokens (`--u-navigation-drawer-width: 360px` and
// `--u-nav-rail-width: 96px`) and matched here as literals so the pane
// can write a concrete px value to the parent scaffold without touching
// computed styles cross-component.
const NAV_DRAWER_WIDTH_PX = 360;
const NAV_RAIL_WIDTH_PX = 96;
const NAV_RAIL_EXPANDED_WIDTH_PX = 360;

/**
 * A region declared as a light-DOM child of `u-scaffold`. The parent
 * scaffold routes the pane into its `navigation-pane`, `center-pane` or
 * `side-pane` slot based on the `position` attribute, and reserves a
 * grid column for it whenever the pane reports itself as expanded. When
 * the viewport drops below the pane's `collapse-breakpoint`, the pane
 * leaves the flow and renders as an overlay anchored to the scaffold —
 * either a slide-in modal with a scrim (`collapse-mode="sidebar"`) or a
 * full-scaffold takeover (`collapse-mode="fullscreen"`) covering the
 * top app bar.
 *
 * Canonical list-detail recipe (default `layout="list-detail"` on the
 * scaffold):
 * - navigation pane as `collapse-mode="sidebar" collapse-breakpoint="lg"`,
 * - center pane (fixed at `--u-pane-fixed-width`),
 * - side pane as `collapse-mode="fullscreen" collapse-breakpoint="md"`
 *   (flexes to fill the remaining space).
 *
 * A `position="navigation"` pane can absorb the side-navigation pattern
 * by slotting a `u-drawer` into the `drawer` slot and/or a
 * `u-navigation-rail` into the `rail` slot. The pane then resolves its
 * own width based on what's present, the viewport breakpoint, and the
 * `toggle-drawer` attribute — 360dp for an expanded drawer, 96dp for
 * a collapsed rail, etc. — and writes that width to the parent
 * scaffold's `--u-pane-navigation-width` so the grid track updates.
 *
 * @slot header - Title row / actions. Sticks to the top of the pane.
 * @slot drawer - (navigation pane only) Drop a `u-drawer` here. The
 *   pane sizes its column to the drawer's M3 width at lg+ and slides
 *   the drawer off when `toggle-drawer` is true.
 * @slot rail - (navigation pane only) Drop a `u-navigation-rail` here.
 *   The pane sizes its column to the rail's collapsed width at md+
 *   and expands to the rail's expanded width when `toggle-drawer` is
 *   true.
 * @slot - The pane content. Scrolls if it overflows.
 *
 * @csspart container - The visual surface (filled or transparent).
 * @csspart header
 * @csspart content
 * @csspart scrim - The mobile scrim (sidebar collapse mode only).
 *
 * @fires open - When the pane opens (mobile overlay). Bubbles, composed.
 * @fires close - When the pane closes. Bubbles, composed.
 * @fires expand - When the viewport crosses above `collapse-breakpoint`. Bubbles, composed.
 * @fires collapse - When the viewport crosses below `collapse-breakpoint`. Bubbles, composed.
 */
@customElement('u-scaffold-pane')
export class ScaffoldPane extends LitElement {
  static override styles = [baseStyles, styles];

  /**
   * Which role this pane fills in the scaffold. `navigation` is the
   * leading column (hosts a drawer/rail or custom nav content);
   * `side` is the trailing column (typically the detail or supporting
   * content); `center` replaces the default content slot with a carded
   * middle column. The `center` pane is always expanded — its
   * collapse-mode and collapse-breakpoint are ignored.
   */
  @property({ type: String, reflect: true })
  position: ScaffoldPanePosition = 'navigation';

  /**
   * Background treatment. `filled` gives the pane its own card chrome
   * (`surface-container-low` + `--u-scaffold-pane-filled-shape-corner`,
   * default `medium` / 12dp). `transparent` blends with the scaffold
   * background. Override the surface tone via
   * `--u-scaffold-pane-filled-bg-color` when needed.
   */
  @property({ type: String, reflect: true })
  variant: ScaffoldPaneVariant = 'transparent';

  /**
   * How the pane behaves below `collapse-breakpoint`. `sidebar` slides
   * in from the leading/trailing edge with a scrim when `open` becomes
   * true; `fullscreen` covers the whole scaffold (top app bar included);
   * `hidden` removes the pane from the layout entirely below the
   * breakpoint, with no overlay or drawer fallback. Open/close still
   * fire events even with `hidden` so consumers can mirror state
   * elsewhere (e.g. a bottom-bar nav), but there is no visible effect.
   */
  @property({ type: String, reflect: true, attribute: 'collapse-mode' })
  collapseMode: ScaffoldPaneCollapseMode = 'sidebar';

  /**
   * Viewport threshold at which the pane stops participating in the
   * scaffold grid and renders as an overlay. Default `lg` (1200px) suits
   * navigation drawers; use `md` (840px) for list-detail end panes so
   * they remain in-flow on tablet-sized viewports.
   */
  @property({ type: String, reflect: true, attribute: 'collapse-breakpoint' })
  collapseBreakpoint: ScaffoldPaneCollapseBreakpoint = 'lg';

  #open = false;

  /**
   * Programmatic open state. Only meaningful while the pane is collapsed
   * — at expanded sizes the pane is always rendered in its grid column.
   */
  @property({ type: Boolean, reflect: true })
  get open(): boolean {
    return this.#open;
  }

  set open(value: boolean) {
    const old = this.#open;
    this.#open = value;
    this.requestUpdate('open', old);

    if (old !== value) {
      this.dispatchEvent(new Event(value ? 'open' : 'close', {
        bubbles: true,
        composed: true,
      }));

      if (value) {
        document.addEventListener('keydown', this.#onKeydown);
      } else {
        document.removeEventListener('keydown', this.#onKeydown);
      }
    }
  }

  /**
   * Reflects whether the viewport is at or above `collapse-breakpoint`.
   * Set by the pane itself via `matchMedia`; consumers should treat it
   * as read-only.
   */
  @property({ type: Boolean, reflect: true })
  expanded = false;

  /**
   * Navigation pane only. When `true`, the slotted `u-drawer` slides
   * off and the column collapses to the rail width (or zero if no rail
   * is slotted); the slotted `u-navigation-rail` expands to its M3
   * expanded width (~360dp). Mirrors `u-side-navigation.toggleDrawer`.
   */
  @property({ type: Boolean, reflect: true, attribute: 'toggle-drawer' })
  toggleDrawer = false;

  @queryAssignedElements({ slot: 'drawer' })
  private readonly _drawerSlotted!: HTMLElement[];

  @queryAssignedElements({ slot: 'rail' })
  private readonly _railSlotted!: HTMLElement[];

  #mql: MediaQueryList | null = null;
  #navMql: MediaQueryList | null = null;

  // Cached so the change detection in #syncNavigationWidth can no-op
  // when nothing changed (avoids redundant writes to the parent style).
  #lastNavigationWidth: string | null = null;

  /** Opens the pane. Equivalent to `open = true`. */
  show(): void {
    this.open = true;
  }

  /** Closes the pane. Equivalent to `open = false`. */
  close(): void {
    this.open = false;
  }

  /** Toggles `open`. */
  toggle(): void {
    this.open = !this.open;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.#bindMediaQuery();
    this.#bindNavMediaQuery();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.#onKeydown);
    this.#unbindMediaQuery();
    this.#unbindNavMediaQuery();
    this.#clearNavigationWidth();
  }

  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed);

    if (changed.has('collapseBreakpoint') || changed.has('position')) {
      this.#bindMediaQuery();
    }

    if (changed.has('position')) {
      this.#bindNavMediaQuery();
    }

    if (
      changed.has('position')
      || changed.has('toggleDrawer')
      || changed.has('expanded')
    ) {
      this.#syncNavigationWidth();
    }
  }

  /**
   * The pane's internal scrollable element (the `.content` part). Useful
   * when this pane is the scaffold's center pane and you want bars/FABs
   * to react to scroll inside it — `u-scaffold` reads this getter and
   * publishes it through the scroll-container context.
   */
  get scrollContainer(): HTMLElement | null {
    return this.shadowRoot?.querySelector<HTMLElement>('.content') ?? null;
  }

  protected override render(): HTMLTemplateResult {
    return html`
      <div class="scrim" part="scrim" @click=${this.#onScrimClick}></div>
      <aside class="container" part="container">
        <header class="header" part="header">
          <slot name="header"></slot>
        </header>
        <div class="content" part="content">
          <slot name="drawer" @slotchange=${this.#onNavSlotChange}></slot>
          <slot name="rail" @slotchange=${this.#onNavSlotChange}></slot>
          <slot></slot>
        </div>
      </aside>
    `;
  }

  #bindMediaQuery(): void {
    this.#unbindMediaQuery();

    // Center panes are never collapsed — the middle column can't overlay
    // itself. Skip the matchMedia wiring and stay always-expanded.
    if (this.position === 'center') {
      this.#applyExpanded(true);
      return;
    }

    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      this.expanded = true;
      return;
    }

    const min = BREAKPOINT_MIN[this.collapseBreakpoint];
    this.#mql = window.matchMedia(`(min-width: ${min}px)`);
    this.#mql.addEventListener('change', this.#onMqlChange);
    this.#applyExpanded(this.#mql.matches);
  }

  #unbindMediaQuery(): void {
    if (this.#mql) {
      this.#mql.removeEventListener('change', this.#onMqlChange);
      this.#mql = null;
    }
  }

  readonly #onMqlChange = (event: MediaQueryListEvent): void => {
    this.#applyExpanded(event.matches);
  };

  #applyExpanded(value: boolean): void {
    if (this.expanded === value) {
      return;
    }

    this.expanded = value;
    this.dispatchEvent(new Event(value ? 'expand' : 'collapse', {
      bubbles: true,
      composed: true,
    }));
  }

  // ---------------------------------------------------------------------
  // Navigation pane absorption — when a drawer or rail is slotted, the
  // pane writes its own resolved width to the parent scaffold's
  // `--u-pane-navigation-width` so the scaffold's grid track matches the
  // drawer / rail layout the consumer expects.
  // ---------------------------------------------------------------------

  #bindNavMediaQuery(): void {
    this.#unbindNavMediaQuery();

    if (this.position !== 'navigation') {
      return;
    }

    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    // Track the lg breakpoint separately from `collapseBreakpoint`
    // because the drawer / rail resolution table is keyed on lg+ (the
    // M3 boundary at which the drawer becomes permanent).
    this.#navMql = window.matchMedia(`(min-width: ${BREAKPOINT_MIN.lg}px)`);
    this.#navMql.addEventListener('change', this.#onNavMqlChange);
  }

  #unbindNavMediaQuery(): void {
    if (this.#navMql) {
      this.#navMql.removeEventListener('change', this.#onNavMqlChange);
      this.#navMql = null;
    }
  }

  readonly #onNavMqlChange = (): void => {
    this.#syncNavigationWidth();
  };

  readonly #onNavSlotChange = (): void => {
    const hasDrawer = (this._drawerSlotted?.length ?? 0) > 0;
    const hasRail = (this._railSlotted?.length ?? 0) > 0;
    this.classList.toggle('has-drawer', hasDrawer);
    this.classList.toggle('has-rail', hasRail);
    this.#syncNavigationWidth();
  };

  /**
   * Compute the navigation pane's effective grid-track width and write
   * it to the parent scaffold's `--u-pane-navigation-width`. The matrix:
   *
   *   drawer only, lg+, not toggled  → 360dp (drawer width)
   *   drawer only, toggled            → 0    (slid off; no rail underneath)
   *   drawer only, sub-lg             → 0    (overlay via collapse-mode)
   *   rail only, ≥md, not toggled     → 96dp (rail collapsed)
   *   rail only, ≥md, toggled         → 360dp (rail expanded panel)
   *   rail only, sub-md               → 0    (overlay)
   *   drawer + rail, lg+, not toggled → 360dp (drawer wraps rail)
   *   drawer + rail, lg+, toggled     → 96dp (drawer slides off, rail visible)
   *   no drawer, no rail (custom)     → don't write (respect consumer's
   *                                     `--u-pane-navigation-width`)
   */
  #syncNavigationWidth(): void {
    if (this.position !== 'navigation') {
      this.#clearNavigationWidth();
      return;
    }

    const hasDrawer = this.classList.contains('has-drawer');
    const hasRail = this.classList.contains('has-rail');

    // Custom content (no drawer/rail) — `toggleDrawer` still works as a
    // generic "collapse the column to 0" switch so consumers can wire a
    // menu button to it without committing to a drawer/rail. When the
    // toggle is off, defer to the consumer-set `--u-pane-navigation-width`.
    // Custom-content pane (no drawer/rail). The consumer's
    // `--u-pane-navigation-width` is honored at all times; toggleDrawer
    // collapses the column via the scaffold's `.nav-collapsed` class
    // (CSS-driven so `transition: grid-template-columns` interpolates).
    if (!hasDrawer && !hasRail) {
      this.#clearNavigationWidth();
      const scaffold = this.parentElement as HTMLElement | null;
      scaffold?.classList.toggle('nav-collapsed', this.toggleDrawer);
      this.dispatchEvent(new Event('navigation-width-change', {
        bubbles: true,
        composed: true,
      }));
      return;
    }

    const lg = this.#navMql?.matches ?? false;
    const md = this.expanded; // expanded means ≥ collapseBreakpoint;
                              // when collapseBreakpoint=md this is the md+
                              // signal we need. With collapseBreakpoint=lg
                              // (default) md+ vs lg+ collapse together —
                              // we treat md as "at least the pane's own
                              // collapse breakpoint".

    let widthPx = 0;

    if (hasDrawer && hasRail) {
      if (lg) widthPx = this.toggleDrawer ? NAV_RAIL_WIDTH_PX : NAV_DRAWER_WIDTH_PX;
      else if (md) widthPx = NAV_RAIL_WIDTH_PX;
    } else if (hasDrawer) {
      if (lg && !this.toggleDrawer) widthPx = NAV_DRAWER_WIDTH_PX;
    } else if (hasRail) {
      if (lg) widthPx = this.toggleDrawer ? NAV_RAIL_EXPANDED_WIDTH_PX : NAV_RAIL_WIDTH_PX;
      else if (md) widthPx = NAV_RAIL_WIDTH_PX;
    }

    this.#writeNavigationWidth(`${widthPx}px`);
  }

  #writeNavigationWidth(next: string): void {
    if (next === this.#lastNavigationWidth) {
      return;
    }

    this.#lastNavigationWidth = next;
    const scaffold = this.parentElement as HTMLElement | null;
    scaffold?.style.setProperty('--_u-pane-navigation-resolved', next);
    // Mirror "navigation column resolved to 0" as a host attribute on
    // the scaffold so its SCSS can collapse the inter-column gap when
    // the nav slides off — when fixed, the gap is honored; when
    // collapsed, the next column sits flush against the outer padding.
    scaffold?.classList.toggle('nav-collapsed', next === '0px');
    this.dispatchEvent(new Event('navigation-width-change', {
      bubbles: true,
      composed: true,
    }));
  }

  #clearNavigationWidth(): void {
    if (this.#lastNavigationWidth === null) {
      return;
    }

    this.#lastNavigationWidth = null;
    const scaffold = this.parentElement as HTMLElement | null;
    scaffold?.style.removeProperty('--_u-pane-navigation-resolved');
    scaffold?.classList.remove('nav-collapsed');
    this.dispatchEvent(new Event('navigation-width-change', {
      bubbles: true,
      composed: true,
    }));
  }

  readonly #onScrimClick = (): void => {
    this.close();
  };

  readonly #onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.open) {
      this.close();
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'u-scaffold-pane': ScaffoldPane;
  }
}
