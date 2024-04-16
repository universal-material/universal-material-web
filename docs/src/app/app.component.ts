import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LinkActiveDirective } from './docs/link-active.directive';
import { SubmenuComponent } from './docs/submenu/submenu.component';

enum ThemeMode {
  Auto,
  Light,
  Dark
}

@Component({
  selector: 'docs-root',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    LinkActiveDirective,
    SubmenuComponent,
    RouterOutlet
  ],
  templateUrl: 'app.component.pug',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  ThemeMode = ThemeMode;

  currentThemeMode = parseInt(localStorage['currentThemeMode'], 10) || 0;

  constructor() {
    this.applyThemeMode();
  }

  toggleRtl() {
    document.body.classList.toggle("rtl");
  }

  setThemeMode(mode: ThemeMode) {
    this.currentThemeMode = mode;
    localStorage['currentThemeMode'] = mode;
    this.applyThemeMode();
  }

  private applyThemeMode() {
    const darkMode = this.currentThemeMode === ThemeMode.Dark ||
      this.currentThemeMode === ThemeMode.Auto && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (!darkMode) {
      document.body.classList.remove('u-dark-mode');
      return;
    }

    document.body.classList.add('u-dark-mode');
  }
}
