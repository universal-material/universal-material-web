import { CSSResultGroup } from '@lit/reactive-element/css-tag';

import { customElement, property, state } from 'lit/decorators.js';

import { CalendarBase } from './calendar-base.js';
import { styles } from './calendar.styles.js';

@customElement('u-calendar')
export class Calendar extends CalendarBase {
  static override styles: CSSResultGroup = [styles, CalendarBase.styles];

  @state() dateValue: Date | null = null;

  /**
   * The selected date as an ISO date string (`YYYY-MM-DD`), or an empty
   * string when no date is selected
   */
  @property()
  get value(): string {
    return this._getDateString(this.dateValue);
  }

  set value(value: string) {
    this.dateValue = this._getDateFromString(value);
  }

  protected override _selectDate(date: Date): void {
    this.dateValue = date;

    this.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true }));

    if (this.month === date.getMonth() && this.year === date.getFullYear()) {
      return;
    }

    this.month = date.getMonth();
    this.year = date.getFullYear();

  }

  protected override _getSelectedDateClasses(date: Date): Record<string, boolean> {
    return this.dateValue?.getTime() === date.getTime()
      ? { 'selected-date': true }
      : {};

  }
}
