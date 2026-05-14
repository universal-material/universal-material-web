import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import filledHtml from './examples/filled.html';
import outlinedHtml from './examples/outlined.html';
import withIconsHtml from './examples/with-icons.html';

@Component({
  selector: 'docs-field',
  templateUrl: './field.component.html',
  styleUrl: './field.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class FieldComponent {
  filledHtml = filledHtml;
  outlinedHtml = outlinedHtml;
  withIconsHtml = withIconsHtml;
}
