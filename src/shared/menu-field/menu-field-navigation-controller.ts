import { UmMenuItem } from '../../menu/menu-item.js';
import { UmMenuField } from './menu-field.js';

export class MenuFieldNavigationController<T extends UmMenuField> {
  #element: HTMLElement | null = null;
  protected readonly host: T;

  private readonly bindHandleKeyDown: (event: KeyboardEvent) => void;

  constructor(host: T) {
    this.host = host;
    this.bindHandleKeyDown = this.handleKeyDown.bind(this);
  }

  attach(element: HTMLElement) {
    this.detach();

    element?.addEventListener('keydown', this.bindHandleKeyDown);
    this.#element = element;
  }

  detach() {
    this.#element?.removeEventListener('keydown', this.bindHandleKeyDown);
    this.#element = null;
  }

  protected handleKeyDown(event: KeyboardEvent) {
    if (!this.host.menu.open) {
      return;
    }

    const isEscape = event.key === 'Escape';

    if (isEscape) {
      this.host.menu.close();
    }

    const isDown = event.key === 'ArrowDown';
    const isUp = event.key === 'ArrowUp';

    if (isDown || isUp) {
      this.navigate(event, isDown);
      return;
    }

    const isEnter = event.key === 'Enter';
    const isTab = event.key === 'Tab';

    if (isEnter || isTab) {
      this.selectActiveItem(event);
    }
  }

  private navigate(event: KeyboardEvent, forwards: boolean) {
    const menuItems = Array.from(this.host.menuItems);

    if (!menuItems.length) {
      return;
    }

    event.preventDefault();

    const activeMenu = menuItems.find(m => m.active);

    if (activeMenu) {
      activeMenu.active = false;
    }

    const nextMenu = forwards
      ? (<UmMenuItem>activeMenu?.nextElementSibling) ?? menuItems[0]
      : (<UmMenuItem>activeMenu?.previousElementSibling) ?? menuItems[menuItems.length - 1];

    if (!nextMenu) {
      return;
    }

    nextMenu.active = true;
    nextMenu.scrollIntoView({block: 'nearest'});
  }

  private selectActiveItem(event: KeyboardEvent) {
    const menuItems = Array.from(this.host.menuItems);
    const activeMenu = menuItems.find(m => m.active)

    if (!activeMenu) {
      return;
    }

    event.preventDefault();
    activeMenu.click();
  }
}
