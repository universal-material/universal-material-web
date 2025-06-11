import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

// @ts-ignore
import variantsHtml from '!raw-loader!./examples/buttons-variants.html';
// @ts-ignore
import togglesHtml from '!raw-loader!./examples/toggle-buttons.html';
// @ts-ignore
import shapesHtml from '!raw-loader!./examples/buttons-shapes.html';
// @ts-ignore
import sizesHtml from '!raw-loader!./examples/buttons-sizes.html';
// @ts-ignore
import filledColorsHtml from '!raw-loader!./examples/filled-colors.html';
// @ts-ignore
import anchorButtonsHtml from '!raw-loader!./examples/anchor-buttons.html';
// @ts-ignore
import iconsHtml from '!raw-loader!./examples/buttons-icons.html';
// @ts-ignore
import trailingIconsHtml from '!raw-loader!./examples/buttons-trailing-icons.html';

@Component({
  selector: 'docs-common-buttons',
  templateUrl: './common-buttons.component.pug',
  styleUrl: './common-buttons.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class CommonButtonsComponent {
  variantsHtml = variantsHtml;
  togglesHtml = togglesHtml;
  shapesHtml = shapesHtml;
  sizesHtml = sizesHtml;
  filledColorsHtml = filledColorsHtml;
  anchorButtonsHtml = anchorButtonsHtml;
  iconsHtml = iconsHtml;
  trailingIconsHtml = trailingIconsHtml;
}
