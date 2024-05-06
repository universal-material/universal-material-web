import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'docs-submenu',
  standalone: true,
  imports: [],
  templateUrl: './submenu.component.pug',
  styleUrl: './submenu.component.scss'
})
export class SubmenuComponent implements AfterViewInit {
  @Input() label!: string;
  open = false;

  constructor(private readonly elementRef: ElementRef) {
    this.elementRef.nativeElement.setAttribute('role', 'menu');
  }

  ngAfterViewInit() {
    this.open = !!this.elementRef.nativeElement.querySelector(`u-drawer-item[routerlink="${location.hash.substring(2)}"]`);
  }
}
