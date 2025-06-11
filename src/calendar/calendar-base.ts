import { CSSResultGroup } from '@lit/reactive-element/css-tag';

import { html, HTMLTemplateResult, LitElement } from 'lit';
import { DirectiveResult } from 'lit-html/directive.js';
import { ClassMapDirective } from 'lit-html/directives/class-map';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { styles } from './calendar-base.styles.js';
import { DefaultCalendarAdapter } from './default-calendar-adapter.js';

export abstract class UmCalendarBase extends LitElement {
  static override styles: CSSResultGroup = [styles];

  @state() weekDays: string[] = [];
  @state() dateRenderer: ((date: Date, day: string) => HTMLElement) | null = null;
  @property({ type: Boolean }) dateOutsideMonth = false;

  get year(): number {
    return this._displayingMonthDate.getFullYear();
  }

  set year(year: number) {
    this._displayingMonthDate.setFullYear(year);
    this._displayingMonthDate = new Date(this._displayingMonthDate);
  }

  get month(): number {
    return this._displayingMonthDate.getMonth();
  }

  set month(month: number) {
    this._displayingMonthDate.setMonth(month);
    this._displayingMonthDate = new Date(this._displayingMonthDate);
  }

  readonly #currentDate = new Date();
  @state() _displayingMonthDate: Date;

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

  override render(): HTMLTemplateResult {
    return html`
      <div>
        <u-button-set>
          <u-button class="month-button" type="button" variant="text">
            ${this.adapter.getMonth(this.#getDisplayingMonthDate())}
          </u-button>
          <u-icon-button class="previous-month-button" @click=${() => this.#addMonth(-1)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 -960 960 960"
              width="1em"
              fill="currentColor">
              <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
            </svg>
          </u-icon-button>
          <u-icon-button @click=${() => this.#addMonth(1)}>
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
      <div class="calendar ${this._getCalendarClassMap()}">${this.#renderWeekDays()}${this.#renderDays()}</div>
    `;
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
    return this._getDateFromIsoDate(`${this.year}-${this.month + 1}-1`);
  }

  #renderDays(): HTMLTemplateResult[] {
    const date = new Date(this._displayingMonthDate);

    date.setDate(date.getDate() - date.getDay());

    const month = this.month;
    const year = this.year;

    const daysTemplates: HTMLTemplateResult[] = [];

    do {
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

        const dateTemplate = dateOutsideMonth && !this.dateOutsideMonth
          ? null
          : html`
              <u-ripple></u-ripple>
              <span class="date">
                ${this.dateRenderer
                  ? this.dateRenderer(new Date(date), this.adapter.getDay(date))
                  : this.adapter.getDay(date)}
              </span>
            `;

        daysTemplates.push(html`
          <div
            class="calendar-item ${classes}"
            @click=${this.#handleDateClick(new Date(date))}>
            ${dateTemplate}
          </div>
        `);

        date.setDate(date.getDate() + 1);
      }
    } while (date.getMonth() <= month && date.getFullYear() <= year);

    return daysTemplates;
  }

  #handleDateClick(date: Date): () => void {
    return () => this._selectDate(date);
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
    this.weekDays = this.adapter.getWeekDays(this._innerLocale);
  }
}
