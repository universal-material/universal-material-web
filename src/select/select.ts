import { PropertyValues } from '@lit/reactive-element';
import { html, svg, TemplateResult } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { html as staticHtml } from 'lit/static-html.js';

import { styles } from './select.styles.js';

import { UmMenu } from '../menu/menu.js';
import { UmMenuField } from '../shared/menu-field/menu-field.js';
import { UmTextFieldBase } from '../shared/text-field-base/text-field-base.js';
import { ExtendedSelect } from './extended-select.js';
import { UmOption } from './option.js';
import { SelectNavigationController } from './select-navigation-controller.js';

import './option.js';

@customElement('u-select')
export class UmSelect extends UmTextFieldBase implements UmMenuField {
  static override styles = [UmTextFieldBase.styles, styles];

  _nativeSelect: ExtendedSelect = (() => {
    const select = <ExtendedSelect>document.createElement('select');
    select.setAttribute('tabindex', '-1');
    select.setAttribute('part', 'select');

    return select;
  })();

  #list: HTMLElement = (() => {
    const list = document.createElement('div');
    list.role = 'listbox';
    list.id = 'list';
    list.className = 'list';

    return list;
  })();

  #navigationController = new SelectNavigationController(this);
  readonly #mutationObserver: MutationObserver;
  #connected = false;

  /**
   * The `value` of the selected option
   */
  @state()
  get value(): string {
    return this._nativeSelect.value;
  }

  set value(value: string) {
    this._nativeSelect.value = value;

    if (!this.#connected) {
      return;
    }

    this.elementInternals.setFormValue(value);
  }

  @query('u-menu', true) _menu!: UmMenu;
  @query('.button', true) _button!: HTMLButtonElement;
  @query('.input', true) _input!: HTMLElement;

  /**
   * The index of the selected option. When there's no selected option the value is `-1`.
   */
  @state()
  get selectedIndex(): number {
    return this._nativeSelect.selectedIndex;
  }

  set selectedIndex(index: number) {
    this._nativeSelect.selectedIndex = index;
  }

  /**
   * An `Array` containing the selected `UmOption` or empty if there's no selected option. Multiple selection is not supported.
   */
  get selectedOptions(): UmOption[] {
    return this._nativeSelect.selectedOptions.length ? [this._nativeSelect.selectedOptions[0]._parent] : [];
  }

  get _options(): UmOption[] {
    const options = Array.from(this.querySelectorAll<HTMLElement>('u-option'));

    return options.filter(o => o instanceof UmOption) as UmOption[];
  }

  constructor() {
    super();

    this.#mutationObserver = new MutationObserver(() => this._updateOptions());
    this.#mutationObserver.observe(this, {
      characterData: true,
      childList: true,
      subtree: true,
    });
  }

  _updateOptions() {
    const options = this._options;

    for (const option of options) {
      option._select = this;
    }

    this.#updateOptions(options);
    this.#updateAccessibilityList(options);

    const selectedOption = this.selectedOptions[0];

    if (!selectedOption) {
      return;
    }

    // eslint-disable-next-line no-self-assign
    selectedOption.selected = selectedOption.selected;
    this.empty = !selectedOption.textContent?.trim();
    // this._button.setAttribute('aria-labelledby', selectedOption._listItem.id);
  }

  #updateOptions(options: UmOption[]) {
    const maxLength = Math.max(options.length, this._nativeSelect.children.length);

    for (let i = 0; i < maxLength; i++) {
      const option = options[i];
      const nativeOption = this._nativeSelect.children[i];

      if (!option) {
        nativeOption.remove();
        continue;
      }

      option._nativeOption.textContent = option.textContent;

      if (!nativeOption) {
        this._nativeSelect.appendChild(option._nativeOption);
        continue;
      }

      nativeOption.insertAdjacentElement('beforebegin', option._nativeOption);
    }
  }

  #updateAccessibilityList(options: UmOption[]) {
    const maxLength = Math.max(options.length, this.#list.children.length);

    for (let i = 0; i < maxLength; i++) {
      const option = options[i];
      let item = this.#list.children[i];

      if (!option) {
        item.remove();
        continue;
      }

      if (!item) {
        item = this.#createListItem(`item-${i + 1}`);
        this.#list.appendChild(item);
      }

      item.textContent = option.textContent;
    }
  }

  #createListItem(id: string): HTMLElement {
    const item = document.createElement('div');
    item.role = 'option';
    item.id = id;

    item.textContent = this.textContent;

    return item;
  }

  #setSelectedOption() {
    const options = this._options;

    const selectedClassOptions = options.filter(o => o.classList.contains('selected'));

    let found = false;

    for (const option of selectedClassOptions) {
      if (option.selected) {
        found = true;
        continue;
      }

      option.classList.remove('selected');
    }

    if (found) {
      return;
    }

    const selectedOption = this.selectedOptions[0];

    if (selectedOption) {
      selectedOption.classList.add('selected');
    }
  }

  protected override renderControl(): TemplateResult {
    return staticHtml`
      <button 
         class="button"
         role="combobox"
         aria-expanded="false"
         aria-owns="select"
         ?disabled=${this.disabled}></button>
      <div class="input"></div>`;
  }

  protected override renderAfterContent(): TemplateResult {
    return html`
      <u-menu>
        <slot></slot>
      </u-menu>
    `;
  }

  protected override renderDefaultTrailingIcon(): TemplateResult {
    return svg`
      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
        <path d="M480-360 280-560h400L480-360Z"/>
      </svg>`;
  }

  protected override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    this.empty = !this.selectedOptions[0]?.textContent?.trim();
    this.elementInternals.setFormValue(this._nativeSelect.value || null);
  }

  override attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    super.attributeChangedCallback(name, _old, value);

    if (name !== 'disabled') {
      return;
    }

    this._nativeSelect.disabled = value === null;
  }

  override connectedCallback() {
    super.connectedCallback();

    this.#connected = true;
    this.#attach();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    this.#detach();
  }

  #handleClick = (e: MouseEvent) => {
    this._menu.toggle();

    if (!this._menu.open || !this.selectedOptions.length) {
      return;
    }

    this.#navigationController.focusMenu(this.selectedOptions[0], 0, e.detail === 0, false);
  };

  #handleMenuClick(e: Event) {
    e.stopPropagation();
  }

  #handleMenuOpen = () => {
    this._button.setAttribute('aria-expanded', 'true');
    this.#setSelectedOption();
  };

  #handleMenuOpened = () => {
    if (!this.selectedOptions.length) {
      return;
    }

    const option = this.selectedOptions[0];
    option.scrollIntoView({ block: 'nearest' });
  };

  #handleMenuClose = () => {
    this._button.setAttribute('aria-expanded', 'false');
    this.#navigationController.blurMenu();
  };

  async #attach(): Promise<void> {
    await this.updateComplete;

    this._nativeSelect.disabled = this.hasAttribute('disabled');

    this.#navigationController.attach(this);
    this._updateOptions();

    if (this._nativeSelect.parentElement !== this._input) {
      this._input.appendChild(this._nativeSelect);
    }

    this._input.appendChild(this.#list);
    this._button.addEventListener('click', this.#handleClick);

    this._menu.anchorElement = this._container;
    this._menu.addEventListener('click', this.#handleMenuClick);
    this._menu.addEventListener('open', this.#handleMenuOpen);
    this._menu.addEventListener('opened', this.#handleMenuOpened);
    this._menu.addEventListener('close', this.#handleMenuClose);
  }

  async #detach(): Promise<void> {
    await this.updateComplete;

    this.#navigationController.detach();
    this.#connected = false;
    this._button.removeEventListener('click', this.#handleClick);
    this._menu.removeEventListener('click', this.#handleMenuClick);
    this._menu.removeEventListener('open', this.#handleMenuOpen);
    this._menu.removeEventListener('opened', this.#handleMenuOpened);
    this._menu.removeEventListener('close', this.#handleMenuClose);
  }

  get _menuItems(): UmOption[] {
    return this._options;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-select': UmSelect;
  }
}
