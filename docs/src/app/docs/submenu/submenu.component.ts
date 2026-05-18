import { Component, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'docs-submenu',
  standalone: true,
  imports: [],
  templateUrl: './submenu.component.html',
  styleUrl: './submenu.component.scss'
})
export class SubmenuComponent {
  @Input() label!: string;

  constructor(private readonly elementRef: ElementRef) {
    this.elementRef.nativeElement.setAttribute('role', 'group');
  }
}
