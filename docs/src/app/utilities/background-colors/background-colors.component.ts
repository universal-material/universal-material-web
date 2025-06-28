import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

// @ts-ignore
import colorsHtml from '!raw-loader!./examples/colors.html';

@Component({
  selector: 'docs-background-colors',
  templateUrl: './background-colors.component.pug',
  styleUrl: './background-colors.component.scss',
  standalone: true,
  imports: [
    ExampleComponent,
    TitleComponent
  ]
})
export class BackgroundColorsComponent {
  colorsHtml = colorsHtml;
  inverseColorsHtml = colorsHtml
    .replace(/<div class="u-p-large u-bg-(primary-fixed|secondary-fixed|tertiary-fixed|info|warning|success|light|dark).+\n/g, '')
    .replace(/-bg-/g, '-bg-inverse-')
    .replace(/-text-on-/g, '-text-on-inverse-');
}
