import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import basicHtml from './examples/basic.html';
import iconsHtml from './examples/with-icons.html';
import initialSelectionHtml from './examples/initial-selection.html';
import secondaryHtml from './examples/secondary.html';

@Component({
  selector: 'docs-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent,
  ],
})
export class TabsComponent {
  basicHtml = basicHtml;
  iconsHtml = iconsHtml;
  initialSelectionHtml = initialSelectionHtml;
  secondaryHtml = secondaryHtml;
}
