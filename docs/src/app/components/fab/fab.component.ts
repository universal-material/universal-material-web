import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import sizesHtml from './examples/button-sizes.html';
import colorsHtml from './examples/button-colors.html';
import extendedHtml from './examples/extended-buttons.html';
import loweredHtml from './examples/lowered-buttons.html';
import floatingActionAreaHtml from './examples/floating-action-area.html';
import floatingMenuHtml from './examples/floating-menu.html';

@Component({
  selector: 'docs-fab',
  templateUrl: './fab.component.html',
  styleUrl: './fab.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class FabComponent {
  sizesHtml = sizesHtml;
  colorsHtml = colorsHtml;
  extendedHtml = extendedHtml;
  loweredHtml = loweredHtml;
  floatingActionAreaHtml = floatingActionAreaHtml;
  floatingMenuHtml = floatingMenuHtml;
}
