import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './scaffold-pane.styles.js';

export type ScaffoldPanePosition = 'start' | 'end';
export type ScaffoldPaneVariant = 'transparent' | 'filled';
export type ScaffoldPaneCollapseMode = 'sidebar' | 'fullscreen';

/**
 * A side region declared as a light-DOM child of `u-scaffold`. The parent
 * scaffold routes the pane into its `start-pane` or `end-pane` slot based
 * on the `position` attribute, and reserves a grid column for it at
 * `lg` and above. Below `lg`, the pane hides and is shown as an overlay
 * when `open` becomes `true` — either as a slide-in modal with a scrim
 * (`collapse-mode="sidebar"`) or as a full-viewport takeover
 * (`collapse-mode="fullscreen"`).
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
 */
@customElement('u-scaffold-pane')
export class ScaffoldPane extends LitElement {
  static override styles = [baseStyles, styles];

  /** Which side of the scaffold this pane occupies. */
  @property({ type: String, reflect: true })
  position: ScaffoldPanePosition = 'start';

  /**
   * Background treatment. `filled` reuses the card filled tokens
   * (surface-container-highest + medium corner). `transparent` blends
   * with the scaffold background.
   */
  @property({ type: String, reflect: true })
  variant: ScaffoldPaneVariant = 'transparent';

  /**
   * How the pane behaves below the `lg` breakpoint when `open` becomes
   * true. `sidebar` slides in from the leading/trailing edge with a
   * scrim; `fullscreen` covers the entire viewport.
   */
  @property({ type: String, reflect: true, attribute: 'collapse-mode' })
  collapseMode: ScaffoldPaneCollapseMode = 'sidebar';

  #open = false;

  /**
   * Programmatic open state. Only visible on mobile (`< lg`) — at desktop
   * sizes the pane is always rendered in its grid column.
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
    document.removeEventListener('keydown', this.#onKeydown);
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
