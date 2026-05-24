import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

import { NavigationItem } from '@docs/components/navigation-item.model';

import { LinkActiveDirective } from '@docs/docs/link-active.directive';
import { TocComponent } from '@docs/docs/toc/toc.component';
import { ThemeMode, ThemeService } from '@docs/docs/shared/theme.service';

import { version as packageVersion } from '../../../../../package.json';

@Component({
  selector: 'docs-shell',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    LinkActiveDirective,
    RouterOutlet,
    TocComponent,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class DocsShellComponent {
  readonly ThemeMode = ThemeMode;
  readonly version = packageVersion;

  anchorsNavigation: { hash: string; title: string }[] = [];

  @ViewChild('scrollWrapper') scrollWrapper!: ElementRef<HTMLElement>;

  constructor(readonly theme: ThemeService) {
  }

  navigateToAnchor(e: Event, item: NavigationItem) {
    e.preventDefault();
    const target = document.querySelector<HTMLElement>(`a[href="${item.hash}"]`);

    if (!target) {
      return;
    }

    this.scrollWrapper.nativeElement.scrollTo({
      top: target.offsetTop - 24,
    });
  }
}
