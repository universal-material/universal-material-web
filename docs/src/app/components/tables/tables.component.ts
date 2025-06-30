import { Component } from '@angular/core';

import { MarkdownComponent } from 'ngx-markdown';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

// @ts-ignore
import overviewHtml from '!raw-loader!./examples/overview.html';
// @ts-ignore
import tableHoverHtml from '!raw-loader!./examples/table-hover.html';

@Component({
  selector: 'docs-tables',
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss',
  standalone: true,
  imports: [
    MarkdownComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class TablesComponent {
  overviewHtml = overviewHtml;
  tableHoverHtml = tableHoverHtml;
}
