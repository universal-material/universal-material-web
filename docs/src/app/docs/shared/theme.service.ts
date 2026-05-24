import { Injectable } from '@angular/core';
import { Subject, throttleTime } from 'rxjs';

import { ThemeBuilder } from '@universal-material/web';

export enum ThemeMode {
  Auto,
  Light,
  Dark,
}

export interface ThemeColorPreset {
  name: string;
  value: string;
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly themeColorPresets: ThemeColorPreset[] = [
    { name: 'Purple', value: '#6750a4' },
    { name: 'Indigo', value: '#4f46e5' },
    { name: 'Blue', value: '#2563eb' },
    { name: 'Teal', value: '#0d9488' },
    { name: 'Green', value: '#16a34a' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Pink', value: '#db2777' },
    { name: 'Red', value: '#dc2626' },
  ];

  themeColor = '#6750a4';
  currentThemeMode: ThemeMode = parseInt(localStorage['currentThemeMode'], 10) || ThemeMode.Auto;

  readonly $themeColorChange = new Subject<string>();

  private initialized = false;

  initialize(): void {
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    this.applyThemeMode();

    const themeColor = localStorage['currentThemeColor'] || this.themeColor;
    this.setThemeColor(themeColor);

    this.$themeColorChange
      .pipe(throttleTime(1000, undefined, { leading: true, trailing: true }))
      .subscribe(color => this.setThemeColor(color));

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => this.applyThemeMode());

    if (localStorage['direction'] === 'rtl') {
      document.body.setAttribute('dir', 'rtl');
    }
  }

  isPresetActive(value: string): boolean {
    return value.toLowerCase() === this.themeColor.toLowerCase();
  }

  setThemeColor(color: string): void {
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

  setThemeMode(mode: ThemeMode): void {
    this.currentThemeMode = mode;
    localStorage['currentThemeMode'] = mode;
    this.applyThemeMode();
  }

  toggleRtl(): void {
    const currentDirection = localStorage['direction'];
    localStorage['direction'] = currentDirection === 'rtl' ? '' : 'rtl';
    location.reload();
  }

  private applyThemeMode(): void {
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
}
