import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import checkboxHtml from './examples/checkbox.html';
import radioHtml from './examples/radio-button.html';
import switchHtml from './examples/switch.html';

@Component({
  selector: 'docs-selection-controls',
  templateUrl: './selection-controls.component.html',
  styleUrl: './selection-controls.component.scss',
  standalone: true,
  imports: [
    ExampleComponent,
    TitleComponent
  ]
})
export class SelectionControlsComponent {
  checkboxHtml = checkboxHtml;
  radioHtml = radioHtml;
  switchHtml = switchHtml;
}
