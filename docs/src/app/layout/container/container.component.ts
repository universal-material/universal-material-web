import { Component } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

// @ts-ignore
import overviewMd from '!raw-loader!./overview.md';

// @ts-ignore
import fluidContainerHtml from '!raw-loader!./examples/fluid-container.html';
// @ts-ignore
import defaultContainerHtml from '!raw-loader!./examples/default-container.html';

@Component({
  selector: 'docs-container',
  templateUrl: './container.component.pug',
  styleUrl: './container.component.scss',
  standalone: true,
  imports: [
    MarkdownComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class ContainerComponent {
  overviewMd = overviewMd;
  fluidContainerHtml = fluidContainerHtml;
  defaultContainerHtml = defaultContainerHtml;
}
