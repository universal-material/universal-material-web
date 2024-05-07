import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

@Component({
  selector: 'docs-chips',
  templateUrl: './chips.component.pug',
  styleUrl: './chips.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class ChipsComponent {
  action = false;
  elevated = false;
  toggle = true;
  selectedIcon = true;
  leadingIcon = true;
  trailingIcon = true;

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
}
