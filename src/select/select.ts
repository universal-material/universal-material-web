import { PropertyValues } from '@lit/reactive-element';

import { html, render, svg, TemplateResult } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { html as staticHtml } from 'lit/static-html.js';

import { UmMenu } from '../menu/menu.js';
import { UmMenuField } from '../shared/menu-field/menu-field.js';
import { UmTextFieldBase } from '../shared/text-field-base/text-field-base.js';
import { UmOption } from './option.js';
import { SelectNavigationController } from './select-navigation-controller.js';
import { styles } from './select.styles.js';

import './option.js';

@customElement('u-select')
export class UmSelect extends UmTextFieldBase implements UmMenuField {
  static override styles = [UmTextFieldBase.styles, styles];

  _nativeSelect = document.createElement('select');

  readonly #list: HTMLElement = (() => {
    const list = document.createElement('div');
    list.role = 'listbox';
    list.id = 'list';
    list.className = 'list';

    return list;
  })();

  readonly #navigationController = new SelectNavigationController(this);
  readonly #resizeObserver = new ResizeObserver(() => this.#setMenuWidthProperty());
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

  @property({ reflect: true, attribute: 'menu-positioning' }) menuPositioning: 'relative' | 'fixed' = 'relative';

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
    return this._nativeSelect.selectedOptions.length
      ? [this._options[this._nativeSelect.selectedIndex]]
      : [];
  }

  get _options(): UmOption[] {
    const options = Array.from(this.querySelectorAll<HTMLElement>('u-option'));

    return options.filter(o => o instanceof UmOption);
  }

  constructor() {
    super();

    this._nativeSelect.setAttribute('tabindex', '-1');
    this._nativeSelect.setAttribute('part', 'select');
  }

  #setMenuWidthProperty(): void {
    this.style.setProperty('--_menu-width', `${this.clientWidth}px`);
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
      <u-menu positioning="${this.menuPositioning}">
        <slot @slotchange=${this.#renderOptionRelatedElements}></slot>
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

  readonly #handleClick = (e: MouseEvent) => {
    this._menu.toggle();

    if (!this._menu.open || !this.selectedOptions.length) {
      return;
    }

    this.#navigationController.focusMenu(this.selectedOptions[0], 0, e.detail === 0, false);
  };

  #handleMenuClick(e: Event) {
    e.stopPropagation();
  }

  readonly #handleMenuOpen = () => {
    this._button.setAttribute('aria-expanded', 'true');
  };

  readonly #handleMenuOpened = () => {
    if (!this.selectedOptions.length) {
      return;
    }

    const option = this.selectedOptions[0];
    option.scrollIntoView({ block: 'nearest' });
  };

  readonly #handleMenuClose = () => {
    this._button.setAttribute('aria-expanded', 'false');
    this.#navigationController.blurMenu();
  };

  async #attach(): Promise<void> {
    this.#resizeObserver.observe(this);
    this.#renderOptionRelatedElements();

    await this.updateComplete;

    this._nativeSelect.disabled = this.hasAttribute('disabled');

    this.#navigationController.attach(this);

    this._input.appendChild(this._nativeSelect);
    this._input.appendChild(this.#list);
    this._button.addEventListener('click', this.#handleClick);

    this._menu.anchorElement = this._container;
    this._menu.addEventListener('click', this.#handleMenuClick);
    this._menu.addEventListener('open', this.#handleMenuOpen);
    this._menu.addEventListener('opened', this.#handleMenuOpened);
    this._menu.addEventListener('close', this.#handleMenuClose);
  }

  #detach(): void {
    this.#resizeObserver.disconnect();
    this._nativeSelect.remove();
    this.#list.remove();
    this.#navigationController.detach();
    this.#connected = false;
    this._button.removeEventListener('click', this.#handleClick);
    this._menu.removeEventListener('click', this.#handleMenuClick);
    this._menu.removeEventListener('open', this.#handleMenuOpen);
    this._menu.removeEventListener('opened', this.#handleMenuOpened);
    this._menu.removeEventListener('close', this.#handleMenuClose);
  }

  #renderOptionRelatedElements() {
    this.#renderNativeOptions();
    this.#renderAccessibilityList();
    this._updateEmpty();
    this._syncSelectedOptions();
  }

  _updateEmpty(): void {
    this.empty = !this.selectedOptions[0]?.textContent?.trim();
  }

  get _menuItems(): UmOption[] {
    return this._options;
  }

  #renderNativeOptions() {
    render(
      map(
        this._options,
        option =>
          html`<option value=${option.value} ?selected=${option.selected}>${option.textContent}</option>`),
      this._nativeSelect);
  }

  #renderAccessibilityList() {
    render(
      map(
        this._options,
        (option, index) =>
          html`<div role="option" id="${`item-${index + 1}`}">${option.textContent}</div>`),
      this.#list);
  }

  _syncSelectedOptions() {

    for (let i = 0; i < this._options.length; i++) {
      const option = this._options[i];
      const nativeOption = this._nativeSelect.children[i] as HTMLOptionElement;
      option.selected = nativeOption.selected;
      option._nativeOption = nativeOption;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-select': UmSelect;
  }
}
