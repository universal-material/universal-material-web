import { normalizedStartsWith } from '../shared/compare-text.js';
import { MenuFieldNavigationController } from '../shared/menu-field/menu-field-navigation-controller.js';
import { UmOption } from './option.js';
import { UmSelect } from './select.js';

const getCleanTypeaheadStatus = () => ({
  typing: false,
  repeating: false,
  buffer: '',
  timeoutId: 0
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
    this.navigateTo(event, option);
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
    this.focusMenu(<UmOption>e.target, false, false);
  };

  protected override afterFocus(option: UmOption) {
    this.host._button.setAttribute('aria-activedescendant', option._listItem.id);
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

    this.#typeaheadStatus.timeoutId = setTimeout(() => this.#typeaheadStatus = getCleanTypeaheadStatus(), 1000);

    const term = this.#typeaheadStatus.buffer.replaceAll(event.key, '') === ''
      ? event.key
      : this.#typeaheadStatus.buffer;
    this.findNextElementByTerm(term, lastFocusedMenu);

    return true;
  }

  private findNextElementByTerm(term: string, lastFocusedMenu: UmOption | null): void {
    let nextMenu = <UmOption | undefined>lastFocusedMenu?.nextElementSibling

    if (!nextMenu || !normalizedStartsWith(nextMenu.textContent, term)) {
      nextMenu = this.host._options.find(o => normalizedStartsWith(o.textContent, term));
    }

    if (!nextMenu) {
      return;
    }

    if (this.host._menu.open) {
      this.blurMenu();
      this.focusMenu(nextMenu);
      return;
    }

    nextMenu.setSelectedByUser();
  }
}
