export interface CalendarAdapter {
  getWeekDays(locale: string): string[];
  getDay(date: Date): string;
  getMonth(date: Date): string;
}
