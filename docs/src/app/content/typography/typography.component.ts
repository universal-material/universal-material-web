import { Component } from '@angular/core';

import { TitleComponent } from '../../docs/title/title.component';
import { ExampleComponent } from '../../docs/example/example.component';

// @ts-ignore
import typosHtml from '!raw-loader!./examples/typos.html';

@Component({
  selector: 'docs-typography',
  standalone: true,
  imports: [
    TitleComponent,
    ExampleComponent
  ],
  templateUrl: './typography.component.pug',
  styleUrl: './typography.component.scss'
})
export class TypographyComponent {
  typosHtml = typosHtml;
}
