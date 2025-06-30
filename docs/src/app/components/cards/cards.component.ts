import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import variantsHtml from './examples/simple-card.html';
import cardWithActionsHtml from './examples/card-with-actions.html';
import cardMediaHtml from './examples/card-media.html';

@Component({
  selector: 'docs-cards',
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class CardsComponent {
  variantsHtml = variantsHtml;
  cardWithActionsHtml = cardWithActionsHtml;
  cardMediaHtml = cardMediaHtml;
}
