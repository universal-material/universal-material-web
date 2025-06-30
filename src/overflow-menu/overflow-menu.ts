import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { when } from 'lit/directives/when.js';

import { UmMenu } from '../menu/menu.js';
import { OverflowMenuItem } from './overflow-menu-item.js';
import { styles } from './overflow-menu.styles.js';

@customElement('u-overflow-menu')
export class OverflowMenu extends LitElement {
  static override styles = styles;
  #resizeObserver: ResizeObserver | null = null;
  #items: OverflowMenuItem[] = [];

  readonly #collapsedItems: OverflowMenuItem[] = [];

  @state() _showMenu = false;

  @query('u-menu') menu?: UmMenu;

  #updateMenusTimeout = 0;

  override connectedCallback() {
    super.connectedCallback();

    this.#resizeObserver = new ResizeObserver(() => this.#updateMenus());
    this.#resizeObserver.observe(this);
    this.#updateMenus();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    this.#resizeObserver!.disconnect();
    this.#resizeObserver = null;
  }

  #updateMenus(): void {

    clearTimeout(this.#updateMenusTimeout);

    this.#updateMenusTimeout = setTimeout(() => {
      let firstWrapperMenu = true;

      const previousCollapsedLength = this.#collapsedItems.length;
      this.#collapsedItems.length = 0;

      for (const item of this.#items) {

        if (item.offsetTop === this.offsetTop) {
          continue;
        }

        if (firstWrapperMenu && !this._showMenu) {
          this.#collapsedItems.push(item.previousSibling as OverflowMenuItem);
        }

        this.#collapsedItems.push(item);
        firstWrapperMenu = false;
      }

      this._showMenu = this.#collapsedItems.length > 1;

      if (previousCollapsedLength !== this.#collapsedItems.length) {
        this.requestUpdate();
      }
    }, 100);
  }

  #handleSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this.#items = slot.assignedElements() as OverflowMenuItem[];
    this.#updateMenus();
  }

  protected override render(): HTMLTemplateResult {
    return html`
      
      <u-button-set>
        <u-button-set class="items-set">
          <slot @slotchange="${this.#handleSlotChange}"></slot>
        </u-button-set>
          ${when(this._showMenu, () => html`
            <div class="inner-menu">
              <u-icon-button @click=${{ handleEvent: () => this.menu?.toggle() }}>
                <slot name="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
                    <path
                      d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/>
                  </svg>
                </slot>
              </u-icon-button>
              <u-menu anchor-corner="end-end">
                ${map(this.#collapsedItems, item => html`
                  <u-menu-item @click=${{ handleEvent: () => item.click() }}>${item.label}</u-menu-item>
                `)}
              </u-menu>
            </div>
          `)}
      </u-button-set>
    `;
  }
}
