import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

@Component({
  selector: 'docs-tabs',
  templateUrl: './tabs.component.pug',
  styleUrl: './tabs.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class TabsComponent {
  tabs: string[] = []

  constructor() {
    for (let i = 0; i < 15; i++) {
      this.addTab()
    }
  }

  addTab() {
    this.tabs.push(`Tab`);
  }
}
