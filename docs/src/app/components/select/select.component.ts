import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import basicHtml from './examples/basic.html';
import variantsHtml from './examples/variants.html';
import valueHtml from './examples/value.html';
import disabledHtml from './examples/disabled.html';

@Component({
  selector: 'docs-select',
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent,
  ],
  standalone: true,
})
export class SelectComponent {
  basicHtml = basicHtml;
  variantsHtml = variantsHtml;
  valueHtml = valueHtml;
  disabledHtml = disabledHtml;
}
