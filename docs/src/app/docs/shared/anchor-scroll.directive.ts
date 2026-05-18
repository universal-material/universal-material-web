import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { Location } from '@angular/common';

/**
 * Intercepts clicks on anchors whose href starts with `#` so the hash router
 * (configured with `withHashLocation()`) doesn't treat the fragment as a route.
 * The directive scrolls to the target element and updates the URL fragment.
 */
@Directive({
  selector: 'a[docsAnchorScroll]',
  standalone: true,
})
export class AnchorScrollDirective {
  private readonly host = inject(ElementRef<HTMLAnchorElement>);
  private readonly location = inject(Location);

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    const href = this.host.nativeElement.getAttribute('href') || '';
    if (!href.startsWith('#') || event.defaultPrevented) {
      return;
    }
    const slug = href.replace(/^#/, '');
    if (!slug) return;

    event.preventDefault();
    const target =
      document.getElementById(slug) ||
      document.querySelector<HTMLElement>(`.article-title:has(a[href="#${slug}"])`);
    if (!target) return;

    const layout = document.querySelector<HTMLElement>('.page-layout');
    if (layout) {
      const layoutRect = layout.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const to = layout.scrollTop + (targetRect.top - layoutRect.top) - 16;
      layout.scrollTop = to;
    } else {
      target.scrollIntoView({ block: 'start' });
    }

    const path = this.location.path(false);
    history.replaceState(history.state, '', `#${path}#${slug}`);
  }
}
