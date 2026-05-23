import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './navigation-rail-headline.styles.js';

/**
 * Section header for grouping destinations inside the expanded navigation
 * rail. Slot it into `u-navigation-rail slot="expanded"` between groups of
 * `u-navigation-rail-item`s.
 *
 * The headline is only visible while the rail is in its expanded state —
 * when collapsed (or hidden) the rail switches to its primary `slot="rail"`
 * destinations, so headlines never appear in narrow layouts.
 *
 * Slots:
 *  - default: the headline text.
 */
@customElement('u-navigation-rail-headline')
export class NavigationRailHeadline extends LitElement {
  static override styles = [baseStyles, styles];

  protected override render(): HTMLTemplateResult {
    return html`<div class="container" part="container"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-navigation-rail-headline': NavigationRailHeadline;
  }
}
