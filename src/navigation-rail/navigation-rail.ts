import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js';

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
 *  - `top`: optional area pinned to the top of the rail (menu button,
 *    brand mark, etc.).
 *  - `bottom`: optional area pinned to the bottom of the rail (FAB,
 *    secondary action, etc.).
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

  @queryAssignedElements({ slot: 'top', flatten: true })
  private readonly assignedTop!: HTMLElement[];

  @queryAssignedElements({ slot: 'bottom', flatten: true })
  private readonly assignedBottom!: HTMLElement[];

  @query('.rail') private readonly railEl!: HTMLElement;
  @query('.rail-expanded') private readonly railExpandedEl!: HTMLElement;
  @query('.rail-items') private readonly railItemsEl!: HTMLElement;
  @query('.rail-items-expanded') private readonly railItemsExpandedEl!: HTMLElement;
  @query('.rail .scroll-thumb') private readonly railThumbEl!: HTMLElement;
  @query('.rail-expanded .scroll-thumb') private readonly railExpandedThumbEl!: HTMLElement;

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
        <div class="top" part="top">
          <slot name="top" @slotchange=${this.#handleTopSlotChange}></slot>
        </div>
        <div class="rail-items" part="rail-items">
          <slot name="rail" @slotchange=${this.#handleCollapsedSlotChange}></slot>
        </div>
        <div class="bottom" part="bottom">
          <slot name="bottom" @slotchange=${this.#handleBottomSlotChange}></slot>
        </div>
        <div class="scroll-thumb" part="scroll-thumb" aria-hidden="true"></div>
      </aside>
      <aside class="rail-expanded" part="rail-expanded">
        <div class="rail-items-expanded" part="rail-items-expanded">
          <slot name="expanded" @slotchange=${this.#handleExpandedSlotChange}></slot>
        </div>
        <div class="scroll-thumb" part="scroll-thumb" aria-hidden="true"></div>
      </aside>
    `;
  }

  override firstUpdated(): void {
    this.#setupScrollThumb(this.railItemsEl, this.railThumbEl, this.railEl);
    this.#setupScrollThumb(this.railItemsExpandedEl, this.railExpandedThumbEl, this.railExpandedEl);
  }

  // Builds the custom thumb behavior for one (container, thumb, parent) trio.
  // Native scrollbar is hidden via CSS; this paints a thin overlay thumb
  // whose top/height reflect the container's scroll metrics. Visible while
  // the parent is hovered or has the `.scrolling` class (set briefly on
  // every scroll event).
  #setupScrollThumb(container: HTMLElement, thumb: HTMLElement, parent: HTMLElement): void {
    const minThumbHeight = 24;
    // Inset from the trailing rounded corners, matching the radius so the
    // thumb visually sits inside the curve.
    const trackInset = (): number => {
      const v = getComputedStyle(parent).getPropertyValue('--_nav-rail-expanded-corner-shape').trim();
      const n = parseFloat(v);
      return Number.isFinite(n) ? n : 16;
    };

    const update = (): void => {
      const ch = container.clientHeight;
      const sh = container.scrollHeight;
      if (sh <= ch + 1 || ch === 0) {
        thumb.style.display = 'none';
        return;
      }
      thumb.style.display = '';
      const inset = trackInset();
      const trackH = Math.max(0, ch - inset * 2);
      const ratio = ch / sh;
      const thumbH = Math.max(minThumbHeight, Math.floor(trackH * ratio));
      const maxOffset = Math.max(0, trackH - thumbH);
      const offset = ((sh - ch) <= 0 ? 0 : container.scrollTop / (sh - ch)) * maxOffset;
      thumb.style.height = `${thumbH}px`;
      thumb.style.top = `${inset + offset}px`;
    };

    let scrollTimer = 0;
    container.addEventListener('scroll', () => {
      update();
      parent.classList.add('scrolling');
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => parent.classList.remove('scrolling'), 800);
    }, { passive: true });

    new ResizeObserver(update).observe(container);
    update();

    // Items added/removed by Lit changes scrollHeight without resizing the
    // container, so we also refresh on slot mutations.
    const slot = container.querySelector('slot');
    slot?.addEventListener('slotchange', () => requestAnimationFrame(update));
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

  #handleTopSlotChange = (): void => {
    if (this.assignedTop.length > 0) {
      this.setAttribute('has-top', '');
    } else {
      this.removeAttribute('has-top');
    }
  };

  #handleBottomSlotChange = (): void => {
    if (this.assignedBottom.length > 0) {
      this.setAttribute('has-bottom', '');
    } else {
      this.removeAttribute('has-bottom');
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
