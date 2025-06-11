import { CSSResultGroup } from '@lit/reactive-element/css-tag';

import { DirectiveResult } from 'lit-html/directive.js';
import { ClassMapDirective } from 'lit-html/directives/class-map.js';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { UmCalendarBase } from './calendar-base';
import { styles } from './range-calendar.styles.js';

@customElement('u-range-calendar')
export class UmRangeCalendar extends UmCalendarBase {
  static override styles: CSSResultGroup = [styles, UmCalendarBase.styles];

  @state() startDateValue: Date | null = null;
  @state() endDateValue: Date | null = null;

  @property()
  get value(): string | null {
    if (!this.startDateValue && !this.endDateValue) {
      return '';
    }

    return `${this._getDateString(this.startDateValue)} - ${this._getDateString(this.endDateValue)}`;
  }

  set value(value: string) {
    if (!value) {
      this.startDateValue = null;
      this.endDateValue = null;
      return;
    }

    const values = value.split(' - ');

    if (values.length !== 2) {
      this.startDateValue = null;
      this.endDateValue = null;
      return;
    }

    const startDateString = values[0];
    const endDateString = values[1];

    this.startDateValue = this._getDateFromString(startDateString);
    this.endDateValue = this._getDateFromString(endDateString);
  }

  #setStartEndDates(startDate: Date | null, endDate: Date | null): void {
    this.startDateValue = startDate;
    this.endDateValue = endDate;

    this.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  protected override _selectDate(date: Date): void {
    if (!this.startDateValue || !!this.endDateValue) {
      this.#setStartEndDates(date, null);
      return;
    }

    if (date > this.startDateValue) {
      this.#setStartEndDates(this.startDateValue, date);
      return;
    }

    this.#setStartEndDates(date, this.startDateValue);
  }

  protected override _getCalendarClassMap(): DirectiveResult<typeof ClassMapDirective> | null {

    const map: Record<string, boolean> = {};

    if (!this.startDateValue) {
      return null;
    }

    if (this.startDateValue) {
      const className = this.endDateValue
        ? 'selected'
        : 'selecting';

      map[className] = true;
    }

    map[this.#getStartDateClass()] = true;

    if (this.endDateValue) {
      map[this.#getEndDateClass()] = true;
    }

    return classMap(map);
  }

  #getStartDateClass(): string {
    return this.#getDateClass('start', this.startDateValue!);
  }

  #getEndDateClass(): string {
    return this.#getDateClass('end', this.endDateValue!);
  }

  #getDateClass(name: string, date: Date): string {
    const month = date.getMonth();
    const year = date.getFullYear();

    if (this.month === month && this.year === year) {
      return `on-${name}-date-month`;
    }

    if (this.year > year || this.year === year && this.month > month) {
      return `after-${name}-date-month`;
    }

    return `before-${name}-date-month`;
  }

  protected override _getSelectedDateClasses(date: Date): Record<string, boolean> {

    const classes: Record<string, boolean> = {};

    if (this.startDateValue?.getTime() === date.getTime()) {
      classes['selected-date'] = true;
      classes['start-date'] = true;
    }

    if (this.endDateValue?.getTime() === date.getTime()) {
      classes['selected-date'] = true;
      classes['end-date'] = true;
    }

    return classes;
  }
}
