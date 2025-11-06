import { html, HTMLTemplateResult, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { styles } from './list-item.styles.js';

import '../ripple/ripple.js';

@customElement('u-list-item')
export class UmListItem extends LitElement {
  static override styles = styles;

  @property({ type: Boolean, reflect: true }) selectable = false;

  override render(): HTMLTemplateResult {
    const ripple = html`<u-ripple></u-ripple>`;

    const containerClasses = classMap({ selectable: this.selectable });

    return html`
      <div class="container ${containerClasses}" part="container">
        ${this.selectable ? ripple : nothing}
        <slot name="leading-icon" part="leading"></slot>
        <div class="content" part="content">
          <div class="headline" part="headline">
            <slot></slot>
          </div>
          <div class="supporting-text" part="supporting-text">
            <slot name="supporting-text"></slot>
          </div>
        </div>
        <slot name="trailing-icon" part="trailing"></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-list-item': UmListItem;
  }
}
