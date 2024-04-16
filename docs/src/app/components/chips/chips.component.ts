import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

// @ts-ignore
import defaultChipHtml from '!raw-loader!./examples/default-chips.html';
// @ts-ignore
import elevatedChipHtml from '!raw-loader!./examples/elevated-chips.html';
// @ts-ignore
import selectedChipHtml from '!raw-loader!./examples/selected-chips.html';
// @ts-ignore
import chipInputHtml from '!raw-loader!./examples/chip-input.html';

@Component({
  selector: 'docs-chips',
  templateUrl: './chips.component.pug',
  styleUrl: './chips.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class ChipsComponent {
  defaultChipHtml = defaultChipHtml;
  elevatedChipHtml = elevatedChipHtml;
  selectedChipHtml = selectedChipHtml;
  chipInputHtml = chipInputHtml;
}
