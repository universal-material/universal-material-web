import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import singleHtml from './examples/single.html';
import accordionHtml from './examples/accordion.html';
import multiHtml from './examples/multi.html';
import disabledHtml from './examples/disabled.html';

@Component({
  selector: 'docs-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class ExpansionPanelComponent {
  singleHtml = singleHtml;
  accordionHtml = accordionHtml;
  multiHtml = multiHtml;
  disabledHtml = disabledHtml;
}
