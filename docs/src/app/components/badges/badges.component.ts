import { Component } from '@angular/core';
import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import usageHtml from './examples/usage.html';
import staticHtml from './examples/static.html';

@Component({
  selector: 'docs-badges',
  templateUrl: './badge.component.html',
  styleUrl: './badges.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class BadgesComponent {
  usageHtml = usageHtml;
  staticHtml = staticHtml;
}
