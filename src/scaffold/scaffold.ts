import { html, HTMLTemplateResult, LitElement, PropertyValues } from 'lit';
import { customElement, query } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './scaffold.styles.js';

/**
 * Layout container that hosts the top app bar, navigation bar, a
 * flex-row body that accepts plain content and any number of
 * `u-pane` children, and a floating FAB. Panes auto-arrange via
 * `display: flex` + `gap` on the body row; their behaviour (fixed,
 * collapsible, sidebar, fullscreen) is owned by `u-pane` itself.
 *
 * The scaffold has one piece of pane-aware bookkeeping: it watches the
 * children and writes `data-align="start|end"` on each `u-pane`
 * depending on whether the pane appears before (`start`) or after
 * (`end`) the first non-pane child in the light DOM. The pane reads
 * that attribute to pick the slide direction in `sidebar` / `fullscreen`
 * modes. When there is no non-pane content, every pane defaults to
 * `start`.
 *
 * The scaffold establishes a `container-type: inline-size` named
 * container (`u-scaffold`) so panes with `query-context="container"`
 * can react to the scaffold's own size rather than the viewport.
 *
 * @slot top-bar - the top app bar.
 * @slot - panes (`u-pane`) and the page content as siblings. Non-pane
 *   children act as the body and flex to fill the remaining space.
 * @slot bottom-bar - the navigation bar (or any bottom-anchored bar).
 * @slot fab - floating action button area, anchored above the bottom bar.
 *
 * @csspart top-bar
 * @csspart bottom-bar
 * @csspart fab
 * @csspart body-row
 */
@customElement('u-scaffold')
export class Scaffold extends LitElement {
  static override styles = [baseStyles, styles];

  @query('.bottom-bar-row', true)
  private readonly _bottomBar!: HTMLElement;

  #bottomBarObserver: ResizeObserver | null = null;
  #paneChildObserver: MutationObserver | null = null;

  protected override render(): HTMLTemplateResult {
    return html`
      <div class="layout">
        <div class="top-bar-row" part="top-bar">
          <slot name="top-bar" @slotchange=${this.#autoSetAbsolutePosition}></slot>
        </div>
        <div class="body-row" part="body-row">
          <slot @slotchange=${this.#syncPaneAlignment}></slot>
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

  protected override firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);
    this.#measureBottomBar();

    if (typeof ResizeObserver !== 'undefined') {
      this.#bottomBarObserver = new ResizeObserver(() => this.#measureBottomBar());
      this.#bottomBarObserver.observe(this._bottomBar);
    }

    this.#syncPaneAlignment();
    this.#paneChildObserver = new MutationObserver(() => this.#syncPaneAlignment());
    this.#paneChildObserver.observe(this, {
      childList: true,
      subtree: false,
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#bottomBarObserver?.disconnect();
    this.#bottomBarObserver = null;
    this.#paneChildObserver?.disconnect();
    this.#paneChildObserver = null;
  }

  /**
   * Walk the light-DOM children once and stamp `data-align="start|end"`
   * on each `u-pane` based on its position in the body row.
   *
   * - If non-pane body content is present: panes appearing before it are
   *   `start`, panes appearing after are `end`.
   * - If there is no body content: the last pane is `end` (so a trailing
   *   detail pane animates from the correct side in modal modes), and
   *   every other pane is `start`. A single pane stays `start`.
   *
   * The pane's CSS uses `data-align` as the default slide direction for
   * `animation="exit"` (the default). Consumers can override per-pane
   * with `animation="exit-start"` / `animation="exit-end"`.
   */
  readonly #syncPaneAlignment = (): void => {
    const children = Array.from(this.children);
    let bodyIndex = -1;
    const paneIndices: number[] = [];

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const slot = child.getAttribute('slot');

      // Bars and FABs live in named slots — ignore them when locating
      // the body row contents.
      if (slot === 'top-bar' || slot === 'bottom-bar' || slot === 'fab') {
        continue;
      }

      if (child.tagName === 'U-PANE') {
        paneIndices.push(i);
      } else if (bodyIndex === -1) {
        bodyIndex = i;
      }
    }

    const hasBody = bodyIndex !== -1;
    const lastPaneIndex = paneIndices.length > 1
      ? paneIndices[paneIndices.length - 1]
      : -1;

    for (const i of paneIndices) {
      let align: 'start' | 'end';

      if (hasBody) {
        align = i > bodyIndex ? 'end' : 'start';
      } else {
        align = i === lastPaneIndex ? 'end' : 'start';
      }

      const child = children[i];
      if (child.getAttribute('data-align') !== align) {
        child.setAttribute('data-align', align);
      }
    }
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
