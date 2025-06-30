import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import exampleHtml from './examples/example.html';

@Component({
  selector: 'docs-snackbars',
  templateUrl: './snackbars.component.html',
  styleUrl: './snackbars.component.scss',
  standalone: true,
  imports: [
    ExampleComponent,
    TitleComponent
  ]
})
export class SnackbarsComponent {
  exampleHtml = exampleHtml;
}
