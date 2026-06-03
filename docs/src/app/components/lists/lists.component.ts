import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import simpleListHtml from './examples/simple-list.html';
import listIconsHtml from './examples/list-icons.html';
import listTwoLinesHtml from './examples/list-two-lines.html';
import listWithActionHtml from './examples/list-with-action.html';
import listNoInsetHtml from './examples/list-no-inset.html';

@Component({
  selector: 'docs-lists',
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class ListsComponent {
  simpleListHtml = simpleListHtml;
  listIconsHtml = listIconsHtml;
  listTwoLinesHtml = listTwoLinesHtml;
  listWithActionHtml = listWithActionHtml;
  listNoInsetHtml = listNoInsetHtml;
}
