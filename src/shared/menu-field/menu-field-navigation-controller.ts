import { UmMenuItem } from '../../menu/menu-item.js';
import { UmMenuField } from './menu-field.js';

export class MenuFieldNavigationController<TField extends UmMenuField, TMenuItem extends UmMenuItem> {
  #element: HTMLElement | null = null;
  protected focusedMenu: TMenuItem | null = null;
  protected readonly host: TField;

  private readonly _bindHandleKeyDown: (event: KeyboardEvent) => void;

  constructor(host: TField) {
    this.host = host;
    this._bindHandleKeyDown = this.handleKeyDown.bind(this);
  }

  attach(element: HTMLElement) {
    this.detach();

    element?.addEventListener('keydown', this._bindHandleKeyDown, { capture: true });
    this.host._menu?.addEventListener('close', this.#handleMenuClose);
    this.#element = element;
  }

  detach() {
    this.#element?.removeEventListener('keydown', this._bindHandleKeyDown);
    this.host._menu?.removeEventListener('close', this.#handleMenuClose);
    this.#element = null;
  }

  readonly #handleMenuClose = () => this.blurMenu();

  protected handleKeyDown(event: KeyboardEvent): boolean {
    if (this.host._menu?.open !== true) {
      return false;
    }

    const isEscape = event.key === 'Escape';

    if (isEscape) {
      this.host._menu.close();
    }

    if (event.key === 'Home') {
      this.navigateTo(event, (this.host._menuItems[0] as TMenuItem), 0);
      return true;
    }

    if (event.key === 'End') {
      this.navigateTo(
        event,
        (this.host._menuItems[this.host._menuItems.length - 1] as TMenuItem),
        this.host._menuItems.length - 1,
      );
      return true;
    }

    const isDown = event.key === 'ArrowDown';
    const isUp = event.key === 'ArrowUp';

    if (isDown || isUp) {
      this.navigate(event, isDown);
      return true;
    }

    const isEnter = event.key === 'Enter';
    const isTab = event.key === 'Tab';

    if (isEnter || isTab) {
      this.selectActiveItem(event);
      return true;
    }

    return false;
  }

  private navigate(event: KeyboardEvent, forwards: boolean) {
    const menuItems = this.host._menuItems;

    if (!menuItems.length) {
      return;
    }

    event.preventDefault();

    const activeMenu = this.focusedMenu;

    const activeMenuIndex = activeMenu ? menuItems.indexOf(activeMenu) : -1;

    const nextMenu = forwards
      ? menuItems[activeMenuIndex + 1] as TMenuItem ?? menuItems[0]
      : menuItems[activeMenuIndex - 1] as TMenuItem ?? menuItems[menuItems.length - 1];

    if (!nextMenu) {
      return;
    }

    this.navigateTo(event, nextMenu, menuItems.indexOf(nextMenu));
  }

  protected navigateTo(event: KeyboardEvent, menu: TMenuItem | undefined, index: number) {
    event.preventDefault();

    this.blurMenu();

    if (!menu) {
      return;
    }

    this.focusMenu(menu, index);
  }

  focusMenu(menu: TMenuItem, index: number, active = true, scroll = true) {
    if (this.focusedMenu) {
      this.focusedMenu.active = false;
    }

    this.focusedMenu = menu;
    menu.active = active;

    if (scroll) {
      menu.scrollIntoView({ block: 'nearest' });
    }

    this.afterFocus(menu, index);
  }

  blurMenu() {
    if (!this.focusedMenu) {
      return;
    }

    this.focusedMenu.active = false;
    this.focusedMenu = null;
    this.afterBlur();
  }

  private selectActiveItem(event: KeyboardEvent) {
    if (!this.focusedMenu) {
      return;
    }

    event.preventDefault();
    this.focusedMenu.click();
    this.host._menu.open = false;
  }

  protected afterFocus(_: TMenuItem, __: number) {
  }

  protected afterBlur() {
  }
}
