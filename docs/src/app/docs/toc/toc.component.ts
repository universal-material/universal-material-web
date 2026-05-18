import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  NgZone,
  OnDestroy,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

interface TocEntry {
  hash: string;
  title: string;
  element: HTMLElement;
  depth: number;
}

@Component({
  selector: 'docs-toc',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toc.component.html',
  styleUrl: './toc.component.scss',
})
export class TocComponent implements AfterViewInit, OnDestroy {
  entries: TocEntry[] = [];
  activeHash: string | null = null;

  private mutationObserver?: MutationObserver;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);
  private readonly location = inject(Location);
  private readonly destroyRef = inject(DestroyRef);

  ngAfterViewInit(): void {
    this.scheduleRebuild();

    const sub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.scheduleRebuild());

    this.destroyRef.onDestroy(() => sub.unsubscribe());

    // Observe DOM mutations inside the chapter area so dynamically-added headings get picked up.
    const chapter = document.querySelector('.chapter');
    if (chapter) {
      this.mutationObserver = new MutationObserver(() => this.scheduleRebuild());
      this.mutationObserver.observe(chapter, { childList: true, subtree: true });
    }
  }

  ngOnDestroy(): void {
    this.mutationObserver?.disconnect();
    if (this.scrollContainer && this.scrollHandler) {
      this.scrollContainer.removeEventListener('scroll', this.scrollHandler);
    }
  }

  private rebuildScheduled = false;

  private scheduleRebuild(): void {
    if (this.rebuildScheduled) return;
    this.rebuildScheduled = true;
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.rebuildScheduled = false;
        this.zone.run(() => this.build());
      }, 80);
    });
  }

  private build(): void {
    const chapter = document.querySelector<HTMLElement>('.chapter');
    if (!chapter) {
      this.entries = [];
      this.cdr.markForCheck();
      return;
    }

    // Headings: top-level docs-title h4 → primary, section h5 → secondary.
    const nodes = chapter.querySelectorAll<HTMLAnchorElement>('.article-title a[href^="#"]');
    const next: TocEntry[] = [];
    nodes.forEach(anchor => {
      const heading = anchor.closest<HTMLElement>('.article-title');
      if (!heading) return;
      const hash = anchor.getAttribute('href') || '';
      const slug = hash.replace(/^#/, '');
      if (!slug) return;
      // Make sure the heading carries the id so we can scroll to it.
      if (!heading.id) heading.id = slug;
      next.push({
        hash: slug,
        title: anchor.textContent?.trim() || slug,
        element: heading,
        depth: heading.tagName === 'H4' ? 0 : 1,
      });
    });

    this.entries = next;
    this.cdr.markForCheck();
    this.setupObserver();
    this.scrollToInitialFragment();
  }

  private initialScrollDone = false;

  private scrollToInitialFragment(): void {
    if (this.initialScrollDone) return;
    // Hash routing keeps the fragment after the route hash, e.g. `#/components/badges#api-reference`.
    const fullHash = location.hash;
    const second = fullHash.indexOf('#', 1);
    if (second < 0) return;
    const slug = fullHash.slice(second + 1);
    const entry = this.entries.find(e => e.hash === slug);
    if (entry) {
      this.initialScrollDone = true;
      const layout = document.querySelector<HTMLElement>('.page-layout');
      if (layout) {
        const layoutRect = layout.getBoundingClientRect();
        const targetRect = entry.element.getBoundingClientRect();
        layout.scrollTop = layout.scrollTop + (targetRect.top - layoutRect.top) - 16;
      }
      this.activeHash = entry.hash;
      this.cdr.markForCheck();
    }
  }

  private scrollContainer?: HTMLElement | Window;
  private scrollHandler?: () => void;

  private setupObserver(): void {
    if (this.scrollContainer && this.scrollHandler) {
      this.scrollContainer.removeEventListener('scroll', this.scrollHandler);
    }
    if (!this.entries.length) return;

    // The page scrolls inside `.page-layout` (sibling element above the TOC's host).
    const layout = document.querySelector<HTMLElement>('.page-layout');
    this.scrollContainer = layout ?? window;

    const computeActive = () => {
      const triggerY = 120;
      let current = this.entries[0];
      for (const entry of this.entries) {
        const top = entry.element.getBoundingClientRect().top;
        if (top - triggerY <= 0) {
          current = entry;
        } else {
          break;
        }
      }
      if (current && current.hash !== this.activeHash) {
        this.zone.run(() => {
          this.activeHash = current!.hash;
          this.cdr.markForCheck();
        });
      }
    };

    this.scrollHandler = () => requestAnimationFrame(computeActive);
    this.zone.runOutsideAngular(() => {
      this.scrollContainer!.addEventListener('scroll', this.scrollHandler!, { passive: true });
    });
    computeActive();
  }

  go(event: MouseEvent, entry: TocEntry): void {
    event.preventDefault();
    this.scrollTo(entry.element);
    this.activeHash = entry.hash;
    const path = this.location.path(false);
    history.replaceState(history.state, '', `#${path}#${entry.hash}`);
  }

  private scrollTo(target: HTMLElement): void {
    const layout = document.querySelector<HTMLElement>('.page-layout');
    if (!layout) {
      target.scrollIntoView({ block: 'start' });
      return;
    }
    const layoutRect = layout.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const top = layout.scrollTop + (targetRect.top - layoutRect.top) - 16;
    layout.scrollTop = top;
  }
}
