import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

@Component({
  selector: 'docs-datepicker',
  templateUrl: './datepicker.component.pug',
  styleUrl: './datepicker.component.scss',
  standalone: true,
  imports: [
    TitleComponent
  ]
})
export class DatepickerComponent {

}
