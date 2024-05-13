import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

@Component({
  selector: 'docs-text-fields',
  templateUrl: './text-fields.component.pug',
  styleUrl: './text-fields.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class TextFieldsComponent {
  variant = 'filled';
  invalid = false;
  disabled = false;
  leadingIcon = true;
  trailingIcon = true;
  showCounter = true;
  supportingText = '*required';
  errorText = 'Enter a description';
  template = '';
  value = '';

  updated$ = new Subject<void>();
  source = [{name: 'Eric Hideyuki Kono'}, {name:'Suzana Coutinho Neves Pelca'}];
  selection: { name: string } = {name: 'Eric Hideyuki Kono'};
  formatter(person: {name: string}) {
    return person.name;
  }

  constructor() {
    this
      .updated$
      .pipe(debounceTime(50))
      .subscribe(() => this.updateTemplate());
    this.updateTemplate();
  }

  updateTemplate(): void {
    this.template = `
<u-field${this.getProperties()}>${this.getIcons()}
  <label slot="label" for="description">Description</label>
  <input id="description"${this.disabled ? ' disabled' : ''} placeholder="A placeholder" aria-describedby="supporting-text" />${this.getSupportingText()}
</u-field>`
      .trimStart();
  }

  private getProperties(): string {
    const properties: {[key: string]: any} = {};
    
    if (this.variant === 'outlined') {
      properties['variant'] = this.variant;
    }
     
    if (this.invalid) {
      properties['invalid'] = true;
    }
    
    if (this.disabled) {
      properties['disabled'] = true;
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

  private getIcons(): string {
    if (!this.leadingIcon && !this.trailingIcon) {
      return '';
    }

    let icons = `
`

    if (this.leadingIcon) {
      icons += `  <span class="material-symbols-outlined" slot="leading-icon">search</span>
`;
    }

    if (this.trailingIcon) {
      icons += `  <u-icon-button slot="trailing-icon"${this.disabled ? ' disabled' : ''}>
    <span class="material-symbols-outlined">cancel</span>
  </u-icon-button>
`;
    }

    return icons;
  }

  private getSupportingText(): string {
    if (!this.supportingText && !this.errorText && !this.showCounter) {
      return '';
    }

    let nodes = '';

    if (this.supportingText) {
      nodes += `
  <span slot="supporting-text" id="supporting-text">${this.supportingText}</span>`;
    }

    if (this.errorText) {
      nodes += `
  <span slot="error-text">${this.errorText}</span>`;
      }

    if (this.showCounter) {
      nodes += `
  <span slot="counter">10/100</span>`;
    }

    return nodes;
  }

  setVariant(variant: string) {
    this.variant = variant;
    this.updated$.next();
  }
}

