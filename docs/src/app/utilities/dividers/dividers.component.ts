import { Component } from '@angular/core';

import { MarkdownComponent } from 'ngx-markdown';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import usageHtml from './examples/usage.html';
import noMarginHtml from './examples/no-margin.html';

@Component({
  selector: 'docs-dividers',
  templateUrl: './dividers.component.html',
  styleUrl: './dividers.component.scss',
  standalone: true,
  imports: [
    MarkdownComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class DividersComponent {
  usageHtml = usageHtml;
  noMarginHtml = noMarginHtml;
}
