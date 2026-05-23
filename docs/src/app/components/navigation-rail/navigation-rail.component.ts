import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import basicHtml from './examples/basic.html';
import expandedOnlyHtml from './examples/expanded-only.html';
import withEdgesHtml from './examples/with-edges.html';

@Component({
  selector: 'docs-navigation-rail',
  templateUrl: './navigation-rail.component.html',
  styleUrl: './navigation-rail.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class NavigationRailComponent {
  basicHtml = basicHtml;
  expandedOnlyHtml = expandedOnlyHtml;
  withEdgesHtml = withEdgesHtml;
}
