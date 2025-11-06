import { html, HTMLTemplateResult, LitElement, render } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { map } from 'lit/directives/map.js';
import { when } from 'lit/directives/when.js';

import { UmMenu } from '../menu/menu.js';
import { OverflowMenuItem } from './overflow-menu-item.js';
import { styles } from './overflow-menu.styles.js';

@customElement('u-overflow-menu')
export class OverflowMenu extends LitElement {
  static override styles = styles;
  readonly #resizeObserver: ResizeObserver = new ResizeObserver(() => this.#invalidate());
  #items: OverflowMenuItem[] = [];

  readonly #collapsedItems: OverflowMenuItem[] = [];

  @state() _showMenu = false;

  @query('u-menu') menu?: UmMenu;

  #anchor: HTMLElement | null = null;
  @property()
  set anchor(value) {
    this.#anchor = value;

    this.#invalidate();
    this.#resizeObserver.disconnect();
    this.#resizeObserver.observe(this.anchor!);
  }

  get anchor(): HTMLElement | null {
    return this.#anchor ?? this;
  }

  readonly #menuItemsContainer = document.createElement('div');

  #updateMenusTimeout = 0;

  constructor() {
    super();

    this.#menuItemsContainer.slot = 'menu-items';
    setTimeout(() => this.appendChild(this.#menuItemsContainer));
  }

  override connectedCallback() {
    super.connectedCallback();

    this.anchor = this.anchor;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#resizeObserver.disconnect();
  }

  #invalidate(): void {

    this.#updateMenuToggleVisibility();
    this.#updateMenuItems();
  }

  #updateMenuToggleVisibility(): void {

    let collapsedCount = 0;

    for (const item of this.#items) {

      if (item.offsetTop === this.offsetTop) {
        break;
      }

      collapsedCount++;
    }

    const firstItem = this.#items[0];
    const showMenu = !!firstItem && this._showMenu
      ? collapsedCount > 1
      : collapsedCount > 0;

    if (this._showMenu !== showMenu) {
      this._showMenu = showMenu;
    }
  }

  #updateMenuItems(): void {

    if (!this._showMenu) {
      this.#collapsedItems.length = 0;
      return;
    }

    clearTimeout(this.#updateMenusTimeout);

    this.#updateMenusTimeout = setTimeout(() => {
      const previousCollapsedLength = this.#collapsedItems.length;
      this.#collapsedItems.length = 0;

      for (const item of this.#items) {

        if (item.offsetTop === this.offsetTop) {
          break;
        }

        this.#collapsedItems.push(item);
      }

      if (previousCollapsedLength !== this.#collapsedItems.length) {
        this.requestUpdate();
      }
    }, 100);
  }

  #handleSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this.#items = slot
      .assignedElements()
      .filter(el => el.tagName === 'U-OVERFLOW-MENU-ITEM')
      .reverse() as OverflowMenuItem[];

    this.#invalidate();
  }

  protected override render(): HTMLTemplateResult {
    this.#renderMenuItems();

    const classes = { 'show-menu': this._showMenu };

    return html`
      <div class="container ${classMap(classes)}">
        <div class="items-set">
          <div class="empty-space"></div>
          <slot @slotchange="${this.#handleSlotChange}"></slot>
        </div>
        ${when(this._showMenu, () => html`
          <div class="inner-menu">
            <u-icon-button @click=${{ handleEvent: () => this.menu?.toggle() }}>
              <slot name="icon">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em"
                     fill="currentColor">
                  <path
                    d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 
                      33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 
                      33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/>
                </svg>
              </slot>
            </u-icon-button>
            <u-menu anchor-corner="end-end">
              <slot name="menu-items"></slot>
            </u-menu>
          </div>
        `)}
      </div>
    `;
  }

  #renderMenuItems() {
    console.log(this.#collapsedItems);
    const menuItems = html`
      ${map(
        this.#collapsedItems,
        item => {
          const nodes = item.childNodes.values();

          return html`
            <u-menu-item @click=${{ handleEvent: () => item.click() }}>
              <div slot="leading-icon">
                ${map(nodes, node => node.cloneNode(true))}
              </div>
              
              ${item.label}
            </u-menu-item>
          `;
        })}`;

    render(menuItems, this.#menuItemsContainer);
  }
}
