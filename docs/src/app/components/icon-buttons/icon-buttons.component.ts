import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

// @ts-ignore
import variantsHtml from '!raw-loader!./examples/buttons-variants.html';
// @ts-ignore
import anchorButtonsHtml from '!raw-loader!./examples/anchor-buttons.html';
// @ts-ignore
import togglesHtml from '!raw-loader!./examples/toggle-buttons.html';
// @ts-ignore
import togglesManualHtml from '!raw-loader!./examples/toggle-buttons-manual.html';
// @ts-ignore
import shapesHtml from '!raw-loader!./examples/buttons-shapes.html';
// @ts-ignore
import sizesHtml from '!raw-loader!./examples/buttons-sizes.html';
// @ts-ignore
import narrowButtonsHtml from '!raw-loader!./examples/buttons-narrow.html';
// @ts-ignore
import wideButtonsHtml from '!raw-loader!./examples/buttons-wide.html';

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
