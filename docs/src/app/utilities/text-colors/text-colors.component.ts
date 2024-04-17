import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

// @ts-ignore
import themeColorsHtml from '!raw-loader!./examples/theme-colors.html';
// @ts-ignore
import commonColorsHtml from '!raw-loader!./examples/common-colors.html';
// @ts-ignore
import emphasisColorsHtml from '!raw-loader!./examples/emphasis-colors.html';

@Component({
  selector: 'docs-text-colors',
  templateUrl: './text-colors.component.pug',
  styleUrl: './text-colors.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class TextColorsComponent {
  themeColorsHtml = themeColorsHtml;
  commonColorsHtml = commonColorsHtml;
  emphasisColorsHtml = emphasisColorsHtml;
}
