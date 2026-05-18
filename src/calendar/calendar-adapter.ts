export interface CalendarAdapter {
  getWeekDays(locale: string): string[];
  getFirstDayOfWeek(locale: string): number;
  getDay(date: Date): string;
  getMonth(date: Date): string;
  getYear(date: Date): string;
  getMonthShort(month: number, locale: string): string;
}
