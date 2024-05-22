import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Optional,
  Renderer2,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Directive({
  selector: '[docsLinkActive]',
  standalone: true,
})
export class LinkActiveDirective extends RouterLinkActive {
  readonly #element: ElementRef;
  readonly #renderer: Renderer2;

  constructor(
    router: Router,
    element: ElementRef,
    renderer: Renderer2,
    changeDetectorRef: ChangeDetectorRef,
    @Optional() link?: RouterLink,
  ) {
    super(router, element, renderer, changeDetectorRef, link);
    this.#element = element;
    this.#renderer = renderer;

    this.isActiveChange.subscribe(() => {
      if (this.isActive) {
        this.#renderer.setAttribute(this.#element.nativeElement, 'active', '');
        return;
      }

      this.#renderer.removeAttribute(this.#element.nativeElement, 'active');
    });
  }
}
