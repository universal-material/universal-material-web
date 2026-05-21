import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import alignmentHtml from './examples/alignment.html';
import mixedHtml from './examples/mixed.html';
import stackHtml from './examples/stack.html';
import usageHtml from './examples/usage.html';

@Component({
  selector: 'docs-button-set',
  templateUrl: './button-set.component.html',
  styleUrl: './button-set.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent,
  ],
})
export class ButtonSetComponent {
  alignmentHtml = alignmentHtml;
  mixedHtml = mixedHtml;
  stackHtml = stackHtml;
  usageHtml = usageHtml;
}
