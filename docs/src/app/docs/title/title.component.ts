import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { titleToHash } from '@docs/docs/shared/title-to-hash';
import { AnchorScrollDirective } from '@docs/docs/shared/anchor-scroll.directive';

type TitleKind = 'component' | 'utility' | 'layout' | 'content' | 'foundation';

const KIND_META: Record<TitleKind, { label: string; icon: string }> = {
  component: { label: 'Component', icon: 'widgets' },
  utility: { label: 'Utility', icon: 'tune' },
  layout: { label: 'Layout', icon: 'dashboard' },
  content: { label: 'Content', icon: 'text_format' },
  foundation: { label: 'Foundation', icon: 'foundation' },
};

@Component({
  selector: 'docs-title',
  standalone: true,
  imports: [CommonModule, AnchorScrollDirective],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss'
})
export class TitleComponent implements OnChanges {

  @Input() title!: string;
  @Input() kind: TitleKind = 'component';
  /**
   * Comma-separated tag names to display below the title, e.g. "u-badge" or "u-datepicker, u-range-datepicker".
   */
  @Input() tag?: string;
  anchorHash: string | null = null;

  get tags(): string[] {
    if (!this.tag) return [];
    return this.tag.split(',').map(t => t.trim()).filter(Boolean);
  }

  get badgeLabel(): string {
    return KIND_META[this.kind].label;
  }

  get badgeIcon(): string {
    return KIND_META[this.kind].icon;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.anchorHash = titleToHash(this.title);
  }
}
