import { CalendarAdapter } from './calendar-adapter.js';

export class DefaultCalendarAdapter implements CalendarAdapter {
  weekDayFormat: 'long' | 'short' | 'narrow' = 'narrow';
  locale = 'pt-br';

  getWeekDays(locale: string): string[] {
    const date = new Date();
    const firstDay = this.getFirstDayOfWeek(locale);

    this.#setDateToFirstDayOfWeek(date, firstDay);
    const weekDays: string[] = [];

    for (let i = 0; i < 7; i++) {
      weekDays.push(date.toLocaleDateString(locale, { weekday: this.weekDayFormat }));
      date.setDate(date.getDate() + 1);
    }

    return weekDays;
  }

  getFirstDayOfWeek(locale: string): number {
    const intlLocale = new Intl.Locale(locale);
    const weekInfo = intlLocale.getWeekInfo ? intlLocale.getWeekInfo() : (intlLocale as any).weekinfo;
    // CLDR convention (1=Mon..7=Sun) → JS Date convention (0=Sun..6=Sat)
    return weekInfo.firstDay % 7;
  }

  #setDateToFirstDayOfWeek(date: Date, jsFirstDayOfWeek: number): void {
    const diffToFirstDayOfWeek = (jsFirstDayOfWeek - date.getDay() + 7) % 7;

    date.setDate(date.getDate() + diffToFirstDayOfWeek);
  }

  getDay(date: Date): string {
    return date.toLocaleDateString(this.locale, { day: 'numeric' });
  }

  getMonth(date: Date): string {
    return date.toLocaleDateString(this.locale, {
      month: 'long',
      year: 'numeric',
    });
  }

  getYear(date: Date): string {
    return date.toLocaleDateString(this.locale, { year: 'numeric' });
  }

  getMonthShort(month: number, locale: string): string {
    const date = new Date(2000, month, 1);
    return date.toLocaleDateString(locale, { month: 'short' });
  }
}
