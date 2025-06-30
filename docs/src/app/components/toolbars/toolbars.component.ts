import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

// @ts-ignore
import simpleToolbarHtml from '!raw-loader!./examples/simple-toolbar.html';

@Component({
  selector: 'docs-toolbars',
  templateUrl: './toolbars.component.html',
  styleUrl: './toolbars.component.scss',
  standalone: true,
  imports: [
    ExampleComponent,
    TitleComponent
  ]
})
export class ToolbarsComponent {
  simpleToolbarHtml = simpleToolbarHtml;
}
