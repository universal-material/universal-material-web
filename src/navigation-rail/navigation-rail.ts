import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './navigation-rail.styles.js';

import '../elevation/elevation.js';
import './navigation-rail-headline.js';
import './navigation-rail-item.js';
import type { NavigationRailItem } from './navigation-rail-item.js';

/**
 * Material 3 navigation rail — a responsive primary navigation surface that
 * adapts to the viewport with two independently configurable destination
 * sets:
 *
 * - **Mobile (< 840px)**: rail is hidden. `toggleDrawer` slides the
 *   expanded rail in from the left as a **modal** over the content (with
 *   scrim).
 * - **Medium (840–1199px)**: a permanent 96dp **collapsed** sidebar shows
 *   `slot="rail"` items. `toggleDrawer` slides the expanded rail in over
 *   it as a **modal** (with scrim).
 * - **Large (≥ 1200px)**: the expanded rail is permanent (no modal,
 *   no scrim). `toggleDrawer` slides it back off the leading edge,
 *   revealing the collapsed bar underneath.
 *
 * The expanded panel animates exactly like the side-navigation drawer:
 * `inset-inline-start` transitions 375ms with the project's awesome cubic
 * bezier easing.
 *
 * Slots:
 *  - `rail`: primary destinations shown in the permanent collapsed bar
 *    (`u-navigation-rail-item`s, no headlines).
 *  - `expanded`: full destination list shown in the expanded panel —
 *    `u-navigation-rail-item`s grouped by optional
 *    `u-navigation-rail-headline`s.
 *  - `rail-top`: optional area pinned to the top of the expanded panel
 *    (menu button, brand mark, etc.).
 *  - `rail-bottom`: optional area pinned to the bottom of the expanded
 *    panel (FAB, secondary action, etc.).
 *  - default: page content.
 */
@customElement('u-navigation-rail')
export class NavigationRail extends LitElement {
  static override styles = [baseStyles, styles];

  /**
   * Toggle the rail's secondary state:
   *
   * - On mobile/medium: slides the expanded rail in from the left as a
   *   modal overlay (with scrim). Click on the scrim to close.
   * - On large: slides the expanded rail off, revealing the collapsed
   *   96dp bar underneath.
   */
  @property({ type: Boolean, attribute: 'toggle-drawer', reflect: true }) toggleDrawer = false;

  @queryAssignedElements({ slot: 'rail', flatten: true })
  private readonly assignedCollapsedItems!: HTMLElement[];

  @queryAssignedElements({ slot: 'expanded', flatten: true })
  private readonly assignedExpandedElements!: HTMLElement[];

  @queryAssignedElements({ slot: 'rail-top', flatten: true })
  private readonly assignedRailTop!: HTMLElement[];

  @queryAssignedElements({ slot: 'rail-bottom', flatten: true })
  private readonly assignedRailBottom!: HTMLElement[];

  override render(): HTMLTemplateResult {
    return html`
      <div class="grid">
        <div class="rail-column"></div>
        <div class="content">
          <slot></slot>
        </div>
      </div>
      <div class="scrim" part="scrim" @click=${this.#handleScrimClick}></div>
      <aside class="rail" part="rail">
        <div class="rail-top" part="rail-top">
          <slot name="rail-top" @slotchange=${this.#handleRailTopSlotChange}></slot>
        </div>
        <div class="rail-items" part="rail-items">
          <slot name="rail" @slotchange=${this.#handleCollapsedSlotChange}></slot>
        </div>
        <div class="rail-bottom" part="rail-bottom">
          <slot name="rail-bottom" @slotchange=${this.#handleRailBottomSlotChange}></slot>
        </div>
      </aside>
      <aside class="rail-expanded" part="rail-expanded">
        <div class="rail-items-expanded" part="rail-items-expanded">
          <slot name="expanded" @slotchange=${this.#handleExpandedSlotChange}></slot>
        </div>
      </aside>
    `;
  }

  #handleScrimClick = (): void => {
    this.toggleDrawer = false;
  };

  #handleCollapsedSlotChange = (): void => {
    if (this.assignedCollapsedItems.length > 0) {
      this.setAttribute('has-rail-items', '');
    } else {
      this.removeAttribute('has-rail-items');
    }
    for (const item of this.assignedCollapsedItems) {
      if (this.#isRailItem(item)) {
        item.variant = 'collapsed';
      }
    }
  };

  #handleExpandedSlotChange = (): void => {
    if (this.assignedExpandedElements.length > 0) {
      this.setAttribute('has-expanded-items', '');
    } else {
      this.removeAttribute('has-expanded-items');
    }
    for (const el of this.assignedExpandedElements) {
      if (this.#isRailItem(el)) {
        el.variant = 'expanded';
      }
    }
  };

  #handleRailTopSlotChange = (): void => {
    if (this.assignedRailTop.length > 0) {
      this.setAttribute('has-rail-top', '');
    } else {
      this.removeAttribute('has-rail-top');
    }
  };

  #handleRailBottomSlotChange = (): void => {
    if (this.assignedRailBottom.length > 0) {
      this.setAttribute('has-rail-bottom', '');
    } else {
      this.removeAttribute('has-rail-bottom');
    }
  };

  #isRailItem(el: Element): el is NavigationRailItem {
    return el.tagName === 'U-NAVIGATION-RAIL-ITEM';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-navigation-rail': NavigationRail;
  }
}
