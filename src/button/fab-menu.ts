import { consume, provide } from '@lit/context';

import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { scrollContainerContext } from '../scaffold/scroll-container-context.js';
import { fabMenuColorContext } from './fab-menu-color-context.js';
import { FabMenuItem } from './fab-menu-item.js';
import { fabMenuOpenContext } from './fab-menu-open-context.js';
import { styles } from './fab-menu.styles.js';
import { FabColor, FabSize } from './fab.js';

@customElement('u-fab-menu')
export class FabMenu extends LitElement {

  static override styles = [styles];

  /**
   * The FAB color variant to render.
   */
  @provide({ context: fabMenuColorContext })
  @property()
  color: FabColor = 'primary';

  /**
   * The size of the FAB.
   */
  @property() size: FabSize = 'medium';

  /**
   * Lowers the FAB's elevation.
   */
  @property({ type: Boolean, reflect: true }) lowered = false;

  @provide({ context: fabMenuOpenContext })
  @state()
  open = false;

  /**
   * The element the FAB menu will observe for scroll. Accepts an
   * `HTMLElement`, the id of an element, `'window'` to use the window
   * scroll, or `'none'` to disable. When unset, the FAB menu consumes the
   * scroll container provided by an ancestor `u-scaffold` via context,
   * falling back to `'window'`. Reserved for future scroll-driven behaviors.
   */
  @property({ attribute: 'scroll-container' })
  scrollContainer: 'none' | 'window' | string | HTMLElement | undefined = undefined;

  @consume({ context: scrollContainerContext, subscribe: true })
  @state()
  protected readonly _scrollContainerFromContext!: HTMLElement | undefined;

  /**
   * The resolved scroll target according to the precedence
   * explicit > context > window. Returns `null` when the explicit value
   * is `'none'`.
   */
  protected get _effectiveScrollContainer(): HTMLElement | Window | null {
    const explicit = this.scrollContainer;

    if (explicit === 'none') {
      return null;
    }

    if (explicit instanceof HTMLElement) {
      return explicit;
    }

    if (typeof explicit === 'string' && explicit.length > 0) {
      if (explicit === 'window') {
        return window;
      }

      return document.getElementById(explicit);
    }

    return this._scrollContainerFromContext ?? window;
  }

  protected override render(): HTMLTemplateResult {
    const containerClasses = classMap({
      open: this.open,
      [this.color]: true,
    });

    return html`
      <div class="container ${containerClasses}">
        <div class="menu-items">
          <slot @slotchange=${this.#handleIconItemsSlotChange}></slot>
        </div>
        <u-fab class="toggle-container" .size=${this.size}>
          <u-fab 
            class="toggle"
            .color=${this.color}
            .lowered=${this.lowered}
            .size=${this.open ? 'medium' : this.size}
            @click=${this.#toggle}>
            <span class="icon-container" aria-hidden="true">
              <span class="icon icon-default">
                <slot name="icon"></slot>
              </span>
              <span class="icon icon-close">
                <slot name="close-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
                    <path
                      d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                  </svg>
                </slot>
              </span>
            </span>
          </u-fab>
        </u-fab>
      </div>
    `;
  }

  #toggle(): void {
    this.open = !this.open;
  }

  #handleIconItemsSlotChange(event: Event) {
    const elements = (event.target as HTMLSlotElement).assignedElements({ flatten: true });

    let index = 0;

    for (const element of elements.filter(e => e instanceof FabMenuItem).reverse()) {
      element._index = index;
      index++;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-fab-menu': FabMenu;
  }
}
