import { normalizedStartsWith } from '../shared/compare-text.js';
import { MenuFieldNavigationController } from '../shared/menu-field/menu-field-navigation-controller.js';
import { UmOption } from './option.js';
import { UmSelect } from './select.js';

const getCleanTypeaheadStatus = () => ({
  typing: false,
  repeating: false,
  buffer: '',
  timeoutId: 0,
});

export class SelectNavigationController extends MenuFieldNavigationController<UmSelect, UmOption> {
  #typeaheadStatus = getCleanTypeaheadStatus();

  protected override handleKeyDown(event: KeyboardEvent): boolean {
    if (this.host._menu.open) {
      const handled = super.handleKeyDown(event);

      return handled || this.handleType(event);
    }

    const isDown = event.key === 'ArrowDown';
    const isUp = event.key === 'ArrowUp';

    if (!isDown && !isUp) {
      return this.handleType(event);
    }

    event.preventDefault();
    this.host._menu.show();

    if (!this.host.selectedOptions.length) {
      return true;
    }

    const option = this.host.selectedOptions[0];
    this.navigateTo(event, option, this.host._menuItems.indexOf(option));
    return true;
  }

  override attach(element: HTMLElement) {
    super.attach(element);
    this.host._menu.addEventListener('menu-item-mouseenter', this.#handleMouseFocus);
  }

  override detach() {
    super.detach();
    this.host._menu.removeEventListener('menu-item-mouseenter', this.#handleMouseFocus);
  }

  #handleMouseFocus = (e: Event) => {
    this.blurMenu();
    const option = <UmOption>e.target;
    this.focusMenu(option, this.host._menuItems.indexOf(option), false, false);
  };

  protected override afterFocus(_: UmOption, index: number) {
    this.host._button.setAttribute('aria-activedescendant', `item-${index + 1}`);
  }

  protected override afterBlur() {
    this.host._button.removeAttribute('aria-activedescendant');
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

    this.#typeaheadStatus.timeoutId = setTimeout(() => (this.#typeaheadStatus = getCleanTypeaheadStatus()), 1000);

    const term =
      this.#typeaheadStatus.buffer.replaceAll(event.key, '') === '' ? event.key : this.#typeaheadStatus.buffer;
    this.findNextElementByTerm(term, lastFocusedMenu);

    return true;
  }

  private findNextElementByTerm(term: string, lastFocusedMenu: UmOption | null): void {
    const options = this.host._options;
    const lastFocusedMenuIndex = lastFocusedMenu ? options.indexOf(lastFocusedMenu) : -1;

    let nextMenu =
      lastFocusedMenuIndex > -1 ? <UmOption | undefined>this.host._options[lastFocusedMenuIndex + 1] : null;

    if (!nextMenu || !normalizedStartsWith(nextMenu.textContent, term)) {
      nextMenu = options.find(o => normalizedStartsWith(o.textContent, term));
    }

    if (!nextMenu) {
      return;
    }

    const nextMenuIndex = options.indexOf(nextMenu);

    if (this.host._menu.open) {
      this.blurMenu();
      this.focusMenu(nextMenu, nextMenuIndex);
      return;
    }

    nextMenu.setSelectedByUser();
  }
}
