import { Component } from '@angular/core';

import { MarkdownComponent } from 'ngx-markdown';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import overviewHtml from './examples/overview.html';

@Component({
  selector: 'docs-grid',
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
  standalone: true,
  imports: [
    MarkdownComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class GridComponent {
  overviewHtml = overviewHtml;
}
