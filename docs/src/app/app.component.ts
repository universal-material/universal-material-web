import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subject, throttleTime } from 'rxjs';

import { LinkActiveDirective } from './docs/link-active.directive';
import { SubmenuComponent } from './docs/submenu/submenu.component';
// import { ThemeBuilder } from '@universal-material/web';

enum ThemeMode {
  Auto,
  Light,
  Dark
}

@Component({
  selector: 'docs-root',
  standalone: true,
  imports: [
    FormsModule,
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
  themeColor = '#6750a4';
  $themeColorChange = new Subject<string>();

  constructor() {
    this.applyThemeMode();

    const storedThemeColor = localStorage['currentThemeColor'];

    if (storedThemeColor) {
      this.setThemeColor(storedThemeColor);
    }

    this.$themeColorChange
      .pipe(throttleTime(1000, undefined, {leading: true, trailing: true}))
      .subscribe(color => this.setThemeColor(color));

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => this.applyThemeMode());
  }

  toggleRtl() {
    document.body.classList.toggle("rtl");
  }

  setThemeColor(color: string) {
    // const styles = ThemeBuilder.create(color).build();
    //
    // let themeStylesElement = document.getElementById('theme-styles');
    //
    // if (!themeStylesElement) {
    //   themeStylesElement = document.createElement('style');
    //   themeStylesElement.id = 'theme-styles';
    //   document.head.appendChild(themeStylesElement);
    // }
    //
    // themeStylesElement.innerText = styles;
    // localStorage['currentThemeColor'] = color;
    // this.themeColor = color;
  }

  setThemeMode(mode: ThemeMode) {
    this.currentThemeMode = mode;
    localStorage['currentThemeMode'] = mode;
    this.applyThemeMode();
  }

  private applyThemeMode() {
    const darkMode = this.currentThemeMode === ThemeMode.Dark ||
      this.currentThemeMode === ThemeMode.Auto && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (!darkMode) {
      document.documentElement.classList.remove('u-dark-mode');
      return;
    }

    document.documentElement.classList.add('u-dark-mode');
  }
}
