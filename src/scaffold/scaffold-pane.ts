import { html, HTMLTemplateResult, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './scaffold-pane.styles.js';

export type ScaffoldPanePosition = 'start' | 'center' | 'end';
export type ScaffoldPaneVariant = 'transparent' | 'filled' | 'filled-low' | 'filled-lowest';
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

/**
 * A side region declared as a light-DOM child of `u-scaffold`. The parent
 * scaffold routes the pane into its `start-pane` or `end-pane` slot based
 * on the `position` attribute, and reserves a grid column for it whenever
 * the pane reports itself as expanded. When the viewport drops below the
 * pane's `collapse-breakpoint`, the pane leaves the flow and renders as
 * an overlay anchored to the scaffold — either a slide-in modal with a
 * scrim (`collapse-mode="sidebar"`) or a full-scaffold takeover
 * (`collapse-mode="fullscreen"`) covering the top app bar.
 *
 * Common list-detail recipe:
 * - start pane as `collapse-mode="sidebar" collapse-breakpoint="lg"`,
 * - end pane as `collapse-mode="fullscreen" collapse-breakpoint="md"`,
 *
 * so at ≥1200px both panes flank the main column, between 840–1199px the
 * list (end pane) stays side-by-side with main and only the navigation
 * collapses, and below 840px the detail takes over the whole scaffold.
 *
 * @slot header - Title row / actions. Sticks to the top of the pane.
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
   * Where in the scaffold this pane is placed. `start` and `end` are the
   * lateral panes; `center` replaces the default content slot with a
   * carded middle column, sharing the same variant/width API. A `center`
   * pane is always expanded (collapse-mode and collapse-breakpoint are
   * ignored — the central column never overlays itself).
   */
  @property({ type: String, reflect: true })
  position: ScaffoldPanePosition = 'start';

  /**
   * Background treatment. `filled` uses surface-container-highest;
   * `filled-low` uses surface-container-low; `filled-lowest` uses
   * surface-container-lowest. All three filled variants share the
   * `--u-scaffold-pane-filled-shape-corner` (default `medium` / 12dp).
   * `transparent` blends with the scaffold background.
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

  /**
   * Override for this pane's grid-column width when expanded. Accepts a
   * bare number (treated as pixels) or any CSS length / `minmax()` /
   * `min()` expression. When unset, the scaffold falls back to its host
   * vars `--u-scaffold-start-pane-width` / `--u-scaffold-end-pane-width`
   * (defaults to 360px). Setting `style="--u-scaffold-pane-width: 432px"`
   * directly on the pane is equivalent.
   */
  @property({ type: String, reflect: true })
  width?: string;

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

  #mql: MediaQueryList | null = null;

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
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.#onKeydown);
    this.#unbindMediaQuery();
  }

  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed);

    if (changed.has('collapseBreakpoint') || changed.has('position')) {
      this.#bindMediaQuery();
    }

    if (changed.has('width')) {
      this.dispatchEvent(new Event('width-change', {
        bubbles: true,
        composed: true,
      }));
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
