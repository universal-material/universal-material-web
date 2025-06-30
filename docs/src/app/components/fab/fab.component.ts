import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

// @ts-ignore
import sizesHtml from '!raw-loader!./examples/button-sizes.html';
// @ts-ignore
import colorsHtml from '!raw-loader!./examples/button-colors.html';
// @ts-ignore
import extendedHtml from '!raw-loader!./examples/extended-buttons.html';
// @ts-ignore
import loweredHtml from '!raw-loader!./examples/lowered-buttons.html';
// @ts-ignore
import floatingActionAreaHtml from '!raw-loader!./examples/floating-action-area.html';
// @ts-ignore
import floatingMenuHtml from '!raw-loader!./examples/floating-menu.html';

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
