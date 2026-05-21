import { consume } from '@lit/context';
import { PropertyValues } from '@lit/reactive-element';

import { html, HTMLTemplateResult, LitElement, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { scrollContainerContext } from '../scaffold/scroll-container-context.js';
import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './navigation-bar.styles.js';

/**
 * Material 3 navigation bar — a persistent bar pinned to the bottom of the
 * application that hosts top-level destinations (typically 3–5 icon buttons
 * or navigation-bar items). Mirrors `u-top-app-bar`'s positioning model: an
 * internal `.spacing` filler reserves the bar's height inside the surrounding
 * flow so content under it does not get obscured.
 *
 * Slots:
 *  - default: destination items (e.g. `u-icon-button`s).
 */
@customElement('u-navigation-bar')
export class UmNavigationBar extends LitElement {
  static override styles = [baseStyles, styles];

  /**
   * The positioning strategy of the navigation bar.
   */
  @property({ reflect: true })
  position: 'fixed' | 'absolute' | 'static' = 'fixed';

  /**
   * The element the bar will observe for scroll. Accepts an `HTMLElement`,
   * the id of an element, `'window'` to use the window scroll, or `'none'`
   * to disable. When unset, the bar consumes the scroll container provided
   * by an ancestor `u-scaffold` via context, falling back to `'window'`.
   * Reserved for future scroll-driven behaviors (e.g. hide on scroll).
   */
  @property({ attribute: 'scroll-container' })
  scrollContainer: 'none' | 'window' | string | HTMLElement | undefined = undefined;

  @consume({ context: scrollContainerContext, subscribe: true })
  @state()
  protected readonly _scrollContainerFromContext!: HTMLElement | undefined;

  @query('.container', true) private readonly _container!: HTMLElement;

  private containerSizeObserver: ResizeObserver | null = null;

  override render(): HTMLTemplateResult {
    const containerClasses = classMap({
      [this.position]: true,
    });

    const appBarSpacing = this.position !== 'static'
      ? html`<div class="spacing"></div>`
      : nothing;

    return html`
      ${appBarSpacing}
      <div class="container ${containerClasses}" part="container">
        <div class="content" part="content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  override firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);
    this.containerSizeObserver = new ResizeObserver(() => this.#setContentHeightProperty());
    this.containerSizeObserver.observe(this._container);
    this.#setContentHeightProperty();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.containerSizeObserver?.disconnect();
    this.containerSizeObserver = null;
  }

  #setContentHeightProperty(): void {
    this.style.setProperty('--_content-height', `${this._container.clientHeight}px`);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-navigation-bar': UmNavigationBar;
  }
}
