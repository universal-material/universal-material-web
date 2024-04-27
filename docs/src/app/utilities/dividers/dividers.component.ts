import { Component } from '@angular/core';

import { MarkdownComponent } from 'ngx-markdown';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

// @ts-ignore
import usageHtml from '!raw-loader!./examples/usage.html';
// @ts-ignore
import noMarginHtml from '!raw-loader!./examples/no-margin.html';

@Component({
  selector: 'docs-dividers',
  templateUrl: './dividers.component.pug',
  styleUrl: './dividers.component.scss',
  standalone: true,
  imports: [
    MarkdownComponent,
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class DividersComponent {
  usageHtml = usageHtml;
  noMarginHtml = noMarginHtml;
}
