import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import usageHtml from './examples/usage.html';
import stackHtml from './examples/stack.html';
import alignmentHtml from './examples/alignment.html';

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
