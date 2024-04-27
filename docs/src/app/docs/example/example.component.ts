import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Highlight } from 'ngx-highlightjs';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { titleToHash } from '@docs/docs/shared/title-to-hash';

@Component({
  selector: 'docs-example',
  standalone: true,
  imports: [
    CommonModule,
    Highlight
  ],
  templateUrl: './example.component.pug',
  styleUrl: './example.component.scss'
})
export class ExampleComponent implements OnChanges {
  htmlSafe: SafeHtml | null = null;
  _html?: string;

  @Input() sectionTitle!: string;
  anchorHash: string | null = null;

  @Input()
  set html(html: string) {
    this.htmlSafe = this.sanitizer.bypassSecurityTrustHtml(html);
    this._html = html;
  };

  constructor(private readonly sanitizer: DomSanitizer) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.anchorHash = titleToHash(this.sectionTitle);
  }
}
