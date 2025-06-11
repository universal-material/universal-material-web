import { Color } from './color.js';

export const neutralColors: Color[] = [
  { name: 'surface', lightTone: 98, darkTone: 6 },
  { name: 'surface-bright', lightTone: 98, darkTone: 24 },
  { name: 'surface-dim', lightTone: 87, darkTone: 6 },
  { name: 'surface-container-lowest', lightTone: 100, darkTone: 4 },
  { name: 'surface-container-low', lightTone: 96, darkTone: 10 },
  { name: 'surface-container', lightTone: 94, darkTone: 12 },
  { name: 'surface-container-high', lightTone: 92, darkTone: 17 },
  { name: 'surface-container-highest', lightTone: 90, darkTone: 22 },
  { name: 'on-surface', lightTone: 10, darkTone: 90 },
  { name: 'light', fixedTone: 98 },
  { name: 'on-light', fixedTone: 10 },
  { name: 'dark', fixedTone: 6 },
  { name: 'on-dark', fixedTone: 90 },
  { name: 'scrim', fixedTone: 0 },
  { name: 'shadow', fixedTone: 0 },
];

export const neutralVariantColors: Color[] = [
  { name: 'surface-variant', lightTone: 90, darkTone: 30 },
  { name: 'on-surface-variant', lightTone: 30, darkTone: 80 },
  { name: 'outline', lightTone: 50, darkTone: 60 },
  { name: 'outline-variant', lightTone: 80, darkTone: 30 },
];
