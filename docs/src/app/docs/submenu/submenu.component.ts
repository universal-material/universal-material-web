import { Component, Input } from '@angular/core';

@Component({
  selector: 'docs-submenu',
  standalone: true,
  imports: [],
  templateUrl: './submenu.component.pug',
  styleUrl: './submenu.component.scss'
})
export class SubmenuComponent {
  @Input() label!: string;
  open = false;
}
