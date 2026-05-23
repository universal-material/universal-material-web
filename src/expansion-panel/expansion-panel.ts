import { html, HTMLTemplateResult, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './expansion-panel.styles.js';

import '../ripple/ripple.js';
import '../collapse/collapse.js';

/**
 * @slot header - Content shown in the clickable header row.
 * @slot - Default slot for the panel body (animated via `u-collapse`).
 * @csspart header - The header row container.
 * @csspart chevron - The default chevron icon (rotates on expand).
 * @csspart content - The collapsible body wrapper.
 * @fires change - Dispatched when the `expanded` state toggles.
 */
@customElement('u-expansion-panel')
export class ExpansionPanel extends LitElement {
  static override styles = [baseStyles, styles];

  #expanded = false;

  /**
   * Whether the panel body is expanded.
   */
  @property({ type: Boolean, reflect: true })
  get expanded(): boolean {
    return this.#expanded;
  }

  set expanded(value: boolean) {
    const old = this.#expanded;
    this.#expanded = value;
    this.requestUpdate('expanded', old);
    if (old !== value) {
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }
  }

  /**
   * Disables toggling the panel via header click.
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Hides the default chevron toggle icon.
   */
  @property({ type: Boolean, reflect: true, attribute: 'hide-toggle' }) hideToggle = false;

  /** Toggles `expanded`. No-op when `disabled`. */
  toggle(): void {
    if (this.disabled) return;
    this.expanded = !this.expanded;
  }

  override render(): HTMLTemplateResult {
    return html`
      <div class="header" part="header" @click=${this.#handleHeaderClick}>
        <div class="header-content">
          <slot name="header"></slot>
        </div>
        ${this.hideToggle ? nothing : html`
          <span class="chevron" part="chevron" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
              <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
            </svg>
          </span>
        `}
        <u-ripple ?disabled=${this.disabled}></u-ripple>
      </div>
      <u-collapse class="body" part="content" ?open=${this.expanded}>
        <slot></slot>
      </u-collapse>
    `;
  }

  #handleHeaderClick = () => {
    this.toggle();
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'u-expansion-panel': ExpansionPanel;
  }
}
