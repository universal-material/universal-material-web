import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'docs-text-fields',
  templateUrl: './text-fields.component.pug',
  styleUrl: './text-fields.component.scss',
  standalone: true,
  imports: [
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
  leadingIcon = false;
  trailingIcon = false;
  supportingText = '*required';
  errorText = 'Enter a description';
  template = '';
  value = '';

  updated$ = new Subject<void>();

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
  <input placeholder="A placeholder" value="Batata" id="description"${this.disabled ? ' disabled' : ''} />
  <span slot="supporting-text">${this.supportingText}</span>
  <span slot="error-text">${this.errorText}</span>
  <span slot="counter">10/100</span>
</u-field>`.trimStart();
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
}
