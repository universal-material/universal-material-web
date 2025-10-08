import { CommonModule } from '@angular/common';
import {
  ApplicationRef,
  Component,
  createComponent,
  ElementRef,
  inject,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';
import { UmChipField, UmTypeahead } from '@universal-material/web';
import { states } from '@docs/shared/states.model';

import simpleHtml from './examples/simple.html';
import objectResultsHtml from './examples/object-results.html';
import handlingSelectionHtml from './examples/handling-selection.html';
import { html } from 'lit';
import { TypeaheadTemplate } from '@docs/components/typeahead/typeahead-template/typeahead-template';

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


  readonly #appRef = inject(ApplicationRef);
  readonly #viewContainerRef = inject(ViewContainerRef);

  simpleHtml = simpleHtml;
  objectResultsHtml = objectResultsHtml;
  handlingSelectionHtml = handlingSelectionHtml;

  @ViewChild('chipField') chipField!: ElementRef<UmChipField>;

  states = states;
  stateObjects = states.map(s => ({name: s}));

  formatter = (state: {name: string}) => state.name;
  // resultTemplate = (term: string, state: {name: string}) => {
  //   const templateRef = createComponent(TypeaheadTemplate, {
  //     environmentInjector: this.#appRef.injector,
  //   });
  //
  //   templateRef.setInput('state', state);
  //   this.#appRef.attachView(templateRef.hostView);
  //
  //   const mutationObserver = new MutationObserver(() => {
  //     console.log('mutationObserver');
  //   });
  //   mutationObserver.observe(templateRef.location.nativeElement, {childList: true});
  //   return templateRef.location.nativeElement;
  // };
  resultTemplate = (term: string, state: {name: string}) => {

    return html`<typeahead-template .state=${state}></typeahead-template>`;
  };

  selected($event: Event) {
    $event.preventDefault();

    const customEvent = $event as CustomEvent<{name: string}>;
    const typeahead = <UmTypeahead>customEvent.target;
    typeahead.clear();
    this.chipField.nativeElement.add(customEvent.detail);
    typeahead.focus();
  }
}
