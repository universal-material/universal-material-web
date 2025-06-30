import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';
import { UmChipField } from '@universal-material/web';

import simpleHtml from './examples/simple.html';
import objectValuesHtml from './examples/object-values.html';

@Component({
  selector: 'docs-chip-field',
  templateUrl: './chip-field.component.html',
  styleUrl: './chip-field.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class ChipFieldComponent {

  simpleHtml = simpleHtml;
  objectValuesHtml = objectValuesHtml;

  formatter = (state: {name: string}) => state.name;

  keyDown($event: KeyboardEvent) {
    if ($event.key !== 'Enter') {
      return;
    }

    const chipField = <UmChipField>$event.target;
    chipField.add({name: chipField.input.value}, true);
    chipField.input.value = '';
  }
}
