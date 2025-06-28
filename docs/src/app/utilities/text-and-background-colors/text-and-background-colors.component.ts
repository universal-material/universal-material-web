import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

// @ts-ignore
import colorsHtml from '!raw-loader!./examples/colors.html';

@Component({
  selector: 'docs-text-and-background-colors',
  templateUrl: './text-and-background-colors.component.pug',
  styleUrl: './text-and-background-colors.component.scss',
  standalone: true,
  imports: [
    ExampleComponent,
    TitleComponent
  ]
})
export class TextAndBackgroundColorsComponent {
  colorsHtml = colorsHtml;
  inverseColorsHtml = colorsHtml
    .replace(/<div class="u-p-large u-text-bg-(primary-fixed|secondary-fixed|tertiary-fixed|info|warning|success|light|dark).+\n/g, '')
    .replace(/-bg-/g, '-bg-inverse-');
}
