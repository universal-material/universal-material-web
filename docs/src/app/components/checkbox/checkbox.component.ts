import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import usageHtml from './examples/usage.html';
import indeterminateHtml from './examples/indeterminate.html';
import listItemHtml from './examples/list-item.html';

@Component({
  selector: 'docs-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class CheckboxComponent {
  usageHtml = usageHtml;
  indeterminateHtml = indeterminateHtml;
  listItemHtml = listItemHtml;
}
