import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';
import { UmChipField, UmTypeahead } from '@universal-material/web';

const states = [
  'Alabama',
  'Alaska',
  'American Samoa',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'District Of Columbia',
  'Federated States Of Micronesia',
  'Florida',
  'Georgia',
  'Guam',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Marshall Islands',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Northern Mariana Islands',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Palau',
  'Pennsylvania',
  'Puerto Rico',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virgin Islands',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming'
];

@Component({
  selector: 'docs-typeahead',
  templateUrl: './typeahead.component.pug',
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
  action = false;
  clickable = true;
  elevated = false;
  toggle = true;
  selectedIcon = true;
  leadingIcon = true;
  trailingIcon = true;

  updated$ = new Subject<void>();

  @ViewChild('chipField') chipField!: ElementRef<UmChipField>;

  constructor() {
    this
      .updated$
      .pipe(debounceTime(50))
      .subscribe(() => this.updateTemplate());

    this.updateTemplate();
  }

  updateTemplate(): void {
    this.template = `
<u-chip${this.getProperties()}>${this.getLeadingIcons()}
  Label${this.getTrailingIcon()}
</u-chip>`
      .trimStart();
  }

  private getProperties(): string {
    const properties: {[key: string]: any} = {};

    if (this.action) {
      properties['action'] = true;
    }

    if (this.elevated) {
      properties['elevated'] = true;
    }

    if (this.clickable) {
      properties['clickable'] = true;
    }

    if (this.toggle) {
      properties['toggle'] = true;
    }

    let propertiesValue = ``;

    for (const property in properties) {
      const value = properties[property];

      propertiesValue += value === true
        ? ` ${property}`
        : ` ${property}="${value}"`;
    }

    return propertiesValue;
  }

  private getLeadingIcons(): string {
    if (!this.selectedIcon && !this.leadingIcon) {
      return '';
    }

    let icons = '';

    if (this.selectedIcon) {
      icons += `
  <span class="material-symbols-outlined" slot="selected-icon">done</span>`;
    }

    if (this.leadingIcon) {
      icons += `
  <span class="material-symbols-outlined" slot="leading-icon">event</span>`;
    }

    return icons;
  }

  private getTrailingIcon(): string {
    if (!this.trailingIcon) {
      return '';
    }

    return `
  <span class="material-symbols-outlined" slot="trailing-icon">${this.action ? 'close' : 'arrow_drop_down'}</span>`;
  }

  template = '';
  states = states;
  objectStates = states.map(s => ({name: s}));

  formatter = (state: {name: string}) => state.name;
  leadingIconTemplate = (state: {name: string}) => `${state.name[0]}`;
  resultTemplate = (_: string, state: {name: string}) => `<i>${state.name.toUpperCase()}</i>`;

  selected($event: Event) {
    $event.preventDefault();

    const customEvent = $event as CustomEvent<{name: string}>;
    const typeahead = <UmTypeahead>customEvent.target;
    typeahead.clear();
    this.chipField.nativeElement.add(customEvent.detail);
    typeahead.focus();
  }
}
