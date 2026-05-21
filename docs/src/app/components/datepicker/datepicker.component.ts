import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import { SelectControlValueAccessor, SelectOption } from '@docs/components/select/select-control-value-accessor';

import calendarHtml from './examples/calendar.html';
import rangeCalendarHtml from './examples/range-calendar.html';
import datepickerHtml from './examples/datepicker.html';
import datepickerEditableHtml from './examples/datepicker-editable.html';
import rangeDatepickerHtml from './examples/range-datepicker.html';
import localeHtml from './examples/locale.html';

@Component({
  selector: 'docs-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SelectControlValueAccessor,
    SelectOption,
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class DatepickerComponent {
  calendarHtml = calendarHtml;
  rangeCalendarHtml = rangeCalendarHtml;
  datepickerHtml = datepickerHtml;
  datepickerEditableHtml = datepickerEditableHtml;
  rangeDatepickerHtml = rangeDatepickerHtml;
  localeHtml = localeHtml;

  selectedDate = '';
  selectedRange = '';
  datepickerValue = '';
  rangeDatepickerValue = '';

  locale = 'pt-BR';
  editableLocale = 'pt-BR';
  formats = ['short', 'medium', 'long', 'full', 'iso'] as const;
  datepickerFormat: (typeof this.formats)[number] = 'short';
  rangeDatepickerFormat: (typeof this.formats)[number] = 'short';
  locales = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'pt-BR', label: 'Português (Brasil)' },
    { value: 'es-ES', label: 'Español (España)' },
    { value: 'fr-FR', label: 'Français (France)' },
    { value: 'de-DE', label: 'Deutsch' },
    { value: 'ja-JP', label: '日本語' },
    { value: 'zh-CN', label: '简体中文' },
    { value: 'ar-EG', label: 'العربية' },
  ];

  onDateInput(event: Event): void {
    this.selectedDate = (event.target as HTMLElement & { value: string }).value;
  }

  onRangeInput(event: Event): void {
    this.selectedRange = (event.target as HTMLElement & { value: string }).value;
  }

  onDatepickerInput(event: Event): void {
    this.datepickerValue = (event.target as HTMLElement & { value: string }).value;
  }

  onRangeDatepickerInput(event: Event): void {
    this.rangeDatepickerValue = (event.target as HTMLElement & { value: string }).value;
  }
}
