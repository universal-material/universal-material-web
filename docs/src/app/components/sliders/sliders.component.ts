import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import continuousHtml from './examples/continuous.html';
import discreteHtml from './examples/discrete.html';
import rangeHtml from './examples/range.html';
import disabledHtml from './examples/disabled.html';
import sizesHtml from './examples/sizes.html';

@Component({
  selector: 'docs-sliders',
  templateUrl: './sliders.component.html',
  styleUrl: './sliders.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class SlidersComponent {
  continuousHtml = continuousHtml;
  discreteHtml = discreteHtml;
  rangeHtml = rangeHtml;
  disabledHtml = disabledHtml;
  sizesHtml = sizesHtml;
}
