import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, signal } from '@angular/core';

import { MarkdownComponent } from 'ngx-markdown';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';
import { FormsModule } from '@angular/forms';
import { states } from '@docs/shared/states.model';
import { ChangeEvent } from 'rollup';
import { UmSelectControlValueAccessor, UmSelectOption } from '@docs/components/select/select-control-value-accessor';

@Component({
  selector: 'docs-select',
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    UmSelectControlValueAccessor,
    UmSelectOption,
    MarkdownComponent,
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ],
  standalone: true,
})
export class SelectComponent implements OnDestroy {

  batata= 'Federated States Of Micronesia';
  render = signal(false);


  states = [...states, ...states, ...states, ...states, ...states, ...states, ...states];
  example =
    `
      <select name="select">
        <option value="value1">Value 1</option>
        <option value="value2" selected>Value 2</option>
        <option value="value3">Value 3</option>
      </select>
    `.trim();

  constructor() {
    inject(ElementRef).nativeElement.addEventListener('change', (event: any) => console.log('Change event', event));
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
  }
}
