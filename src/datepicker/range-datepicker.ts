import { CSSResultGroup } from '@lit/reactive-element/css-tag';

import { html, HTMLTemplateResult, nothing, svg } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';

import { UmRangeCalendar } from '../calendar/range-calendar.js';
import { UmMenu } from '../menu/menu.js';
import { UmNativeTextFieldWrapper } from '../shared/char-count-text-field/native-text-field-wrapper.js';
import { UmTextFieldBase } from '../shared/text-field-base/text-field-base.js';

import { styles as textFieldStyles } from '../text-field/text-field.styles.js';
import { styles } from './datepicker.styles.js';
import { DatepickerFormat, formatIsoDateRange } from './format.js';

import '../calendar/range-calendar.js';
import '../menu/menu.js';

const ISO_DATE_RANGE = /^\d{4}-\d{2}-\d{2} - \d{4}-\d{2}-\d{2}$/;

@customElement('u-range-datepicker')
export class UmRangeDatepicker extends UmNativeTextFieldWrapper {
  static override styles: CSSResultGroup = [UmTextFieldBase.styles, textFieldStyles, styles];

  /**
   * The BCP 47 locale tag forwarded to the underlying range calendar and used
   * for non-editable display formatting.
   * When `null`, the calendar falls back to the browser's `navigator.language`.
   */
  @property() locale: string | null = null;

  /**
   * Format used when displaying the value while the field is not editable.
   * Accepts `'short'`, `'medium'`, `'long'`, `'full'`, `'iso'`, or an
   * `Intl.DateTimeFormatOptions` object. Each end of the range is formatted
   * independently and joined with ` - `.
   */
  @property() format: DatepickerFormat = 'short';

  /**
   * Whether the input accepts manually-typed ranges. When `false` (default),
   * the field is read-only and clicking anywhere opens the calendar popover.
   * When `true`, the input accepts text in the `YYYY-MM-DD - YYYY-MM-DD` format;
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
  @query('u-range-calendar', true) private _calendar!: UmRangeCalendar;
  @query('.trailing-icon', true) private _trailingSlot!: HTMLSlotElement;

  protected override renderControl(): HTMLTemplateResult {
    const displayValue = this.editable
      ? this._value
      : formatIsoDateRange(this._value, this.format, this.locale);

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
        `}
      <div class="input">
        <input
          type="text"
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
    return svg`
      <svg xmlns="http://www.w3.org/2000/svg" height="1.25em" viewBox="0 -960 960 960" width="1.25em" fill="currentColor">
        <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/>
      </svg>`;
  }

  protected override renderAfterContent() {
    return html`
      <u-menu
        positioning=${this.menuPositioning}
        autoclose="outside"
        anchor-corner="end-start"
        direction="down-start"
        allow-overflow
        manualFocus
        @click=${this.#stopPropagation}>
        <u-range-calendar
          .value=${this._value}
          .locale=${this.locale}
          @input=${this.#handleCalendarInput}
          @change=${this.#handleCalendarChange}></u-range-calendar>
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

    if (ISO_DATE_RANGE.test(this._value)) {
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
    const value = (e.target as UmRangeCalendar).value ?? '';
    this.value = value;
    this.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
  };

  #handleCalendarChange = (e: Event): void => {
    e.stopPropagation();

    if (!ISO_DATE_RANGE.test(this._value)) {
      return;
    }

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
    'u-range-datepicker': UmRangeDatepicker;
  }
}
