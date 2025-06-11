import { ThemeBuilder } from '@universal-material/web';
import { Subject, throttleTime } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChildActivationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';

import { NavigationItem } from '@docs/components/navigation-item.model';

import { LinkActiveDirective } from './docs/link-active.directive';
import { SubmenuComponent } from './docs/submenu/submenu.component';

enum ThemeMode {
  Auto,
  Light,
  Dark,
}

@Component({
  selector: 'docs-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    LinkActiveDirective,
    SubmenuComponent,
    RouterOutlet,
  ],
  templateUrl: 'app.component.pug',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  ThemeMode = ThemeMode;

  currentThemeMode = parseInt(localStorage['currentThemeMode'], 10) || 0;
  themeColor = '#6750a4';
  $themeColorChange = new Subject<string>();

  anchorsNavigation: { hash: string; title: string }[] = [];

  @ViewChild('scrollWrapper') scrollWrapper!: ElementRef<HTMLElement>;

  constructor(router: Router) {
    this.applyThemeMode();

    const themeColor = localStorage['currentThemeColor'] || this.themeColor;
    this.setThemeColor(themeColor);

    this.$themeColorChange
      .pipe(throttleTime(1000, undefined, { leading: true, trailing: true }))
      .subscribe(color => this.setThemeColor(color));

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => this.applyThemeMode());

    router.events.subscribe(event => {
      if (!(event instanceof ChildActivationEnd)) {
        return;
      }

      setTimeout(() => this.buildNavigation(), 100);
    });

    if (localStorage['direction'] === 'rtl') {
      document.body.setAttribute('dir', 'rtl');
    }
  }

  toggleRtl() {
    const currentDirection = localStorage['direction'];

    localStorage['direction'] = currentDirection === 'rtl' ? '' : 'rtl';

    location.reload();
  }

  setThemeColor(color: string) {
    if (localStorage['ignoreThemeColor'] === 'true') {
      return;
    }

    const styles = ThemeBuilder.create(color).build();

    let themeStylesElement = document.getElementById('theme-styles');

    if (!themeStylesElement) {
      themeStylesElement = document.createElement('style');
      themeStylesElement.id = 'theme-styles';
      document.head.appendChild(themeStylesElement);
    }

    themeStylesElement.textContent = styles;
    localStorage['currentThemeColor'] = color;
    this.themeColor = color;
  }

  setThemeMode(mode: ThemeMode) {
    this.currentThemeMode = mode;
    localStorage['currentThemeMode'] = mode;
    this.applyThemeMode();
  }

  private applyThemeMode() {

    if (this.currentThemeMode === ThemeMode.Light) {
      document.documentElement.classList.add('u-light');
      document.documentElement.classList.remove('u-dark');
      return;
    }

    if (this.currentThemeMode === ThemeMode.Dark) {
      document.documentElement.classList.add('u-dark');
      document.documentElement.classList.remove('u-light');
      return;
    }

    document.documentElement.classList.remove('u-light');
    document.documentElement.classList.remove('u-dark');
  }

  private buildNavigation() {
    const anchors = Array.from(document.querySelectorAll('a'));

    this.anchorsNavigation.length = 0;

    for (const anchor of anchors) {
      if (anchor.host !== location.host) {
        anchor.target = '_blank';
        continue;
      }

      if (!anchor.hash?.startsWith('#')) {
        continue;
      }

      const navigationItem = {
        hash: anchor.hash,
        title: anchor.textContent!,
      };

      anchor.addEventListener('click', e => this.navigateToAnchor(e, navigationItem));
      this.anchorsNavigation.push(navigationItem);
    }
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
