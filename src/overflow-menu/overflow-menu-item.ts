import { css, html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';

import { type OverflowMenu } from './overflow-menu.js';

@customElement('u-overflow-menu-item')
export class OverflowMenuItem extends LitElement {
  static override styles = css`
    :host([collapse=always]) {
      display: none;
    }
  `;

  #label = '';
  readonly #mutationObserver = new MutationObserver(() => this.#parent?._renderMenuItems());

  get #parent(): OverflowMenu | null {
    return this.parentElement as OverflowMenu | null;
  }

  /**
   * The accessible label for the action, used as the icon button's title
   */
  @property()
  get label() {
    return this.#label;
  }

  set label(label) {
    this.#label = label;
    this.#parent?._renderMenuItems();
  }

  /**
   * Controls how the item behaves when space is limited.
   * `'auto'` allows the item to be moved into the overflow menu;
   * `'always'` keeps it permanently hidden behind the overflow trigger.
   */
  @property({ reflect: true }) collapse: 'auto' | 'always' = 'auto';

  @queryAssignedElements() icons!: HTMLElement[];

  override connectedCallback() {
    super.connectedCallback();

    this.#mutationObserver.observe(this, {
      subtree: true,
      characterData: true,
      childList: true,
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#mutationObserver.disconnect();
  }

  protected override render(): HTMLTemplateResult {
    return html`
      <u-icon-button title="${this.label}">
        <slot></slot>
      </u-icon-button>
    `;
  }
}
