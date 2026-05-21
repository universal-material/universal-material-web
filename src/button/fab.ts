import { consume } from '@lit/context';

import { html, HTMLTemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { scrollContainerContext } from '../scaffold/scroll-container-context.js';
import { ButtonBase } from './button-base.js';
import { styles } from './fab.styles.js';

export type FabColor = 'primary' | 'secondary' | 'tertiary' | 'surface' | 'branded';
export type FabSize = 'small' | 'medium' | 'large';

@customElement('u-fab')
export class Fab extends ButtonBase {

  static override styles = [ButtonBase.styles, styles];

  /**
   * The FAB color variant to render.
   */
  @property() color: FabColor = 'primary';

  /**
   * The size of the FAB.
   */
  @property() size: FabSize = 'medium';

  /**
   * The text to display the FAB.
   */
  @property() label: string | null = null;

  /**
   * Lowers the FAB's elevation.
   */
  @property({ type: Boolean, reflect: true }) lowered = false;

  /**
   * The element the FAB will observe for scroll. Accepts an `HTMLElement`,
   * the id of an element, `'window'` to use the window scroll, or `'none'`
   * to disable. When unset, the FAB consumes the scroll container provided
   * by an ancestor `u-scaffold` via context, falling back to `'window'`.
   * Reserved for future scroll-driven behaviors (e.g. shrink on scroll).
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

  get extended(): boolean {
    return !!this.label;
  }

  protected override _getContainerClasses(): Record<string, boolean> {
    return {
      ...super._getContainerClasses(),
      [this.color]: true,
      [this.size]: true,
      lowered: this.lowered,
      extended: this.extended,
    };
  }

  protected override _renderContent(): HTMLTemplateResult {
    const labelTag = html`<span>${this.label}</span>`;

    return html`
      <span class="icon" aria-hidden="true"><slot></slot></span>
      ${this.label ? labelTag : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-fab': Fab;
  }
}
