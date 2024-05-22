import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

// @ts-ignore
import usageHtml from '!raw-loader!./examples/usage.html';

@Component({
  selector: 'docs-text-emphasis',
  templateUrl: './text-emphasis.component.pug',
  styleUrl: './text-emphasis.component.scss',
  standalone: true,
  imports: [ApisTableComponent, ExampleComponent, TitleComponent],
})
export class TextEmphasisComponent {
  usageHtml = usageHtml;
}
