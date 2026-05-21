import { CSSResultGroup } from '@lit/reactive-element/css-tag';

import { html, HTMLTemplateResult, nothing, svg } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';

import { UmCalendar } from '../calendar/calendar.js';
import { UmMenu } from '../menu/menu.js';
import { UmNativeTextFieldWrapper } from '../shared/char-count-text-field/native-text-field-wrapper.js';
import { UmTextFieldBase } from '../shared/text-field-base/text-field-base.js';

import { styles as textFieldStyles } from '../text-field/text-field.styles.js';
import { styles } from './datepicker.styles.js';
import { DatepickerFormat, formatIsoDate } from './format.js';

import '../button/icon-button.js';
import '../calendar/calendar.js';
import '../menu/menu.js';
import '../ripple/ripple.js';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

@customElement('u-datepicker')
export class UmDatepicker extends UmNativeTextFieldWrapper {
  static override styles: CSSResultGroup = [UmTextFieldBase.styles, textFieldStyles, styles];

  /**
   * The BCP 47 locale tag forwarded to the underlying calendar and used for
   * non-editable display formatting.
   * When `null`, the calendar falls back to the browser's `navigator.language`.
   */
  @property() locale: string | null = null;

  /**
   * Format used when displaying the value while the field is not editable.
   * Accepts the named presets `'short'`, `'medium'`, `'long'`, `'full'`,
   * the literal `'iso'` (keeps the ISO `YYYY-MM-DD` value), or an
   * `Intl.DateTimeFormatOptions` object for custom formatting.
   * In editable mode the input uses the browser's native `type="date"` mask
   * and ignores this property.
   */
  @property() format: DatepickerFormat = 'short';

  /**
   * Whether the input accepts manually-typed dates. When `false` (default),
   * the field is read-only and clicking anywhere opens the calendar popover.
   * When `true`, the input uses native `type="date"` and accepts keyboard input;
   * the calendar popover is opened via the trailing icon.
   */
  @property({ type: Boolean, reflect: true }) editable = false;

  /**
   * Whether the input is read-only. When set, manual typing is disabled even
   * if `editable` is `true`; the calendar popover remains available.
   */
  @property({ type: Boolean, reflect: true }) readOnly = false;

  /**
   * The positioning strategy used by the calendar popover. Use `'fixed'`
   * when the datepicker is rendered inside a clipped/scrollable container.
   */
  @property({ reflect: true, attribute: 'menu-positioning' }) menuPositioning: 'relative' | 'fixed' = 'relative';

  @query('input') input!: HTMLInputElement;
  @query('u-menu', true) private _menu!: UmMenu;
  @query('u-calendar', true) private _calendar!: UmCalendar;
  @query('.trailing-icon', true) private _trailingSlot!: HTMLSlotElement;

  protected override renderControl(): HTMLTemplateResult {
    const displayValue = this.editable
      ? this._value
      : formatIsoDate(this._value, this.format, this.locale);

    return html`
      ${this.editable
        ? nothing
        : html`
          <button
            class="trigger"
            type="button"
            aria-haspopup="dialog"
            ?disabled=${this.disabled}
            @click=${this.#toggleMenu}></button>
          <u-ripple ?disabled=${this.disabled}></u-ripple>
        `}
      <div class="input">
        <input
          type=${this.editable ? 'date' : 'text'}
          part="input"
          id=${this.id || nothing}
          aria-labelledby="label"
          aria-describedby="supporting-text"
          aria-haspopup="dialog"
          tabindex=${this.editable ? nothing : -1}
          ?readonly=${this.readOnly || !this.editable}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder ?? nothing}
          .value=${live(displayValue)}
          @input=${this._handleInput}
          @keydown=${this.#handleKeyDown} />
      </div>
    `;
  }

  protected override renderDefaultTrailingIcon() {
    const icon = svg`
      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
        <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/>
      </svg>`;

    // In editable mode the field itself is typeable, so the icon must be a
    // dedicated button for opening the calendar. In non-editable mode the
    // .trigger button covers the whole field, so the icon is just visual.
    return this.editable
      ? html`<u-icon-button
          type="button"
          aria-haspopup="dialog"
          aria-label="Open calendar"
          ?disabled=${this.disabled}
          @click=${this.#toggleMenu}>${icon}</u-icon-button>`
      : icon;
  }

  protected override renderAfterContent() {
    return html`
      <u-menu
        positioning=${this.menuPositioning}
        autoclose="outside"
        anchor-corner="end-start"
        direction="down-end"
        allow-overflow
        manualFocus
        @click=${this.#stopPropagation}>
        <u-calendar
          .value=${this._value}
          .locale=${this.locale}
          @input=${this.#handleCalendarInput}></u-calendar>
      </u-menu>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    void this.#attach();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._trailingSlot?.removeEventListener('click', this.#toggleMenu);
  }

  protected override _handleInput(): void {
    super._handleInput();

    if (ISO_DATE.test(this._value)) {
      this._calendar.value = this._value;
    }

    this.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
  }

  #handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'ArrowDown' && !this._menu.open) {
      e.preventDefault();
      this._menu.show();
      return;
    }

    if (e.key === 'Escape' && this._menu.open) {
      e.preventDefault();
      this._menu.close();
      return;
    }

    this._handleKeyDown(e);
  };

  #handleCalendarInput = (e: Event): void => {
    e.stopPropagation();
    const value = (e.target as UmCalendar).value;
    this.value = value;
    this.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true }));
    this._menu.close();
  };

  #stopPropagation = (e: Event): void => {
    e.stopPropagation();
  };

  #toggleMenu = (): void => {
    if (this.disabled) {
      return;
    }
    this._menu.toggle();
  };

  async #attach(): Promise<void> {
    await this.updateComplete;
    this._menu.anchorElement = this._container;
    this._trailingSlot.addEventListener('click', this.#toggleMenu);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-datepicker': UmDatepicker;
  }
}
