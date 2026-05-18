import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';

import { Apis } from '@docs/apis';
import { titleToHash } from '@docs/docs/shared/title-to-hash';
import { AnchorScrollDirective } from '@docs/docs/shared/anchor-scroll.directive';

@Component({
  selector: 'docs-apis-table',
  templateUrl: './apis-table.component.html',
  styleUrl: './apis-table.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MarkdownModule,
    AnchorScrollDirective,
  ]
})
export class ApisTableComponent implements OnChanges {

  @Input() key!: string;
  properties!: typeof Apis.button;
  anchorHash: string = titleToHash('API Reference') ?? '#api-reference';

  ngOnChanges(changes: SimpleChanges): void {
    // @ts-ignore
    this.properties = Apis[this.key];
  }
}
