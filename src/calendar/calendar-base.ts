import { CSSResultGroup } from '@lit/reactive-element/css-tag';

import { html, HTMLTemplateResult, LitElement } from 'lit';
import { DirectiveResult } from 'lit-html/directive.js';
import { ClassMapDirective } from 'lit-html/directives/class-map';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { styles } from './calendar-base.styles.js';
import { DefaultCalendarAdapter } from './default-calendar-adapter.js';

export type CalendarView = 'day' | 'month' | 'year';

export abstract class CalendarBase extends LitElement {
  static override styles: CSSResultGroup = [styles];

  @state() weekDays: string[] = [];
  @state() private _firstDayOfWeek = 0;
  @state() dateRenderer: ((date: Date, day: string) => HTMLElement) | null = null;
  /**
   * Whether to render dates from the previous and next months that
   * fall inside the displayed weeks
   */
  @property({ type: Boolean }) dateOutsideMonth = false;

  /**
   * Number of years displayed per page in the year picker view.
   */
  @property({ type: Number, attribute: 'year-range' }) yearRange = 24;

  get year(): number {
    return this._displayingMonthDate.getFullYear();
  }

  set year(year: number) {
    this._displayingMonthDate = new Date(year, this._displayingMonthDate.getMonth(), 1);
  }

  get month(): number {
    return this._displayingMonthDate.getMonth();
  }

  set month(month: number) {
    this._displayingMonthDate = new Date(this._displayingMonthDate.getFullYear(), month, 1);
  }

  readonly #currentDate = new Date();
  @state() _displayingMonthDate: Date;
  @state() view: CalendarView = 'day';
  @state() _yearPageStart = 0;

  /**
   * The BCP 47 locale tag used to format month names and weekdays.
   * When `null`, falls back to the browser's `navigator.language`.
   */
  @property() locale: string | null = null;
  _innerLocale: string = navigator.language;
  adapter = new DefaultCalendarAdapter();

  protected constructor() {
    super();

    this.#currentDate.setHours(0);
    this.#currentDate.setMinutes(0);
    this.#currentDate.setSeconds(0);
    this.#currentDate.setMilliseconds(0);
    this._displayingMonthDate = new Date(this.#currentDate);
    this._displayingMonthDate.setDate(1);
    this._yearPageStart = this.#computeYearPageStart(this.year);
  }

  override connectedCallback() {
    super.connectedCallback();

    this.#setLocaleDependantProperties();

    window.addEventListener('languagechange', () => {
      if (this.locale !== null) {
        return;
      }

      this._innerLocale = navigator.language;
      this.#setLocaleDependantProperties();
    });
  }

  override willUpdate(changed: Map<string, unknown>): void {
    if (changed.has('locale')) {
      this._innerLocale = this.locale ?? navigator.language;
      this.#setLocaleDependantProperties();
    }
  }

  override render(): HTMLTemplateResult {
    return html`
      <div>
        <u-button-set>
          <u-button class="month-button" type="button" variant="text" @click=${this.#toggleYearView}>
            ${this.#getHeaderLabel()}
            <svg
              class="month-button-icon ${this.view !== 'day' ? 'open' : ''}"
              xmlns="http://www.w3.org/2000/svg"
              height="1.5em"
              viewBox="0 -960 960 960"
              width="1.5em"
              fill="currentColor">
              <path d="M480-360 280-560h400L480-360Z" />
            </svg>
          </u-button>
          <u-icon-button class="previous-month-button" @click=${this.#handlePrevClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 -960 960 960"
              width="1em"
              fill="currentColor">
              <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
            </svg>
          </u-icon-button>
          <u-icon-button @click=${this.#handleNextClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 -960 960 960"
              width="1em"
              fill="currentColor">
              <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
            </svg>
          </u-icon-button>
        </u-button-set>
      </div>
      ${this.#renderBody()}
    `;
  }

  #renderBody(): HTMLTemplateResult {
    if (this.view === 'year') {
      return html`<div class="year-grid">${this.#renderYears()}</div>`;
    }

    if (this.view === 'month') {
      return html`<div class="month-grid">${this.#renderMonths()}</div>`;
    }

    return html`
      <div class="calendar ${this._getCalendarClassMap()}">${this.#renderWeekDays()}${this.#renderDays()}</div>
    `;
  }

  #getHeaderLabel(): string {
    if (this.view === 'month') {
      return this.adapter.getYear(this.#getDisplayingMonthDate());
    }

    return this.adapter.getMonth(this.#getDisplayingMonthDate());
  }

  #renderWeekDays(): HTMLTemplateResult[] {
    return this.weekDays.map(
      weekDay =>
        html`
          <div class="calendar-item">
            <span class="week-day">${weekDay}</span>
          </div>
        `,
    );
  }

  #getDisplayingMonthDate(): Date {
    return new Date(this.year, this.month, 1);
  }

  #renderDays(): HTMLTemplateResult[] {
    const year = this.year;
    const month = this.month;
    const firstOfMonth = new Date(year, month, 1);
    const diffToFirstDayOfWeek = (firstOfMonth.getDay() - this._firstDayOfWeek + 7) % 7;
    const date = new Date(year, month, 1 - diffToFirstDayOfWeek);

    const daysTemplates: HTMLTemplateResult[] = [];

    for (let row = 0; row < 6; row++) {
      for (let i = 0; i < 7; i++) {
        const dateOutsideMonth = date.getMonth() !== month;

        const dateClasses = this._getSelectedDateClasses(date);

        if (!Object.keys(dateClasses).length && this.#currentDate.getTime() === date.getTime()) {
          dateClasses['current-date'] = true;
        }

        if (dateOutsideMonth) {
          dateClasses['date-outside-month'] = true;
        }

        const classes = classMap(dateClasses);

        const renderDate = !dateOutsideMonth || this.dateOutsideMonth;
        const dateTemplate = renderDate
          ? html`
              <u-ripple></u-ripple>
              <span class="date">
                ${this.dateRenderer
                  ? this.dateRenderer(new Date(date), this.adapter.getDay(date))
                  : this.adapter.getDay(date)}
              </span>
            `
          : null;

        const click = renderDate ? this.#handleDateClick(new Date(date)) : null;

        daysTemplates.push(html`
          <div
            class="calendar-item ${classes}"
            @click=${click}>
            ${dateTemplate}
          </div>
        `);

        date.setDate(date.getDate() + 1);
      }
    }

    return daysTemplates;
  }

  #renderYears(): HTMLTemplateResult[] {
    const templates: HTMLTemplateResult[] = [];
    const currentYear = this.#currentDate.getFullYear();
    const selectedYear = this.year;

    for (let i = 0; i < this.yearRange; i++) {
      const year = this._yearPageStart + i;
      const classes = classMap({
        'year-cell': true,
        'current-year': year === currentYear && year !== selectedYear,
        'selected-year': year === selectedYear,
      });

      templates.push(html`
        <div class=${classes} @click=${this.#handleYearClick(year)}>
          <span class="year-label">
            <u-ripple></u-ripple>
            ${year}
          </span>
        </div>
      `);
    }

    return templates;
  }

  #renderMonths(): HTMLTemplateResult[] {
    const templates: HTMLTemplateResult[] = [];
    const currentYear = this.#currentDate.getFullYear();
    const currentMonth = this.#currentDate.getMonth();
    const selectedMonth = this.month;
    const displayedYear = this.year;

    for (let month = 0; month < 12; month++) {
      const isCurrent = displayedYear === currentYear && month === currentMonth;
      const isSelected = month === selectedMonth;

      const classes = classMap({
        'month-cell': true,
        'current-month': isCurrent && !isSelected,
        'selected-month': isSelected,
      });

      templates.push(html`
        <div class=${classes} @click=${this.#handleMonthClick(month)}>
          <span class="month-label">
            <u-ripple></u-ripple>
            ${this.adapter.getMonthShort(month, this._innerLocale)}
          </span>
        </div>
      `);
    }

    return templates;
  }

  #handleDateClick(date: Date): () => void {
    return () => this._selectDate(date);
  }

  #handleYearClick(year: number): () => void {
    return () => {
      this.year = year;
      this.view = 'month';
    };
  }

  #handleMonthClick(month: number): () => void {
    return () => {
      this.month = month;
      this.view = 'day';
    };
  }

  #toggleYearView = (): void => {
    if (this.view === 'day') {
      this._yearPageStart = this.#computeYearPageStart(this.year);
      this.view = 'year';
      return;
    }

    if (this.view === 'month') {
      this._yearPageStart = this.#computeYearPageStart(this.year);
      this.view = 'year';
      return;
    }

    this.view = 'day';
  };

  #handlePrevClick = (): void => {
    if (this.view === 'year') {
      this._yearPageStart -= this.yearRange;
      return;
    }

    if (this.view === 'month') {
      this.year -= 1;
      return;
    }

    this.#addMonth(-1);
  };

  #handleNextClick = (): void => {
    if (this.view === 'year') {
      this._yearPageStart += this.yearRange;
      return;
    }

    if (this.view === 'month') {
      this.year += 1;
      return;
    }

    this.#addMonth(1);
  };

  #computeYearPageStart(year: number): number {
    return year - Math.floor(this.yearRange / 2);
  }

  protected _getCalendarClassMap(): DirectiveResult<typeof ClassMapDirective> | null {
    return null;
  }

  protected abstract _selectDate(date: Date): void;
  protected abstract _getSelectedDateClasses(date: Date): Record<string, boolean>;

  protected _getDateFromIsoDate(isoDate: string): Date {
    const date = new Date(isoDate);
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    date.setTime(date.getTime() + offsetMs);

    return date;
  }

  protected _getDateString(date: Date | null): string {

    if (!date) {
      return '';
    }

    return Intl
      .DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .format(date);
  }

  protected _getDateFromString(dateString: string): Date | null {
    if (!dateString) {
      return null;
    }

    const dateTime = Date.parse(dateString);

    if (!dateTime && dateTime !== 0) {
      return null;
    }

    return this._getDateFromIsoDate(dateString);
  }

  #addMonth(value: number): void {
    this.month += value;
  }

  #setLocaleDependantProperties(): void {
    this.adapter.locale = this._innerLocale;
    this.weekDays = this.adapter.getWeekDays(this._innerLocale);
    this._firstDayOfWeek = this.adapter.getFirstDayOfWeek(this._innerLocale);
  }
}
