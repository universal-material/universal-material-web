import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import usageHtml from './examples/usage.html';
import iconsHtml from './examples/icons.html';
import fixedHtml from './examples/fixed.html';

@Component({
  selector: 'docs-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class SearchComponent {
  usageHtml = usageHtml;
  iconsHtml = iconsHtml;
  fixedHtml = fixedHtml;
}
