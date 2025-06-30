import { Component } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import overviewMd from './overview.md';

import fluidContainerHtml from './examples/fluid-container.html';
import defaultContainerHtml from './examples/default-container.html';

@Component({
  selector: 'docs-container',
  templateUrl: './container.component.html',
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
