import { svg, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { styles } from './option.styles.js';

import { UmMenuItem } from '../menu/menu-item.js';
import { ExtendedOption } from './extended-option.js';
import { UmSelect } from './select.js';

import './select.js';

@customElement('u-option')
export class UmOption extends UmMenuItem {

  static override styles = [UmMenuItem.styles, styles];

  _nativeOption: ExtendedOption = (() => {
    const option = <ExtendedOption>document.createElement('option');
    option._parent = this;

    if (this.hasAttribute('selected')) {
      option.setAttribute('selected', '');
    }

    option.textContent = this.textContent;

    return option;
  })();

  _listItem = (() => {
    const listItem = document.createElement('div');
    listItem.role = 'option';

    listItem.textContent = this.textContent;

    return listItem;
  })();

  readonly #mutationObserver: MutationObserver;

  @property({reflect: true})
  get value(): string {
    return this._nativeOption.value;
  }
  set value(value: string) {
    this._nativeOption.value = value;
  }

  @state()
  get selected(): boolean {
    return this._nativeOption.selected;
  }
  set selected(selected: boolean) {
    if (this.selected === selected) {
      return;
    }

    this._nativeOption.selected = selected;

    if (selected) {
      this.classList.add('selected');
    } else {
      this.classList.remove('selected');
    }

    if (!this._select) {
      return;
    }

    this._select._button.setAttribute('aria-labelledby', this._listItem.id);
    this._select.empty = !this._nativeOption.textContent?.trim();
  }

  protected override renderDefaultTrailingIcon(): TemplateResult {
    return svg`
      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
      </svg>`;
  }

  @property({type: Boolean, attribute: 'selected'})
  // @ts-ignore
  private get _selectedAttribute(): boolean {
    return this._nativeOption.hasAttribute('selected');
  }
  // @ts-ignore
  private set _selectedAttribute(selected: boolean) {
    if (selected) {
      this._nativeOption.setAttribute('selected', '');
      return;
    }

    this._nativeOption.removeAttribute('selected');
  }

  _select!: UmSelect | null;

  constructor() {
    super();
    this.#mutationObserver = new MutationObserver(() => this.#updateContent())
    this.#mutationObserver.observe(this, {characterData: true, childList: true, subtree: true});
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.#handleClick);
    this.setAttribute('tabindex', '-1');

    this.#attach();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this.#handleClick);

    this._nativeOption.remove();

    if (!this._select) {
      return;
    }

    // eslint-disable-next-line no-self-assign
    this._select.value = this._select.value;
    this._select = null;
  }

  async #attach(): Promise<void> {

    this._select = this.parentElement instanceof UmSelect
      ? this.parentElement as UmSelect
      : null;

    await this.#setNativeOption();
  }

  #handleClick(e: Event) {
    if (!this._select) {
      return;
    }

    e.stopPropagation();

    this.setSelectedByUser();
  }

  setSelectedByUser() {
    if (!this._select) {
      return;
    }

    this._select.selectedOptions[0]?.classList.remove('selected');
    this.selected = true;
    // eslint-disable-next-line no-self-assign
    this._select.value = this._select.value;
    this._select.dispatchEvent(new InputEvent('input', {bubbles: true, composed: true}));
    this._select.dispatchEvent(new Event('change', {bubbles: true}));

    this._select._menu?.close();
  }

  #updateContent() {
    this._nativeOption.textContent = this.textContent;
    this._listItem.textContent = this.textContent;
  }

  async #setNativeOption(): Promise<void> {

    await this.updateComplete;
    this.#updateContent();

    this._select?._updateOptions();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-option': UmOption;
  }
}
