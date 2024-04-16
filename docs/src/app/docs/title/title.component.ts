import { Component, Input } from '@angular/core';

@Component({
  selector: 'docs-title',
  standalone: true,
  imports: [],
  templateUrl: './title.component.pug',
  styleUrl: './title.component.scss'
})
export class TitleComponent {
  @Input() title!: string;
}
