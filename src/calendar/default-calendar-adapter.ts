import { CalendarAdapter } from './calendar-adapter';

export class DefaultCalendarAdapter implements CalendarAdapter {
  weekDayFormat: 'long' | 'short' | 'narrow' = 'narrow';
  locale = 'pt-br';

  getWeekDays(locale: string): string[] {
    const date = new Date();

    const intlLocale = new Intl.Locale(locale);
    const weekInfo = intlLocale.getWeekInfo ? intlLocale.getWeekInfo() : (intlLocale as any).weekinfo;

    this.#setDateToFirstDayOfWeek(date, weekInfo.firstDay);
    const weekDays: string[] = [];

    for (let i = 0; i < 7; i++) {
      weekDays.push(date.toLocaleDateString(locale, { weekday: this.weekDayFormat }));
      date.setDate(date.getDate() + 1);
    }

    return weekDays;
  }

  #setDateToFirstDayOfWeek(date: Date, firstDayOfWeek: number): void {
    const diffToFirstDayOfWeek = (firstDayOfWeek - date.getDay() + 7) % 7;

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
}
