import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

function getOption(value: string) {
  return {
    label: `Option ${value}`,
    value: value,
    render: true,
    hide: false,
    selected: false,
    selectedAttr: false
  };
}

@Component({
  selector: 'docs-select',
  templateUrl: './select.component.pug',
  styleUrl: './select.component.scss',
  imports: [
    CommonModule,
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ],
  standalone: true
})
export class SelectComponent {
  options = [
    getOption('A'),
    getOption('B'),
    getOption('C'),
    getOption('D')
  ]
}
