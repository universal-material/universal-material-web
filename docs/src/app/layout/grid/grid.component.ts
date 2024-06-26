import { Component } from '@angular/core';

import { MarkdownComponent } from 'ngx-markdown';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

// @ts-ignore
import overviewHtml from '!raw-loader!./examples/overview.html';

@Component({
  selector: 'docs-grid',
  templateUrl: './grid.component.pug',
  styleUrl: './grid.component.scss',
  standalone: true,
  imports: [
    MarkdownComponent,
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class GridComponent {
  overviewHtml = overviewHtml;
}
