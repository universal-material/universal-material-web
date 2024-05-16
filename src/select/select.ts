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
  currentOptionIndex = 1;

  static override styles = [UmTextFieldBase.styles, styles];

  nativeSelect: ExtendedSelect = (() => {
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

  @state()
  get value(): string {
    return this.nativeSelect.value;
  }
  set value(value: string) {
    this.nativeSelect.value = value;

    if (!this.#connected) {
      return;
    }

    this.elementInternals.setFormValue(value);
  }

  @query('u-menu') menu!: UmMenu;
  @query('.button') button!: HTMLButtonElement;
  @query('.input') input!: HTMLElement;

  @state()
  get selectedIndex(): number {
    return this.nativeSelect.selectedIndex;
  }
  set selectedIndex(index: number) {
    this.nativeSelect.selectedIndex = index;
  }

  get selectedOptions(): UmOption[] {
    return this.nativeSelect.selectedOptions.length
      ? [this.nativeSelect.selectedOptions[0]._parent]
      : [];
  }

  get options(): UmOption[] {
    const options = Array.from(this.querySelectorAll<UmOption>('u-option'));

    return options
      .filter(o => o.constructor.name === 'UmOption');
  }

  constructor() {
    super();

    this.#mutationObserver = new MutationObserver(() => this._updateOptions())
    this.#mutationObserver.observe(this, {characterData: true, childList: true, subtree: true});
  }

  _updateOptions() {

    const options = this.options;

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
    this.button.setAttribute('aria-labelledby', selectedOption._listItem.id)
  }

  #updateOptions(options: UmOption[]) {
    const maxLength = Math.max(options.length, this.nativeSelect.children.length);

    for (let i = 0; i < maxLength; i++) {
      const option = options[i];
      const nativeOption = this.nativeSelect.children[i];

      if (!option) {
        nativeOption.remove();
        continue;
      }

      if (!nativeOption) {
        this.nativeSelect.appendChild(option._nativeOption);
        continue;
      }

      nativeOption.insertAdjacentElement('beforebegin', option._nativeOption);
    }
  }

  #updateAccessibilityList(options: UmOption[]) {

    const maxLength = Math.max(options.length, this.#list.children.length);

    for (let i = 0; i < maxLength; i++) {
      const option = options[i];
      const item = this.#list.children[i];

      if (!option) {
        item.remove();
        continue;
      }

      option._listItem.id = `item-${i + 1}`;

      if (!item) {
        this.#list.appendChild(option._listItem);
        continue;
      }

      item.insertAdjacentElement('beforebegin', option._listItem);
    }
  }

  #setSelectedOption() {
    const options = this.options;

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
    this.elementInternals.setFormValue(this.nativeSelect.value || null);
  }

  override attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    super.attributeChangedCallback(name, _old, value);

    if (name !== 'disabled') {
      return;
    }

    this.nativeSelect.disabled = value === null;
  }

  override connectedCallback() {
    super.connectedCallback();

    this.#connected = true;
    this.#attach();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    this.#navigationController.detach();
    this.#connected = false;
    this.nativeSelect.remove();
    this.button.removeEventListener('click', this.#handleClick);
    this.menu.removeEventListener('click', this.#handleMenuClick);
    this.menu.removeEventListener('open', this.#handleMenuOpen);
    this.menu.removeEventListener('opened', this.#handleMenuOpened);
    this.menu.removeEventListener('close', this.#handleMenuClose);
  }

  #handleClick = (e: MouseEvent) => {
    this.menu.toggle();

    if (!this.menu.open || !this.selectedOptions.length) {
      return;
    }

    this.#navigationController.focusMenu(this.selectedOptions[0], e.detail === 0, false);
  };

  #handleMenuClick(e: Event) {
    e.stopPropagation();
  }

  #handleMenuOpen = () => {
    this.button.setAttribute('aria-expanded', 'true');
    this.#setSelectedOption();
  };

  #handleMenuOpened = () => {
    if (!this.selectedOptions.length) {
      return;
    }

    const option = this.selectedOptions[0];
    option.scrollIntoView({block: 'nearest'});
  };

  #handleMenuClose = () => {
    this.button.setAttribute('aria-expanded', 'false');
    this.#navigationController.blurMenu();
  };

  async #attach(): Promise<void> {
    await this.updateComplete;

    this.nativeSelect.disabled = this.hasAttribute('disabled');

    this.#navigationController.attach(this);
    this._updateOptions();

    this.input.appendChild(this.nativeSelect);
    this.input.appendChild(this.#list);
    this.button.addEventListener('click', this.#handleClick);

    this.menu.anchorElement = this.container;
    this.menu.addEventListener('click', this.#handleMenuClick);
    this.menu.addEventListener('open', this.#handleMenuOpen);
    this.menu.addEventListener('opened', this.#handleMenuOpened);
    this.menu.addEventListener('close', this.#handleMenuClose);
  }

  get menuItems(): UmOption[] {
    return this.options;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-select': UmSelect;
  }
}
