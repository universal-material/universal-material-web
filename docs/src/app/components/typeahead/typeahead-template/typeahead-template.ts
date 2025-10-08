import { ChangeDetectorRef, Component, inject, input, model, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'docs-typeahead-template',
  imports: [],
  templateUrl: './typeahead-template.html',
  styleUrl: './typeahead-template.scss'
})
export class TypeaheadTemplate implements OnDestroy {
  state = input.required<{ name: string }>();

  ngOnDestroy(): void {
    console.log('docs-typeahead-template destroyed!');
  }
}

