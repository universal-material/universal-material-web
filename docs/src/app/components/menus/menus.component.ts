import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import downHtml from './examples/down.html';
import downLeftHtml from './examples/down-left.html';
import downRightHtml from './examples/down-right.html';
import downStartHtml from './examples/down-start.html';
import downEndHtml from './examples/down-end.html';

const anchors = ['auto-start', 'auto-end', 'start-start', 'start-end', 'end-end', 'end-start'];
const directions = ['up-start', 'up-end', 'down-start', 'down-end'];

@Component({
  selector: 'docs-menus',
  templateUrl: './menus.component.html',
  styleUrl: './menus.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class MenusComponent {
  downHtml = downHtml;
  downLeftHtml = downLeftHtml;
  downRightHtml = downRightHtml;
  downStartHtml = downStartHtml;
  downEndHtml = downEndHtml;

  direction = 'down-end';
  anchorCorner = 'start-start';

  changeDirection() {
    this.direction = this.getNextValue(this.direction, directions);
  }

  changeAnchor() {
    this.anchorCorner = this.getNextValue(this.anchorCorner, anchors);
  }

  private getNextValue(currentValue: string, values: string[]) {

    let nextIndex = values.indexOf(currentValue) + 1;

    if (nextIndex === values.length) {
      nextIndex = 0;
    }

    return values[nextIndex];
  }
}
