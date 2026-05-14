import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import smallHtml from './examples/small.html';
import mediumHtml from './examples/medium.html';
import largeHtml from './examples/large.html';

@Component({
  selector: 'docs-top-app-bar',
  templateUrl: './top-app-bar.component.html',
  styleUrl: './top-app-bar.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class TopAppBarComponent {
  smallHtml = smallHtml;
  mediumHtml = mediumHtml;
  largeHtml = largeHtml;
}
