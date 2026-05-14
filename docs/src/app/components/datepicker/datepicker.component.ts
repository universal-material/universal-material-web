import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import calendarHtml from './examples/calendar.html';
import rangeCalendarHtml from './examples/range-calendar.html';
import localeHtml from './examples/locale.html';

@Component({
  selector: 'docs-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class DatepickerComponent {
  calendarHtml = calendarHtml;
  rangeCalendarHtml = rangeCalendarHtml;
  localeHtml = localeHtml;
}
