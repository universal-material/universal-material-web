import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Highlight } from 'ngx-highlightjs';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { titleToHash } from '@docs/docs/shared/title-to-hash';
import { AnchorScrollDirective } from '@docs/docs/shared/anchor-scroll.directive';

@Component({
  selector: 'docs-example',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    Highlight,
    AnchorScrollDirective,
  ],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss'
})
export class ExampleComponent implements OnChanges {
  htmlSafe: SafeHtml | null = null;
  _html?: string;

  @Input() renderExample = true;
  @Input() sectionTitle!: string;
  /**
   * When set, renders a "View as screen" link next to the section title that
   * navigates to a standalone Angular route (no docs shell). Use this for
   * examples where the component needs the full viewport to be evaluated
   * fairly — `u-scaffold`, app-bar interactions, FAB anchoring, etc.
   */
  @Input() screenRoute?: string;
  /**
   * Makes the preview area edge-to-edge (no horizontal padding) and stretches
   * the demo to fill its width. Useful for components that span the full
   * surface — top-app-bar, dividers, snackbars, lists inside cards, etc.
   */
  @Input({ transform: (v: boolean | string) => v === '' || v === true || v === 'true' }) fluid = false;
  /**
   * Horizontal alignment of the demo within the preview area.
   * - `start` (default): items aligned to the left
   * - `center`: items centered
   * - `end`: items aligned to the right — great for FABs
   * - `stretch`: each item takes the full available width — great for form fields
   * - `between`: distribute items with space between
   *
   * Note: named `alignment` (not `align`) to avoid the legacy HTML `align`
   * attribute, which browsers map to `text-align`.
   */
  @Input() alignment: 'start' | 'center' | 'end' | 'stretch' | 'between' = 'start';
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