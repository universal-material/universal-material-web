import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';
import { UmChipField, UmTypeahead } from '@universal-material/web';
import { states } from '@docs/shared/states.model';

// @ts-ignore
import simpleHtml from '!raw-loader!./examples/simple.html';
// @ts-ignore
import objectResultsHtml from '!raw-loader!./examples/object-results.html';
// @ts-ignore
import handlingSelectionHtml from '!raw-loader!./examples/handling-selection.html';

@Component({
  selector: 'docs-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrl: './typeahead.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class TypeaheadComponent {

  simpleHtml = simpleHtml;
  objectResultsHtml = objectResultsHtml;
  handlingSelectionHtml = handlingSelectionHtml;

  @ViewChild('chipField') chipField!: ElementRef<UmChipField>;

  states = states;
  stateObjects = states.map(s => ({name: s}));

  formatter = (state: {name: string}) => state.name;

  selected($event: Event) {
    $event.preventDefault();

    const customEvent = $event as CustomEvent<{name: string}>;
    const typeahead = <UmTypeahead>customEvent.target;
    typeahead.clear();
    this.chipField.nativeElement.add(customEvent.detail);
    typeahead.focus();
  }
}
