import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { titleToHash } from '@docs/docs/shared/title-to-hash';

@Component({
  selector: 'docs-title',
  standalone: true,
  imports: [],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss'
})
export class TitleComponent implements OnChanges {

  @Input() title!: string;
  anchorHash: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    this.anchorHash = titleToHash(this.title);
  }
}
