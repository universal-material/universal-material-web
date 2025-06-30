import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

// @ts-ignore
import variantsHtml from '!raw-loader!./examples/simple-card.html';
// @ts-ignore
import cardWithActionsHtml from '!raw-loader!./examples/card-with-actions.html';
// @ts-ignore
import cardMediaHtml from '!raw-loader!./examples/card-media.html';

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
