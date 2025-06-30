import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import variantsHtml from './examples/buttons-variants.html';
import anchorButtonsHtml from './examples/anchor-buttons.html';
import togglesHtml from './examples/toggle-buttons.html';
import togglesManualHtml from './examples/toggle-buttons-manual.html';
import shapesHtml from './examples/buttons-shapes.html';
import sizesHtml from './examples/buttons-sizes.html';
import narrowButtonsHtml from './examples/buttons-narrow.html';
import wideButtonsHtml from './examples/buttons-wide.html';

@Component({
  selector: 'docs-icon-buttons',
  templateUrl: './icon-buttons.component.html',
  styleUrl: './icon-buttons.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class IconButtonsComponent {
  variantsHtml = variantsHtml;
  anchorButtonsHtml = anchorButtonsHtml;
  togglesHtml = togglesHtml;
  togglesManualHtml = togglesManualHtml;
  shapesHtml = shapesHtml;
  sizesHtml = sizesHtml;
  narrowButtonsHtml = narrowButtonsHtml;
  wideButtonsHtml = wideButtonsHtml;
}
