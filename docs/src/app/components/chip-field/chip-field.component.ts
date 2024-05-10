import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';
import { UmChipField, UmTypeahead } from '@universal-material/web';

@Component({
  selector: 'docs-chip-field',
  templateUrl: './chip-field.component.pug',
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
  states = [
    {name: 'Alabama'},
    {name: 'Alaska'},
    {name: 'American Samoa'},
    {name: 'Arizona'},
    {name: 'Arkansas'},
    {name: 'California'},
    {name: 'Colorado'},
    {name: 'Connecticut'},
    {name: 'Delaware'},
    {name: 'District Of Columbia'},
    {name: 'Federated States Of Micronesia'},
    {name: 'Florida'},
    {name: 'Georgia'},
    {name: 'Guam'},
    {name: 'Hawaii'},
    {name: 'Idaho'},
    {name: 'Illinois'},
    {name: 'Indiana'},
    {name: 'Iowa'},
    {name: 'Kansas'},
    {name: 'Kentucky'},
    {name: 'Louisiana'},
    {name: 'Maine'},
    {name: 'Marshall Islands'},
    {name: 'Maryland'},
    {name: 'Massachusetts'},
    {name: 'Michigan'},
    {name: 'Minnesota'},
    {name: 'Mississippi'},
    {name: 'Missouri'},
    {name: 'Montana'},
    {name: 'Nebraska'},
    {name: 'Nevada'},
    {name: 'New Hampshire'},
    {name: 'New Jersey'},
    {name: 'New Mexico'},
    {name: 'New York'},
    {name: 'North Carolina'},
    {name: 'North Dakota'},
    {name: 'Northern Mariana Islands'},
    {name: 'Ohio'},
    {name: 'Oklahoma'},
    {name: 'Oregon'},
    {name: 'Palau'},
    {name: 'Pennsylvania'},
    {name: 'Puerto Rico'},
    {name: 'Rhode Island'},
    {name: 'South Carolina'},
    {name: 'South Dakota'},
    {name: 'Tennessee'},
    {name: 'Texas'},
    {name: 'Utah'},
    {name: 'Vermont'},
    {name: 'Virgin Islands'},
    {name: 'Virginia'},
    {name: 'Washington'},
    {name: 'West Virginia'},
    {name: 'Wisconsin'},
    {name: 'Wyoming'}
  ];

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
