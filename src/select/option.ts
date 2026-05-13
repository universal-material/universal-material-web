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

  /**
   * The value submitted with the form when this option is selected
   */
  @property({ reflect: true })
  get value(): string {
    return this.#value;
  }

  set value(value: string) {
    if (this.#value === value) {
      return;
    }

    this.#value = value;
    this.#select?._scheduleSync();
  }

  /**
   * Whether the option is currently selected in the parent `u-select`
   */
  @property({ type: Boolean })
  get selected(): boolean {
    return this.#selected;
  }

  set selected(selected: boolean) {
    if (this.#selected === selected) {
      return;
    }

    this.#selected = selected;
    this.#select?._scheduleSync();
  }

  get defaultSelected(): boolean {
    return this.hasAttribute('selected');
  }

  set defaultSelected(value: boolean) {
    this.toggleAttribute('selected', value);
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

  get #select(): UmSelect | null {
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

  override attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    super.attributeChangedCallback(name, _old, value);

    if (name === 'disabled') {
      this.#select?._scheduleSync();
    }
  }

  readonly #handleClick = (e: Event): void => {
    if (!this.#select || this.disabled) {
      return;
    }

    e.stopPropagation();
    this.#select._setSelectedByUser(this);
  };

  _setSelectedByUser() {
    if (!this.#select || this.disabled) {
      return;
    }

    this.#select._setSelectedByUser(this);
  }

  #updateContent(): void {
    this.#select?._renderOptionRelatedElements();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-option': UmOption;
  }
}
