import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './menu.styles.js';

import '../elevation/elevation.js';

interface MenuRect {
  x?: number;
  y?: number;
  width: number;
  height: number;
}

@customElement('u-menu')
export class UmMenu extends LitElement {

  static override styles = [baseStyles, styles];

  #open = false;
  #justShow = false;

  /**
   * Opens the menu and makes it visible. Alternative to the `.show()`, `.close()` and `.toggle()` methods
   */
  @property({type: Boolean, reflect: true})
  get open(): boolean { return this.#open }
  set open(open: boolean) {
    if (open) {
      this.calcDropdownPositioning();
    }

    this.#open = open;
  }

  /**
   * The corner of the anchor which to align the menu in the standard logical
   * property style of <block>-<inline> e.g. `'end-start'`.
   */
  @property({attribute: 'anchor-corner', reflect: true}) anchorCorner: 'start-start' | 'start-end' | 'end-start' | 'end-end' = 'end-start';

  /**
   * The direction of the menu. e.g. `'end'`.
   *
   * NOTE: This value may not be respected by the menu positioning algorithm
   * if the menu would render outside the viewport.
   */
  @property({reflect: true}) direction: 'start' | 'end' = 'end';

  /**
   * Limit the height of the menu to not overflow the viewport
   */
  @property({type: Boolean, attribute: 'auto-scroll-block', reflect: true}) autoScrollBlock = true;

  /**
   * Set a selector to auto attach to a toggle element
   */
  @property({attribute: 'toggle-selector', reflect: true})
  get toggleSelector(): string | undefined {
    return this.attributes.getNamedItem('toggle-selector')?.value;
  }
  set toggleSelector(selector: string) {
    this.toggleElement?.removeEventListener('click', this.toggle);

    if (!selector) {
      return;
    }

    this.toggleElement = document.querySelector(selector);
    this.toggleElement?.addEventListener('click', this.toggle);
  }

  @query('.menu') menu!: HTMLElement;

  get anchorElement(): HTMLElement {
    return this.parentElement!;
  }

  private toggleElement: HTMLElement | null = null;

  protected override render(): HTMLTemplateResult {
    return html`
      <div class="menu" part="menu">
        <u-elevation></u-elevation>
        <div class="content" part="content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('click', this.close);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('click', this.close);
  }

  toggle = () => {
    if (this.open) {
      this.close();
      return;
    }

    this.show();
  };

  show(): void {
    if (this.open) {
      return;
    }

    this.#justShow = true;
    this.open = true;
  }

  close = () => {
    if (this.open && !this.#justShow) {
      this.open = false;
      return;
    }

    this.#justShow = false;
  }

  private calcDropdownPositioning() {
    const anchorRect = this.getAnchorRect();
    const menuRect = this.getMenuRect()

    this.resetMenu();
    this.setToOpenUpOrDown(anchorRect, menuRect);
    this.setToOpenToStartOrEnd(anchorRect, menuRect);
  }

  private resetMenu() {
    this.menu.className = 'menu';
    this.menu.style.maxHeight = '';
  }

  private setToOpenUpOrDown(anchorRect: MenuRect, menuRect: MenuRect): void {
    const viewPortHeight = window.innerHeight;

    if (viewPortHeight - (anchorRect.y! + menuRect.height) >= 0) {
      return;
    }

    if (anchorRect.y! <= viewPortHeight / 2) {
      this.menu.style.maxHeight = this.autoScrollBlock
        ? `${viewPortHeight - anchorRect.y!}px`
        : '';
      return;
    }

    this.menu.classList.add('up');
    this.menu.style.maxHeight = this.autoScrollBlock
      ? `${anchorRect.y!}px`
      : '';
  }

  private setToOpenToStartOrEnd(anchorRect: MenuRect, menuRect: MenuRect): void {
    if (this.direction === 'start') {
      this.ensureMenuCanOpenToStart(anchorRect, menuRect);
      return;
    }

    this.ensureMenuCanOpenToEnd(anchorRect, menuRect);
  }

  private ensureMenuCanOpenToStart(anchorRect: MenuRect, menuRect: MenuRect): void {
    const viewPortWidth = window.innerWidth;

    if (viewPortWidth - (anchorRect.x! - menuRect.width) >= 0) {
      this.menu.classList.add('start');
    }
  }

  private ensureMenuCanOpenToEnd(anchorRect: MenuRect, menuRect: MenuRect): void {
    const viewPortWidth = window.innerWidth;

    if (viewPortWidth - (anchorRect.x! + menuRect.width) >= 0) {
      return;
    }

    this.menu.classList.add('start');
  }

  private getAnchorRect(): MenuRect {
    const anchorElement = this.anchorElement;
    const rect = anchorElement.getBoundingClientRect() as DOMRect
    const styles = getComputedStyle(anchorElement);
    const width = parseInt(styles.width, 10);
    const height = parseInt(styles.height, 10);
    const xOffset = this.anchorCorner.endsWith('-end')
      ? width
      : 0;

    const yOffset = this.anchorCorner.startsWith('end-')
      ? height
      : 0;

    return {
      y: rect.y + yOffset,
      x: rect.x + xOffset,
      width: width,
      height: height
    };
  }

  private getMenuRect(): MenuRect {
    const menu = this.menu;
    const styles = getComputedStyle(menu);
    const width = parseInt(styles.width, 10);
    const height = parseInt(styles.height, 10);

    return {
      width: width,
      height: height
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-menu': UmMenu;
  }
}
