import { html, HTMLTemplateResult, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './pane.styles.js';

export type PaneMode = 'fixed' | 'collapsible' | 'sidebar' | 'fullscreen';
export type PaneVariant = 'transparent' | 'filled';
export type PaneQueryContext = 'media' | 'container';
export type PaneAnimation = 'none' | 'exit' | 'exit-start' | 'exit-end' | 'fade';

const MODAL_MODES: ReadonlySet<PaneMode> = new Set<PaneMode>(['sidebar', 'fullscreen']);

/**
 * A region declared as a light-DOM child of `u-scaffold`. The pane is a
 * flex item in the scaffold's body row; its behaviour is driven by `mode`:
 *
 * - `fixed` (default): always visible as a flex item. `open` is ignored.
 * - `collapsible`: a flex item while `open=true`; removed from the flow
 *   when `open=false` (animated via `transition-behavior: allow-discrete`).
 * - `sidebar`: a modal drawer overlay anchored to the scaffold. Slides in
 *   from the leading or trailing edge (the scaffold tags each pane with
 *   `data-align="start|end"` based on its DOM position relative to the
 *   body content) and shows a scrim. Closed by default.
 * - `fullscreen`: same overlay semantics as `sidebar` but full-width,
 *   sits above the top app bar, no scrim. Closed by default.
 *
 * Modes can vary per Material 3 breakpoint via the `mode-sm`, `mode-md`,
 * `mode-lg` and `mode-xl` attributes — the larger breakpoint wins via
 * source order in the stylesheet. The `query-context` attribute switches
 * the breakpoint source between the viewport (`media`, default) and the
 * scaffold's container (`container`). All breakpoint handling is CSS —
 * the pane does not subscribe to any `matchMedia`/`ResizeObserver`.
 *
 * The `open` property defaults to `true` for `fixed` / `collapsible`
 * panes and `false` for `sidebar` / `fullscreen` panes. The default is
 * recomputed whenever `mode` changes — until the consumer writes to
 * `open` explicitly, the default tracks the active `mode`.
 *
 * @slot header - Title row / actions. Sticks to the top of the pane.
 * @slot - The pane content. Scrolls if it overflows.
 *
 * @csspart container - The visual surface.
 * @csspart header
 * @csspart content
 * @csspart scrim - The modal scrim (sidebar mode only).
 *
 * @fires open - When the pane opens. Bubbles, composed.
 * @fires close - When the pane closes. Bubbles, composed.
 */
@customElement('u-pane')
export class Pane extends LitElement {
  static override styles = [baseStyles, styles];

  /**
   * Background treatment. `filled` gives the pane its own card chrome
   * (`surface-container-low` + `--u-pane-filled-shape-corner`, default
   * `medium` / 12dp). `transparent` blends with the scaffold background.
   * Override the surface tone via `--u-pane-filled-bg-color`.
   */
  @property({ type: String, reflect: true })
  variant: PaneVariant = 'transparent';

  /**
   * Behaviour at the base (no-breakpoint-qualifier) level. `fixed` keeps
   * the pane in the scaffold flex row at all times; `collapsible` makes
   * it disappear from the row when `open=false`; `sidebar` and
   * `fullscreen` render the pane as a modal overlay against the
   * scaffold when `open=true`.
   */
  @property({ type: String, reflect: true })
  mode: PaneMode = 'fixed';

  /**
   * Mode override applied from the `sm` breakpoint (≥ 600px) upward.
   * Falls back to `mode` when unset. Resolved purely in CSS.
   */
  @property({ type: String, reflect: true, attribute: 'mode-sm' })
  modeSm?: PaneMode;

  /** Mode override applied from `md` (≥ 840px) upward. */
  @property({ type: String, reflect: true, attribute: 'mode-md' })
  modeMd?: PaneMode;

  /** Mode override applied from `lg` (≥ 1200px) upward. */
  @property({ type: String, reflect: true, attribute: 'mode-lg' })
  modeLg?: PaneMode;

  /** Mode override applied from `xl` (≥ 1600px) upward. */
  @property({ type: String, reflect: true, attribute: 'mode-xl' })
  modeXl?: PaneMode;

  /**
   * Whether the breakpoint overrides query the viewport (`media`,
   * default) or the nearest container with `container-type` set
   * (`container`). Switching to `container` lets the pane react to its
   * scaffold's own size when the scaffold lives in a constrained layout
   * — see `u-scaffold` which sets `container-type: inline-size`.
   */
  @property({ type: String, reflect: true, attribute: 'query-context' })
  queryContext: PaneQueryContext = 'media';

  /**
   * How the pane animates in/out when `open` toggles (modal modes) or
   * when it enters/leaves the flex flow (`collapsible`). `none` disables
   * the transition entirely; `exit` (default) slides the modal off-screen
   * and infers the direction from the scaffold-assigned `data-align`
   * (`start` → leading edge, `end` → trailing edge); `exit-start` and
   * `exit-end` force a side regardless of `data-align`; `fade` swaps
   * the slide for an opacity transition (modal stays in place and fades
   * through).
   */
  @property({ type: String, reflect: true })
  animation: PaneAnimation = 'exit';

  /**
   * Animation override applied from the `sm` breakpoint (≥ 600px) upward.
   * Falls back to `animation` when unset. Resolved purely in CSS.
   */
  @property({ type: String, reflect: true, attribute: 'animation-sm' })
  animationSm?: PaneAnimation;

  /** Animation override applied from `md` (≥ 840px) upward. */
  @property({ type: String, reflect: true, attribute: 'animation-md' })
  animationMd?: PaneAnimation;

  /** Animation override applied from `lg` (≥ 1200px) upward. */
  @property({ type: String, reflect: true, attribute: 'animation-lg' })
  animationLg?: PaneAnimation;

  /** Animation override applied from `xl` (≥ 1600px) upward. */
  @property({ type: String, reflect: true, attribute: 'animation-xl' })
  animationXl?: PaneAnimation;

  /**
   * Programmatic open state. Default is computed from `mode`:
   * `true` for `fixed` / `collapsible`, `false` for `sidebar` /
   * `fullscreen`. Once the consumer sets this explicitly (attribute,
   * property or `show()` / `close()`), the explicit value sticks.
   *
   * In `fixed` mode the pane is visible regardless of `open`.
   */
  @property({ type: Boolean })
  get open(): boolean {
    return this.#explicitOpen ?? !MODAL_MODES.has(this.mode);
  }

  set open(value: boolean) {
    const wasOpen = this.open;
    this.#explicitOpen = value;

    if (wasOpen !== value) {
      this.requestUpdate('open', wasOpen);
      this.dispatchEvent(new Event(value ? 'open' : 'close', {
        bubbles: true,
        composed: true,
      }));
    }
  }

  #explicitOpen: boolean | null = null;
  #lastReflectedOpen: boolean | null = null;
  #keydownAttached = false;

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

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.#keydownAttached) {
      document.removeEventListener('keydown', this.#onKeydown);
      this.#keydownAttached = false;
    }
  }

  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed);

    // Manual attribute reflection for `open`: since the default is
    // derived from `mode`, we can't use `reflect: true` directly (Lit
    // would never see "open" change on a pure mode flip). Toggle the
    // attribute ourselves whenever the effective value drifts.
    const isOpen = this.open;
    if (this.#lastReflectedOpen !== isOpen) {
      this.toggleAttribute('open', isOpen);
      this.#lastReflectedOpen = isOpen;
    }

    // Escape key closes any modal-mode pane while open. We attach the
    // listener lazily so non-modal panes never touch `document`.
    const wantsKeydown = isOpen && MODAL_MODES.has(this.mode);
    if (wantsKeydown && !this.#keydownAttached) {
      document.addEventListener('keydown', this.#onKeydown);
      this.#keydownAttached = true;
    } else if (!wantsKeydown && this.#keydownAttached) {
      document.removeEventListener('keydown', this.#onKeydown);
      this.#keydownAttached = false;
    }
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

  readonly #onScrimClick = (): void => {
    this.close();
  };

  readonly #onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.open && MODAL_MODES.has(this.mode)) {
      this.close();
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'u-pane': Pane;
  }
}
