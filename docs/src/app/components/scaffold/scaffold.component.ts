import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import basicHtml from './examples/basic.html';
import withFabMenuHtml from './examples/with-fab-menu.html';
import explicitScrollContainerHtml from './examples/explicit-scroll-container.html';
import listDetailHtml from './examples/list-detail.html';
import startSidebarHtml from './examples/start-sidebar.html';
import startFullscreenHtml from './examples/start-fullscreen.html';
import endSidebarHtml from './examples/end-sidebar.html';
import endFullscreenHtml from './examples/end-fullscreen.html';
import filledVariantsHtml from './examples/filled-variants.html';
import withTopBarHtml from './examples/with-top-bar.html';

@Component({
  selector: 'docs-scaffold',
  templateUrl: './scaffold.component.html',
  styleUrl: './scaffold.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class ScaffoldComponent {
  basicHtml = basicHtml;
  withFabMenuHtml = withFabMenuHtml;
  explicitScrollContainerHtml = explicitScrollContainerHtml;
  listDetailHtml = listDetailHtml;
  startSidebarHtml = startSidebarHtml;
  startFullscreenHtml = startFullscreenHtml;
  endSidebarHtml = endSidebarHtml;
  endFullscreenHtml = endFullscreenHtml;
  filledVariantsHtml = filledVariantsHtml;
  withTopBarHtml = withTopBarHtml;
}
