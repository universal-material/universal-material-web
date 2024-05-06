import { html, HTMLTemplateResult, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles } from './list-item.styles.js';

import '../ripple/ripple.js';

@customElement('u-list-item')
export class UmListItem extends LitElement {
  static override styles = styles;

  @property({type: Boolean, reflect: true}) selectable = false;

  override render(): HTMLTemplateResult {
    const ripple = html`<u-ripple></u-ripple>`;
    return html`
      ${this.selectable ? ripple : nothing}
      <slot name="leading"></slot>
      <slot></slot>
      <slot name="trailing"></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-list-item': UmListItem;
  }
}
