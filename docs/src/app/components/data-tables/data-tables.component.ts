import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

// @ts-ignore
import simpleTablesHtml from '!raw-loader!./examples/simple-table.html';

@Component({
  selector: 'docs-data-tables',
  templateUrl: './data-tables.component.pug',
  styleUrl: './data-tables.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class DataTablesComponent {
  simpleTablesHtml = simpleTablesHtml;
}
