import { Component } from '@angular/core';
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
    ExampleComponent,
    TitleComponent
  ]
})
export class BadgesComponent {
  usageHtml = usageHtml;
  staticHtml = staticHtml;
}
