import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

// @ts-ignore
import usageHtml from '!raw-loader!./examples/usage.html';
// @ts-ignore
import staticHtml from '!raw-loader!./examples/static.html';

@Component({
  selector: 'docs-badges',
  templateUrl: './badge.component.html',
  styleUrl: './badges.component.scss',
  standalone: true,
  imports: [
    ExampleComponent,
    TitleComponent
  ]
})
export class BadgesComponent {
  usageHtml = usageHtml;
  staticHtml = staticHtml;
}
