import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import usageHtml from './examples/usage.html';
import insideCardHtml from './examples/inside-card.html';

@Component({
  selector: 'docs-collapse',
  templateUrl: './collapse.component.html',
  styleUrl: './collapse.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class CollapseComponent {
  usageHtml = usageHtml;
  insideCardHtml = insideCardHtml;

  open = false;
  cardOpen = false;
}
