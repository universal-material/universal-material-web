import { svg, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UmMenuItem } from '../menu/menu-item.js';
import { styles } from './option.styles.js';
import { UmSelect } from './select.js';

import './select.js';

@customElement('u-option')
export class UmOption extends UmMenuItem {
  static override styles = [UmMenuItem.styles, styles];

  readonly #mutationObserver = new MutationObserver(() => this.#updateContent());

  #value = '';
  #selected = false;
  _nativeOption: HTMLOptionElement | null = null;

  @property({ reflect: true })
  get value(): string {
    return this.#value;
  }

  set value(value: string) {
    this.#value = value;

    if (this._nativeOption) {
      this._nativeOption.value = value;
    }
  }

  @property({ type: Boolean })
  get selected(): boolean {
    return this.#selected;
  }

  set selected(selected: boolean) {
    if (this.#selected === selected) {
      return;
    }

    this.#selected = selected;

    if (this._nativeOption) {
      this._nativeOption.selected = selected;
    }

    this._select?._updateEmpty();
  }

  protected override _getContainerClasses() {
    return {
      ...super._getContainerClasses(),
      selected: this.selected,
    };
  }

  protected override _renderDefaultTrailingIcon(): TemplateResult {
    return svg`
      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
      </svg>`;
  }

  get _select(): UmSelect | null {
    return this.parentElement?.tagName === 'U-SELECT'
      ? this.parentElement as UmSelect
      : null;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.#handleClick);
    this.setAttribute('tabindex', '-1');

    this.#mutationObserver.observe(this, {
      subtree: true,
      characterData: true,
      childList: true,
    });

    this.#updateContent();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this.#handleClick);
    this.#mutationObserver.disconnect();
  }

  #handleClick(e: Event) {
    if (!this._select) {
      return;
    }

    e.stopPropagation();

    this._setSelectedByUser();
  }

  _setSelectedByUser() {

    this.selected = true;

    if (!this._select) {
      return;
    }

    this._select.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
    this._select.dispatchEvent(new Event('change', { bubbles: true }));

    this._select._updateEmpty();
    this._select._syncSelectedOptions();
    this._select._menu?.close();
  }

  #updateContent() {

    if (this._nativeOption) {
      this._nativeOption.textContent = this.textContent;
    }

    this._select?._updateEmpty();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-option': UmOption;
  }
}
