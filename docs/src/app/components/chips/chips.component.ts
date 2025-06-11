import { CommonModule } from '@angular/common';
import { Component, ElementRef } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';
import { UmField } from '@universal-material/web';
import { ContextTestComponent } from '@docs/components/context-test/context-test.component';

@Component({
  selector: 'docs-chips',
  templateUrl: './chips.component.pug',
  styleUrl: './chips.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ApisTableComponent,
    ExampleComponent,
    TitleComponent,
    ContextTestComponent
  ]
})
export class ChipsComponent {
  removable = true;
  clickable = true;
  elevated = false;
  toggle = true;
  hideSelectedIcon = false;
  customRemove = true;
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
  Label${this.getTrailingIcons()}
</u-chip>`
      .trimStart();
  }

  private getProperties(): string {
    const properties: {[key: string]: any} = {};

    if (this.removable) {
      properties['removable'] = true;
    }

    if (this.hideSelectedIcon) {
      properties['hide-selected-icon'] = true;
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
  <span class="material-symbols-outlined material-symbols-fill u-text-warning" slot="icon-selected">star</span>`;
    }

    if (this.leadingIcon) {
      icons += `
  <span class="material-symbols-outlined" slot="leading-icon">event</span>`;
    }

    return icons;
  }

  private getTrailingIcons(): string {
    if (!this.trailingIcon && !this.customRemove) {
      return '';
    }

    let icons = '';

    if (this.trailingIcon) {
      icons += `
  <span class="material-symbols-outlined" slot="trailing-icon"arrow_drop_down</span>`;
    }

    if (this.customRemove) {
      icons += `
  <span class="material-symbols-outlined" slot="remove-icon"cancel</span>`;
    }

    return icons;
  }

  template = '';
}
