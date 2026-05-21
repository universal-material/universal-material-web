import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import basicHtml from './examples/basic.html';
import withFabMenuHtml from './examples/with-fab-menu.html';
import explicitScrollContainerHtml from './examples/explicit-scroll-container.html';

@Component({
  selector: 'docs-scaffold',
  templateUrl: './scaffold.component.html',
  styleUrl: './scaffold.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class ScaffoldComponent {
  basicHtml = basicHtml;
  withFabMenuHtml = withFabMenuHtml;
  explicitScrollContainerHtml = explicitScrollContainerHtml;
}
