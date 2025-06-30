import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import determinateHtml from './examples/determinate-progress.html';
import indeterminateHtml from './examples/indeterminate-progress.html';
import circularProgressHtml from './examples/circular-progress.html';

@Component({
  selector: 'docs-progress',
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    ExampleComponent,
    TitleComponent
  ]
})
export class ProgressComponent {
  determinateHtml = determinateHtml;
  indeterminateHtml = indeterminateHtml;
  circularProgressHtml = circularProgressHtml;
  circularValue = 0.5;
  barValue = 0.5;
}
