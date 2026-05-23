import { PropertyValues } from '@lit/reactive-element';
import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './collapse.styles.js';

/**
 * @slot - Default slot for the collapsible content.
 * @csspart content - The wrapper around the slotted content used to measure its natural height.
 */
@customElement('u-collapse')
export class Collapse extends LitElement {
  static override styles = [baseStyles, styles];

  /**
   * Whether the collapse is open. Animates `max-height` between `0` and the
   * measured content height when toggled.
   */
  @property({ type: Boolean, reflect: true }) open = false;

  @query('.content') private readonly _content!: HTMLElement;

  #resizeObserver: ResizeObserver | null = null;

  override render(): HTMLTemplateResult {
    return html`<div class="content" part="content"><slot @slotchange=${this.#applyMaxHeight}></slot></div>`;
  }

  override firstUpdated() {
    this.#applyMaxHeight();
    // Enable the CSS transition only after the initial paint, so the closed→0
    // transition doesn't fire on mount.
    requestAnimationFrame(() => {
      this.style.transition = 'max-height var(--u-collapse-transition-duration, 200ms) var(--u-collapse-transition-timing, ease-out)';
    });
    this.#resizeObserver = new ResizeObserver(() => this.#applyMaxHeight());
    this.#resizeObserver.observe(this._content);
  }

  override updated(changed: PropertyValues) {
    if (changed.has('open')) {
      this.#applyMaxHeight();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;
  }

  #applyMaxHeight = () => {
    if (!this._content) return;
    this.style.maxHeight = this.open ? `${this._content.scrollHeight}px` : '0';
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'u-collapse': Collapse;
  }
}
