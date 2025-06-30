import { Component } from '@angular/core';

import { TitleComponent } from '../../docs/title/title.component';
import { ExampleComponent } from '../../docs/example/example.component';

import typosHtml from './examples/typos.html';

@Component({
  selector: 'docs-typography',
  standalone: true,
  imports: [
    TitleComponent,
    ExampleComponent
  ],
  templateUrl: './typography.component.html',
  styleUrl: './typography.component.scss'
})
export class TypographyComponent {
  typosHtml = typosHtml;
}
