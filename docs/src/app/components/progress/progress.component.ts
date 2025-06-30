import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

// @ts-ignore
import determinateHtml from '!raw-loader!./examples/determinate-progress.html';
// @ts-ignore
import indeterminateHtml from '!raw-loader!./examples/indeterminate-progress.html';
// @ts-ignore
import circularProgressHtml from '!raw-loader!./examples/circular-progress.html';

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
