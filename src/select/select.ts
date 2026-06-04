import { html, render, svg, TemplateResult } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { html as staticHtml } from 'lit/static-html.js';

import { Menu } from '../menu/menu.js';
import { MenuField } from '../shared/menu-field/menu-field.js';
import { FieldValidity, TextFieldBase } from '../shared/text-field-base/text-field-base.js';
import { Option } from './option.js';
import { SelectNavigationController } from './select-navigation-controller.js';
import { styles } from './select.styles.js';

import './option.js';

@customElement('u-select')
export class Select extends TextFieldBase implements MenuField {
  static override styles = [TextFieldBase.styles, styles];

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
  #syncScheduled = false;
  #selectedIndex = -1;
  #lastSyncSignature = '';
  // The last value the consumer intentionally selected (via the `value`/
  // `selectedIndex` setters, a user click, or an `<u-option selected>`). It is
  // re-applied whenever the options change so the selection survives a
  // framework re-rendering the `<u-option>` nodes — which otherwise drops the
  // per-element `.selected` flag. `null` = no intentional selection yet (the
  // first-enabled fallback is not sticky, preserving native parity).
  #desiredValue: string | null = null;

  @query('u-menu', true) _menu!: Menu;
  @query('.button', true) _button!: HTMLButtonElement;
  @query('.input', true) _input!: HTMLElement;

  /**
   * The positioning strategy used by the dropdown menu. Use `'fixed'`
   * when the select is rendered inside a clipped/scrollable container.
   */
  @property({ reflect: true, attribute: 'menu-positioning' }) menuPositioning: 'relative' | 'fixed' = 'relative';

  /**
   * The `value` of the selected option. Mirrors the native `<select>`'s
   * `value` IDL property — there is no `value` *attribute*; set the initial
   * selection with `<u-option selected>`.
   *
   * Setting a value whose option isn't present yet (e.g. before an async list
   * loads) is remembered and applied once that option appears.
   */
  @state()
  get value(): string {
    return this._options[this.#selectedIndex]?.value ?? '';
  }

  set value(value: string) {
    this.#desiredValue = value;
    this.#commitIndex(this._options.findIndex(o => o.value === value));
  }

  /**
   * The index of the selected option. When there's no selected option the value is `-1`.
   */
  @state()
  get selectedIndex(): number {
    return this.#selectedIndex;
  }

  set selectedIndex(index: number) {
    const len = this._options.length;
    const target = index >= 0 && index < len ? index : -1;
    this.#desiredValue = target >= 0 ? this._options[target].value : null;
    this.#commitIndex(target);
  }

  get _options(): Option[] {
    return Array.from(this.querySelectorAll<Option>(':scope > u-option'));
  }

  get _menuItems(): Option[] {
    return this._options;
  }

  get selectedOptions(): Option[] {
    const option = this._options[this.#selectedIndex];
    return option ? [option] : [];
  }

  protected override renderControl(): TemplateResult {
    return staticHtml`
      <button 
         class="button"
         role="combobox"
         aria-haspopup="listbox"
         aria-controls="list"
         aria-expanded="false"
         ?disabled=${this.disabled}></button>
      <div class="input">
        <span class="display"></span>
      </div>`;
  }

  protected override renderAfterContent(): TemplateResult {
    return html`
      <u-menu positioning="${this.menuPositioning}">
        <slot @slotchange=${this.#handleSlotChange}></slot>
      </u-menu>
    `;
  }

  protected override renderDefaultTrailingIcon(): TemplateResult {
    return svg`
      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
        <path d="M480-360 280-560h400L480-360Z"/>
      </svg>`;
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

  formResetCallback(): void {
    for (const o of this._options) {
      o.selected = o.defaultSelected;
    }

    // Drop the sticky value so the reset honors `<u-option selected>` defaults.
    this.#desiredValue = null;
    this.#syncFromOptions();
  }

  formStateRestoreCallback(inFormState: string | null): void {
    this.value = inFormState ?? '';
  }

  _scheduleSync(): void {
    if (this.#syncScheduled || !this.#connected) {
      return;
    }

    this.#syncScheduled = true;
    queueMicrotask(() => {
      try {
        if (this.#computeSignature() !== this.#lastSyncSignature) {
          this.#syncFromOptions();
        }
      } finally {
        this.#syncScheduled = false;
      }
    });
  }

  _setSelectedByUser(option: Option): void {
    const previousIndex = this.#selectedIndex;
    const newIndex = this._options.indexOf(option);

    if (newIndex < 0) {
      return;
    }

    this.#desiredValue = option.value;
    this.#commitIndex(newIndex);

    if (previousIndex !== newIndex) {
      this.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }

    this._menu.close();
  }

  protected override _getValidity(): FieldValidity {
    const valueMissing = this.required && this.value === '';

    return {
      flags: { valueMissing },
      message: valueMissing ? 'Please select an item in the list.' : '',
      anchor: this._button,
    };
  }

  /** Re-renderiza display e listbox a11y quando o textContent de uma option muda. */
  _renderOptionRelatedElements(): void {
    // An option can call this from its own connectedCallback before the select
    // has finished `#attach` (its `_input`/list aren't wired yet). Skip until
    // the select is connected and rendered — `#attach` re-runs this afterwards.
    if (!this.#connected || !this._input) {
      return;
    }

    this.#renderAccessibilityList();
    this.#updateDisplay();
  }

  #commitIndex(index: number): void {
    const options = this._options;
    const target = index >= 0 ? options[index] : null;

    for (const o of options) {
      o.selected = o === target;
    }

    this.#selectedIndex = target ? index : -1;
    this.#lastSyncSignature = this.#computeSignature();
    this.#emitState();
  }

  #syncFromOptions(): void {
    const options = this._options;

    // 1. Sticky: re-apply the last intentional value if its option is (still or
    //    newly) present. This keeps the selection across option re-renders and
    //    applies a value set before its option existed.
    if (this.#desiredValue !== null) {
      const desiredIndex = options.findIndex(o => o.value === this.#desiredValue && !o.disabled);

      if (desiredIndex >= 0) {
        this.#commitIndex(desiredIndex);
        return;
      }
    }

    // 2. Authored default: the last `<u-option selected>` — read the *attribute*
    //    (`defaultSelected`), not the runtime `.selected` flag, so the
    //    first-enabled fallback below can't be mistaken for an authored choice
    //    on a later sync. An authored choice is intentional, so make it sticky.
    let authoredIndex = -1;

    for (let i = 0; i < options.length; i++) {
      if (options[i].defaultSelected) {
        authoredIndex = i;
      }
    }

    if (authoredIndex >= 0) {
      this.#desiredValue = options[authoredIndex].value;
      this.#commitIndex(authoredIndex);
      return;
    }

    // 3. First-enabled fallback: a default, not an intentional choice, so it is
    //    left non-sticky — a later reorder/rebuild follows the native <select>.
    this.#commitIndex(options.length ? options.findIndex(o => !o.disabled) : -1);
  }

  #computeSignature(): string {
    return this._options
      .map(o => `${o.selected ? 1 : 0}:${o.disabled ? 1 : 0}:${o.value}`)
      .join('|');
  }

  #emitState(): void {
    this.elementInternals.setFormValue(this.value || null);
    this.#renderAccessibilityList();
    this.#updateDisplay();
    this.#updateEmpty();
    this.requestUpdate();
  }

  #updateEmpty(): void {
    const o = this._options[this.#selectedIndex];
    this.empty = !o?.textContent?.trim();
  }

  #renderAccessibilityList(): void {
    const selectedIdx = this.#selectedIndex;
    render(
      map(this._options, (option, index) =>
        html`<div role="option"
                  id=${`item-${index + 1}`}
                  aria-selected=${index === selectedIdx ? 'true' : 'false'}>
               ${option.textContent}
             </div>`),
      this.#list);
  }

  #updateDisplay(): void {
    if (!this._input) {
      return;
    }

    this._input.textContent = this._options[this.#selectedIndex]?.textContent?.trim() ?? '';
  }

  #setMenuWidthProperty(): void {
    this.style.setProperty('--_menu-width', `${this.clientWidth}px`);
  }

  readonly #handleSlotChange = (): void => {
    this.#syncFromOptions();
  };

  readonly #handleClick = (e: MouseEvent) => {
    this._menu.toggle();

    if (!this._menu.open || this.#selectedIndex === -1) {
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
    this._options[this.#selectedIndex]?.scrollIntoView({ block: 'nearest' });
  };

  readonly #handleMenuClose = () => {
    this._button.setAttribute('aria-expanded', 'false');
    this.#navigationController.blurMenu();
  };

  async #attach(): Promise<void> {
    this.#resizeObserver.observe(this);
    this._renderOptionRelatedElements();

    await this.updateComplete;

    this.#navigationController.attach(this);

    this._input.appendChild(this.#list);
    this._button.addEventListener('click', this.#handleClick);

    this._menu.anchorElement = this._container;
    this._menu.addEventListener('click', this.#handleMenuClick);
    this._menu.addEventListener('open', this.#handleMenuOpen);
    this._menu.addEventListener('opened', this.#handleMenuOpened);
    this._menu.addEventListener('close', this.#handleMenuClose);

    this.#syncFromOptions();
  }

  #detach(): void {
    this.#resizeObserver.disconnect();
    this.#list.remove();
    this.#navigationController.detach();
    this.#connected = false;
    this._button.removeEventListener('click', this.#handleClick);
    this._menu.removeEventListener('click', this.#handleMenuClick);
    this._menu.removeEventListener('open', this.#handleMenuOpen);
    this._menu.removeEventListener('opened', this.#handleMenuOpened);
    this._menu.removeEventListener('close', this.#handleMenuClose);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-select': Select;
  }
}
