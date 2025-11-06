import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { styles } from './badge.styles.js';

@customElement('u-badge')
export class UmBadge extends LitElement {
  static override styles = styles;

  @property({ type: Boolean, reflect: true }) static = false;
  @state() private _empty = true;

  protected override render(): HTMLTemplateResult {
    const containerClasses = classMap({
      static: this.static,
      empty: this._empty,
    });

    return html`
      <div class="container ${containerClasses}" part="container">
        <slot @slotchange=${this.#handleSlotChange}></slot>
      </div>
    `;
  }

  #handleSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this._empty = !!slot.assignedElements().length;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-badge': UmBadge;
  }
}
