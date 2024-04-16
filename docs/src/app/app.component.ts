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
  toggleMenu = false;

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
    const darkMode = this.currentThemeMode === ThemeMode.Dark;
    const lightMode = this.currentThemeMode === ThemeMode.Light;

    if (!darkMode && !lightMode) {
      document.documentElement.classList.remove('u-dark-mode');
      document.documentElement.classList.remove('u-light-mode');
      return;
    }

    if (!darkMode) {
      document.documentElement.classList.add('u-light-mode');
      document.documentElement.classList.remove('u-dark-mode');
      return;
    }

    document.documentElement.classList.add('u-dark-mode');
    document.documentElement.classList.remove('u-light-mode');
  }
}
