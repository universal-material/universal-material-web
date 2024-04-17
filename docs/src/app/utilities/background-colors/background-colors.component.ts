import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

// @ts-ignore
import themeColorsHtml from '!raw-loader!./examples/theme-colors.html';
// @ts-ignore
import commonColorsHtml from '!raw-loader!./examples/common-colors.html';

@Component({
  selector: 'docs-background-colors',
  templateUrl: './background-colors.component.pug',
  styleUrl: './background-colors.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class BackgroundColorsComponent {
  themeColorsHtml = themeColorsHtml;
  commonColorsHtml = commonColorsHtml;
}
