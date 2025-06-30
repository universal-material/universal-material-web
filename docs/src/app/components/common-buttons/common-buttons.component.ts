import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import variantsHtml from './examples/buttons-variants.html';
import togglesHtml from './examples/toggle-buttons.html';
import shapesHtml from './examples/buttons-shapes.html';
import sizesHtml from './examples/buttons-sizes.html';
import filledColorsHtml from './examples/filled-colors.html';
import anchorButtonsHtml from './examples/anchor-buttons.html';
import iconsHtml from './examples/buttons-icons.html';
import trailingIconsHtml from './examples/buttons-trailing-icons.html';

@Component({
  selector: 'docs-common-buttons',
  templateUrl: './common-buttons.component.html',
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
