import { customElement, property, state } from 'lit/decorators.js';

import { UmMenuItem } from '../menu/menu-item.js';
import { UmSelect } from './select.js';

import './select.js';

@customElement('u-option')
export class UmOption extends UmMenuItem {

  #value: string = '';

  @property({reflect: true})
  get value(): string {
    return this.#value;
  }
  set value(value: string) {

    if (typeof value !== 'string') {
      value = String(value);
      this.value = value;
      return;
    }

    this.#value = value;

    if (!this._nativeOption) {
      return;
    }

    this._nativeOption.value = value;
  }

  @state()
  get selected(): boolean {
    return this._nativeOption?.selected === true;
  }
  set selected(selected: boolean) {
    if (selected === this.selected) {
      return;
    }

    this.#setSelected(selected);
  }

  #selectedAttribute = false;
  @property({type: Boolean, attribute: 'selected'})
  // @ts-ignore
  get _selectedAttribute(): boolean {
    return this.#selectedAttribute;
  }
  set _selectedAttribute(selected: boolean) {
    this.#selectedAttribute = selected;

    if (!this._nativeOption) {
      return;
    }

    if (selected) {
      this._nativeOption.setAttribute('selected', '');

      this.select?.requestUpdate();
      return;
    }

    this._nativeOption.removeAttribute('selected');
  }

  private get _nativeOption(): HTMLOptionElement | null {
    if (!this.select) {
      return null;
    }

    const index = this.select.options.indexOf(this);
    return this.select.nativeOptions[index];
  }

  select!: UmSelect | null;

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.#handleClick);
    this.setAttribute('tabindex', '-1');

    this.select = this.parentElement!.tagName === 'U-SELECT'
      ? this.parentElement as UmSelect
      : null;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this.#handleClick);
    this.select = null;
  }

  #handleClick(e: Event) {
    if (!this.select) {
      return;
    }

    e.stopPropagation();

    this.#select();
    this.select.menu?.close();

    this.select.dispatchEvent(new InputEvent('input', {bubbles: true, composed: true}));
    this.select.dispatchEvent(new Event('change', {bubbles: true}));
  }

  #setSelected(selected: boolean) {
    if (!this._nativeOption) {
      return;
    }

    this._nativeOption.selected = selected;
    this.select!.empty = !this._nativeOption.textContent?.trim();
  }

  #select() {
    this.#setSelected(true);

    this.select!.value = this.select!.value;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-option': UmOption;
  }
}
