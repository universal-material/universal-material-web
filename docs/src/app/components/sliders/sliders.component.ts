import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

// @ts-ignore
import sliderHtml from '!raw-loader!./examples/example.html';

@Component({
  selector: 'docs-sliders',
  templateUrl: './sliders.component.pug',
  styleUrl: './sliders.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class SlidersComponent {
  sliderHtml = sliderHtml;
}
