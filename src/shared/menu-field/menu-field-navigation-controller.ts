import { UmMenuItem } from '../../menu/menu-item.js';
import { UmMenuField } from './menu-field.js';

export class MenuFieldNavigationController<TField extends UmMenuField, TMenuItem extends UmMenuItem> {
  #element: HTMLElement | null = null;
  protected focusedMenu: TMenuItem | null = null;
  protected readonly host: TField;

  private readonly bindHandleKeyDown: (event: KeyboardEvent) => void;

  constructor(host: TField) {
    this.host = host;
    this.bindHandleKeyDown = this.handleKeyDown.bind(this);
  }

  attach(element: HTMLElement) {
    this.detach();

    element?.addEventListener('keydown', this.bindHandleKeyDown, {capture: true});
    this.host.menu?.addEventListener('close', this.#handleMenuClose);
    this.#element = element;
  }

  detach() {
    this.#element?.removeEventListener('keydown', this.bindHandleKeyDown);
    this.host.menu?.removeEventListener('close', this.#handleMenuClose);
    this.#element = null;
  }

  #handleMenuClose = () => this.blurMenu();

  protected handleKeyDown(event: KeyboardEvent): boolean {
    if (!this.host.menu.open) {
      return false;
    }

    const isEscape = event.key === 'Escape';

    if (isEscape) {
      this.host.menu.close();
    }

    if (event.key === 'Home') {
      this.navigateTo(event, <TMenuItem>this.host.menuItems[0]);
      return true;
    }

    if (event.key === 'End') {
      this.navigateTo(event, <TMenuItem>this.host.menuItems[this.host.menuItems.length - 1]);
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
    const menuItems = this.host.menuItems;

    if (!menuItems.length) {
      return;
    }

    event.preventDefault();

    const activeMenu = this.focusedMenu;

    const nextMenu = forwards
      ? (<TMenuItem>activeMenu?.nextElementSibling) ?? menuItems[0]
      : (<TMenuItem>activeMenu?.previousElementSibling) ?? menuItems[menuItems.length - 1];

    if (!nextMenu) {
      return;
    }

    this.navigateTo(event, nextMenu);
  }

  protected navigateTo(event: KeyboardEvent, menu: TMenuItem | undefined) {
    event.preventDefault();

    this.blurMenu();

    if (!menu) {
      return;
    }

    this.focusMenu(menu);
  }

  focusMenu(menu: TMenuItem, active = true, scroll = true) {
    this.focusedMenu = menu;
    menu.active = active;

    if (scroll) {
      menu.scrollIntoView({block: 'nearest'});
    }

    this.afterFocus(menu);
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
  }

  protected afterFocus(_: TMenuItem) {

  }

  protected afterBlur() {

  }
}
