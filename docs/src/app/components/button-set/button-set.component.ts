import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

// @ts-ignore
import usageHtml from '!raw-loader!./examples/usage.html';
// @ts-ignore
import stackHtml from '!raw-loader!./examples/stack.html';
// @ts-ignore
import alignmentHtml from '!raw-loader!./examples/alignment.html';

@Component({
  selector: 'docs-button-set',
  templateUrl: './button-set.component.html',
  styleUrl: './button-set.component.scss',
  standalone: true,
  imports: [
    ExampleComponent,
    TitleComponent
  ]
})
export class ButtonSetComponent {
  usageHtml = usageHtml;
  stackHtml = stackHtml;
  alignmentHtml = alignmentHtml;
}
