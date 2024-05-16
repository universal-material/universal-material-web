import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';
import { FormsModule } from '@angular/forms';
import { states } from '@docs/shared/states.model';

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
    FormsModule,
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ],
  standalone: true
})
export class SelectComponent {
  states = states;
}
