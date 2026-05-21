import { normalizedStartsWith } from '../shared/compare-text.js';
import { MenuFieldNavigationController } from '../shared/menu-field/menu-field-navigation-controller.js';
import { Option } from './option.js';
import { Select } from './select.js';

const getCleanTypeaheadStatus = () => ({
  typing: false,
  repeating: false,
  buffer: '',
  timeoutId: 0,
});

export class SelectNavigationController extends MenuFieldNavigationController<Select, Option> {
  #typeaheadStatus = getCleanTypeaheadStatus();

  protected override handleKeyDown(event: KeyboardEvent): boolean {
    if (this.getHost()._menu.open) {
      const handled = super.handleKeyDown(event);

      return handled || this.handleType(event);
    }

    const isDown = event.key === 'ArrowDown';
    const isUp = event.key === 'ArrowUp';

    if (!isDown && !isUp) {
      return this.handleType(event);
    }

    event.preventDefault();
    this.getHost()._menu.show();

    if (!this.getHost().selectedOptions.length) {
      return true;
    }

    const option = this.getHost().selectedOptions[0];
    this.navigateTo(event, option, this.getHost()._menuItems.indexOf(option));
    return true;
  }

  override attach(element: HTMLElement) {
    super.attach(element);
    this.getHost()._menu.addEventListener('menu-item-mouseenter', this.#handleMouseFocus);
  }

  override detach() {
    super.detach();
    this.getHost()._menu.removeEventListener('menu-item-mouseenter', this.#handleMouseFocus);
  }

  readonly #handleMouseFocus = (e: Event) => {
    this.blurMenu();
    const option = e.target as Option;
    this.focusMenu(option, this.getHost()._menuItems.indexOf(option), false, false);
  };

  protected override afterFocus(_: Option, index: number) {
    this.getHost()._button.setAttribute('aria-activedescendant', `item-${index + 1}`);
  }

  protected override afterBlur() {
    this.getHost()._button.removeAttribute('aria-activedescendant');
  }

  private handleType(event: KeyboardEvent) {
    if (event.key.length > 1) {
      return false;
    }

    if (this.#typeaheadStatus.timeoutId) {
      clearTimeout(this.#typeaheadStatus.timeoutId);
    }

    const lastFocusedMenu = this.focusedMenu;

    this.#typeaheadStatus.buffer += event.key;

    this.#typeaheadStatus.timeoutId = setTimeout(() => this.#typeaheadStatus = getCleanTypeaheadStatus(), 1000);

    const term =
      this.#typeaheadStatus.buffer.replaceAll(event.key, '') === '' ? event.key : this.#typeaheadStatus.buffer;
    this.findNextElementByTerm(term, lastFocusedMenu);

    return true;
  }

  private findNextElementByTerm(term: string, lastFocusedMenu: Option | null): void {
    const options = this.getHost()._options;
    const lastFocusedMenuIndex = lastFocusedMenu ? options.indexOf(lastFocusedMenu) : -1;

    let nextMenu =
      lastFocusedMenuIndex > -1 ? this.getHost()._options[lastFocusedMenuIndex + 1] as Option | undefined : null;

    if (!nextMenu || !normalizedStartsWith(nextMenu.textContent, term)) {
      nextMenu = options.find(o => normalizedStartsWith(o.textContent, term));
    }

    if (!nextMenu) {
      return;
    }

    const nextMenuIndex = options.indexOf(nextMenu);

    if (this.getHost()._menu.open) {
      this.blurMenu();
      this.focusMenu(nextMenu, nextMenuIndex);
      return;
    }

    nextMenu._setSelectedByUser();
  }
}
