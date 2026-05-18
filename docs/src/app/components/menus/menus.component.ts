import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import basicHtml from './examples/basic.html';
import iconsHtml from './examples/icons.html';
import positioningHtml from './examples/positioning.html';

const ANCHOR_CORNERS = ['start-start', 'start-end', 'end-start', 'end-end', 'auto-start', 'auto-end'] as const;
const DIRECTIONS = ['down-start', 'down-end', 'up-start', 'up-end'] as const;

type AnchorCorner = typeof ANCHOR_CORNERS[number];
type Direction = typeof DIRECTIONS[number];

@Component({
  selector: 'docs-menus',
  templateUrl: './menus.component.html',
  styleUrl: './menus.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent,
  ],
})
export class MenusComponent {
  readonly basicHtml = basicHtml;
  readonly iconsHtml = iconsHtml;
  readonly positioningHtml = positioningHtml;

  readonly anchorCorners = ANCHOR_CORNERS;
  readonly directions = DIRECTIONS;

  anchorCorner: AnchorCorner = 'end-start';
  direction: Direction = 'down-start';
}
