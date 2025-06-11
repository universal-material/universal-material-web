import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './menu.styles.js';

import '../elevation/elevation.js';

interface AnchorCornerBlockSide {
  top: number;
  bottom: number;
  relativeY: number;
}

interface AnchorCornerInlineSide {
  left: number;
  right: number;
  relativeX: number;
}

interface AnchorBounds {
  top: AnchorCornerBlockSide;
  bottom: AnchorCornerBlockSide;
  start: AnchorCornerInlineSide;
  end: AnchorCornerInlineSide;
  width: number;
  height: number;
}

interface MenuPosition {
  bounds: AnchorBounds;
  isRtl: boolean;
}

interface MenuSize {
  width: number;
  height: number;
}

@customElement('u-menu')
export class UmMenu extends LitElement {
  static override styles = [baseStyles, styles];

  #open = false;
  #preInitOpen = false;

  /**
   * Opens the menu and makes it visible. Alternative to the `.show()`, `.close()` and `.toggle()` methods
   */
  @property({ type: Boolean, reflect: true })
  get open(): boolean {
    return this.#open;
  }

  set open(open: boolean) {
    if (!this.menu) {
      this.#preInitOpen = open;
      return;
    }

    if (this.open === open) {
      return;
    }

    this.menu.removeEventListener('transitionend', this.#onClosed, true);
    this.menu.removeEventListener('transitionend', this.#onOpened, true);

    if (!open) {
      const closePrevented = !this.dispatchEvent(new Event('close', { cancelable: true }));

      if (closePrevented) {
        return;
      }

      this.#open = open;

      this.#hide();

      return;
    }

    const openPrevented = !this.dispatchEvent(new Event('open', { cancelable: true }));

    if (openPrevented) {
      return;
    }

    this.#open = open;

    this.#show();
  }

  #show() {
    this.menu.style.display = '';
    this.calcDropdownPositioning();

    this.menu.addEventListener('transitionend', this.#onOpened, {
      capture: true,
      once: true,
    });

    setTimeout(() => document.addEventListener('click', this.close));

    if (this.manualFocus) {
      return;
    }

    setTimeout(() => this.querySelector<HTMLElement>('u-menu-item:not([disabled])')?.focus());
  }

  #hide() {
    document.removeEventListener('click', this.close);

    this.menu.addEventListener('transitionend', this.#onClosed, {
      capture: true,
      once: true,
    });
  }

  @property({ reflect: true }) positioning: 'relative' | 'fixed' = 'relative';

  @property({ type: Boolean }) manualFocus = false;

  /**
   * The corner of the anchor which to align the menu in the standard logical
   * property style of <block>-<inline> e.g. `'end-start'`.
   */
  @property({ attribute: 'anchor-corner', reflect: true })
  anchorCorner: 'auto-start' | 'auto-end' | 'start-start' | 'start-end' | 'end-start' | 'end-end' = 'end-start';

  /**
   * The direction of the menu. e.g. `'down-end'`.
   *
   * NOTE: This value may not be respected by the menu positioning algorithm
   * if the menu would render outside the viewport.
   */
  @property({ reflect: true }) direction: 'up-start' | 'up-end' | 'down-start' | 'down-end' = 'down-end';

  /**
   * Don't limit the height of the menu
   */
  @property({ type: Boolean, attribute: 'allow-overflow', reflect: true }) allowOverflow = false;

  @query('.menu') menu!: HTMLElement;
  @query('.ref') ref!: HTMLElement;

  get scrollContainer(): HTMLElement {
    return this.menu;
  }

  readonly #onOpened = () => this.dispatchEvent(new Event('opened'));

  readonly #onClosed = () => {
    this.menu.style.display = 'none';
    this.dispatchEvent(new Event('closed'));
  };

  #anchorElement: HTMLElement | null | undefined;

  get anchorElement(): HTMLElement | null | undefined {
    return this.#anchorElement ?? this.parentElement! ?? (this.getRootNode() as ShadowRoot).host;
  }

  set anchorElement(anchorElement: HTMLElement | null | undefined) {
    this.#anchorElement = anchorElement;
  }

  protected override render(): HTMLTemplateResult {
    const menuClasses = { open: this.open };

    return html`
      <div class="ref"></div>
      <div class="menu ${classMap(menuClasses)}" part="menu" style="display: none" ?inert=${!this.open}>
        <u-elevation></u-elevation>
        <div role="menu" class="content" part="content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.role = 'listbox';

    this.#setInitOpen();
  }

  toggle = () => {
    if (this.open) {
      this.close();
      return;
    }

    this.show();
  };

  show(): void {
    this.open = true;
  }

  close = () => {
    this.open = false;
  };

  async #setInitOpen() {
    await this.updateComplete;

    if (this.#preInitOpen) {
      this.open = true;
    }
  }

  private calcDropdownPositioning() {
    if (!this.anchorElement) {
      return;
    }

    const menuPosition = this.getMenuPosition();
    const menuSize = this.getMenuSize();

    this.#resetMenu();
    this.#setToOpenUpOrDown(menuPosition, menuSize);
    this.#setToOpenToStartOrEnd(menuPosition, menuSize);
  }

  #resetMenu() {
    this.menu.className = 'menu';
    this.menu.style.top = '';
    this.menu.style.bottom = '';
    this.menu.style.left = '';
    this.menu.style.right = '';
    this.menu.style.maxHeight = '';
  }

  #setToOpenUpOrDown(menuPosition: MenuPosition, menuSize: MenuSize): void {
    if (this.anchorCorner.startsWith('auto-')) {
      this.#openBlockAuto(menuPosition, menuSize);
      return;
    }

    const side = this.anchorCorner.startsWith('start-') ? menuPosition.bounds.top : menuPosition.bounds.bottom;

    if (this.direction.startsWith('up-')) {
      this.#tryOpenUp(side, menuSize);
      return;
    }

    this.#tryOpenDown(side, menuSize);
  }

  #openBlockAuto(menuPosition: MenuPosition, menuSize: MenuSize): void {
    const topSide = menuPosition.bounds.top;
    const bottomSide = menuPosition.bounds.bottom;

    const viewPortHeight = window.innerHeight;

    if (bottomSide.bottom >= topSide.top || viewPortHeight - (bottomSide.top + menuSize.height) >= 0) {
      this.#openDown(bottomSide);
      return;
    }

    this.#openUp(topSide);
  }

  #tryOpenUp(side: AnchorCornerBlockSide, menuSize: MenuSize): void {
    if (side.top === side.bottom || side.top - menuSize.height >= 0) {
      this.#openUp(side);
      return;
    }

    this.#openToLargestBlockSide(side);
  }

  #tryOpenDown(side: AnchorCornerBlockSide, menuSize: MenuSize): void {
    const viewPortHeight = window.innerHeight;

    if (side.top === side.bottom || viewPortHeight - (side.top + menuSize.height) >= 0) {
      this.#openDown(side);
      return;
    }

    this.#openToLargestBlockSide(side);
  }

  #openToLargestBlockSide(side: AnchorCornerBlockSide) {
    if (side.top > side.bottom) {
      this.#openUp(side);
      return;
    }

    this.#openDown(side);
  }

  #setToOpenToStartOrEnd(menuPosition: MenuPosition, menuSize: MenuSize): void {
    const openStart = menuPosition.isRtl ? this.#tryOpenRight.bind(this) : this.#tryOpenLeft.bind(this);
    const openEnd = menuPosition.isRtl ? this.#tryOpenLeft.bind(this) : this.#tryOpenRight.bind(this);

    const side = this.anchorCorner.endsWith('-start') ? menuPosition.bounds.start : menuPosition.bounds.end;

    if (this.direction.endsWith('-start')) {
      openStart(side, menuSize);
      return;
    }

    openEnd(side, menuSize);
  }

  #tryOpenLeft(side: AnchorCornerInlineSide, menuSize: MenuSize): void {
    if (side.left === side.right || side.left - menuSize.width >= 0) {
      this.menu.style.right = `${side.relativeX * -1}px`;
      return;
    }

    this.#openToLargestInlineSide(side);
  }

  #tryOpenRight(side: AnchorCornerInlineSide, menuSize: MenuSize): void {
    const viewPortWidth = window.innerWidth;

    if (side.left === side.right || viewPortWidth - (side.left + menuSize.width) >= 0) {
      this.menu.style.left = `${side.relativeX}px`;
      return;
    }

    this.#openToLargestInlineSide(side);
  }

  #openToLargestInlineSide(side: AnchorCornerInlineSide) {
    if (side.left > side.right) {
      this.menu.style.right = `${side.relativeX * -1}px`;
      return;
    }

    this.menu.style.left = `${side.relativeX}px`;
  }

  #openUp(side: AnchorCornerBlockSide) {
    const viewPortHeight = window.innerHeight;

    this.menu.style.bottom = `${side.relativeY * -1}px`;
    this.menu.classList.add('up');
    this.menu.style.maxHeight = this.allowOverflow ? '' : `${viewPortHeight - side.bottom}px`;
  }

  #openDown(side: AnchorCornerBlockSide) {
    const viewPortHeight = window.innerHeight;
    this.menu.style.top = `${side.relativeY}px`;
    this.menu.style.maxHeight = this.allowOverflow ? '' : `${viewPortHeight - side.top}px`;
  }

  private getMenuPosition(): MenuPosition {
    const viewPortWidth = window.innerWidth;
    const viewPortHeight = window.innerHeight;

    const anchorElement = this.anchorElement!;
    const anchorRect = anchorElement.getBoundingClientRect();
    const refRect = this.ref.getBoundingClientRect();
    const anchorStyles = getComputedStyle(anchorElement);
    const isRtl = anchorStyles.direction === 'rtl';

    const width = parseInt(anchorStyles.width, 10);
    const height = parseInt(anchorStyles.height, 10);

    const rectX = refRect.left;
    const rectY = refRect.top;

    const leftPoint: AnchorCornerInlineSide = {
      left: anchorRect.left,
      right: viewPortWidth - anchorRect.left,
      relativeX: anchorRect.left - rectX,
    };

    const rightPoint: AnchorCornerInlineSide = {
      left: anchorRect.right,
      right: viewPortWidth - anchorRect.right,
      relativeX: leftPoint.relativeX + width,
    };

    const topPoint: AnchorCornerBlockSide = {
      top: anchorRect.top,
      relativeY: anchorRect.top - rectY,
      bottom: viewPortHeight - anchorRect.top,
    };

    const anchorBounds: AnchorBounds = {
      top: topPoint,
      bottom: {
        top: anchorRect.bottom,
        relativeY: topPoint.relativeY + height,
        bottom: viewPortHeight - anchorRect.bottom,
      },
      start: isRtl ? rightPoint : leftPoint,
      end: isRtl ? leftPoint : rightPoint,
      width,
      height,
    };

    return {
      isRtl,
      bounds: anchorBounds,
    };
  }

  private getMenuSize(): MenuSize {
    const menu = this.menu;
    const menuStyles = getComputedStyle(menu);
    const width = parseInt(menuStyles.width, 10);
    const height = parseInt(menuStyles.height, 10);

    return {
      width,
      height,
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-menu': UmMenu;
  }
}
