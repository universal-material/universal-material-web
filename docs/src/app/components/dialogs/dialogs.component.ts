import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

// @ts-ignore
import simpleCardHtml from '!raw-loader!./examples/example.html';

@Component({
  selector: 'docs-dialogs',
  templateUrl: './dialogs.component.pug',
  styleUrl: './dialogs.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class DialogsComponent {
  simpleCardHtml = simpleCardHtml;
}
