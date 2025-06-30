import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import colorsHtml from './examples/colors.html';

@Component({
  selector: 'docs-text-colors',
  templateUrl: './text-colors.component.html',
  styleUrl: './text-colors.component.scss',
  standalone: true,
  imports: [
    ExampleComponent,
    TitleComponent
  ]
})
export class TextColorsComponent {
  colorsHtml = colorsHtml;
  inverseColorsHtml = colorsHtml
    .replace(/<p class="u-p-small u-text-(on-)?(primary-fixed|secondary-fixed|tertiary-fixed|info|warning|success|light|dark).+\n/g, '')
    .replace(/-text-/g, '-text-inverse-')
    .replace(/-text-inverse-on-/g, '-text-on-inverse-')
    .replace(/-bg-/g, '-bg-inverse-');
}
