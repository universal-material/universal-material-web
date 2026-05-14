import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import levelsHtml from './examples/levels.html';

@Component({
  selector: 'docs-elevation',
  templateUrl: './elevation.component.html',
  styleUrl: './elevation.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class ElevationComponent {
  levelsHtml = levelsHtml;
}
