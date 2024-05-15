import { customElement, property, state } from 'lit/decorators.js';

import { UmMenuItem } from '../menu/menu-item.js';
import { UmSelect } from './select.js';

import './select.js';

@customElement('u-option')
export class UmOption extends UmMenuItem {

  #nativeOption: HTMLOptionElement = document.createElement('option');
  #mutationObserver: MutationObserver | null = null;

  @property({reflect: true})
  get value(): string {
    return this.#nativeOption.value;
  }
  set value(value: string) {
    this.#nativeOption.value = value;
  }

  @state()
  get selected(): boolean {
    return this.#nativeOption.selected;
  }
  set selected(selected: boolean) {
    if (this.selected === selected) {
      return;
    }

    this.#nativeOption.selected = selected;

    if (this.#select) {
      this.#select.empty = !this.#nativeOption.textContent?.trim();
    }
  }

  @property({type: Boolean, attribute: 'selected'})
  // @ts-ignore
  private get _selectedAttribute(): boolean {
    return this.#nativeOption.hasAttribute('selected');
  }
  // @ts-ignore
  private set _selectedAttribute(selected: boolean) {
    if (selected) {
      this.#nativeOption.setAttribute('selected', '');
      return;
    }

    this.#nativeOption.removeAttribute('selected');
  }

  #select!: UmSelect | null;

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.#handleClick);
    this.setAttribute('tabindex', '-1');

    this.#attach();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this.#handleClick);

    this.#mutationObserver!.disconnect();
    this.#mutationObserver = null;
    this.#nativeOption.remove();

    if (!this.#select) {
      return;
    }

    // eslint-disable-next-line no-self-assign
    this.#select.value = this.#select.value;
    this.#select = null;
  }

  async #attach(): Promise<void> {

    this.#select = this.parentElement!.tagName === 'U-SELECT'
      ? this.parentElement as UmSelect
      : null;

    if (!this.#select) {
      return;
    }

    this.#mutationObserver = new MutationObserver(() => this.#updateContent())
    this.#mutationObserver.observe(this, {characterData: true, childList: true, subtree: true});

    await this.#setNativeOption();
  }

  #handleClick(e: Event) {
    if (!this.#select) {
      return;
    }

    e.stopPropagation();

    this.selected = true;
    // eslint-disable-next-line no-self-assign
    this.#select.value = this.#select.value;
    this.#select.dispatchEvent(new InputEvent('input', {bubbles: true, composed: true}));
    this.#select.dispatchEvent(new Event('change', {bubbles: true}));

    this.#select.menu?.close();
  }

  #updateContent() {
    this.#nativeOption.textContent = this.textContent;
  }

  async #setNativeOption(): Promise<void> {
    if (this.hasAttribute('selected')) {
      this.#nativeOption.setAttribute('selected', '');
    } else {
      this.#nativeOption.removeAttribute('selected');
    }

    this.#select!.nativeSelect.appendChild(this.#nativeOption);

    await this.updateComplete;
    this.#updateContent();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-option': UmOption;
  }
}
