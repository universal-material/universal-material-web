import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';

import { Apis } from '@docs/apis';

@Component({
  selector: 'docs-apis-table',
  templateUrl: './apis-table.component.pug',
  styleUrl: './apis-table.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MarkdownModule
  ]
})
export class ApisTableComponent implements OnChanges {

  @Input() key!: string;
  properties!: typeof Apis.button;

  ngOnChanges(changes: SimpleChanges): void {
    // @ts-ignore
    this.properties = Apis[this.key];
  }
}
