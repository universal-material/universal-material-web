import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import basicHtml from './examples/basic.html';
import horizontalHtml from './examples/horizontal.html';
import withFabHtml from './examples/with-fab.html';

@Component({
  selector: 'docs-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class NavigationBarComponent {
  basicHtml = basicHtml;
  horizontalHtml = horizontalHtml;
  withFabHtml = withFabHtml;
}
