import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import usageHtml from './examples/usage.html';

@Component({
  selector: 'docs-text-emphasis',
  templateUrl: './text-emphasis.component.html',
  styleUrl: './text-emphasis.component.scss',
  standalone: true,
  imports: [ExampleComponent, TitleComponent],
})
export class TextEmphasisComponent {
  usageHtml = usageHtml;
}
