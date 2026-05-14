import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import { UmSelectControlValueAccessor, UmSelectOption } from '@docs/components/select/select-control-value-accessor';
import { states } from '@docs/shared/states.model';

import basicHtml from './examples/basic.html';
import variantsHtml from './examples/variants.html';
import statesHtml from './examples/states.html';
import disabledHtml from './examples/disabled.html';

@Component({
  selector: 'docs-select',
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    UmSelectControlValueAccessor,
    UmSelectOption,
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ],
  standalone: true,
})
export class SelectComponent {
  basicHtml = basicHtml;
  variantsHtml = variantsHtml;
  statesHtml = statesHtml;
  disabledHtml = disabledHtml;

  state = 'California';
  states = states;
}
