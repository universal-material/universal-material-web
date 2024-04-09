import { HTMLTemplateResult, LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles';
import { styles } from './card-media.styles';

@customElement('u-card-media')
export class CardMedia extends LitElement {

  static override styles = [baseStyles, styles];

  @property({type: Boolean, reflect: true}) wide = false;

  override render(): HTMLTemplateResult {
    return html`
      <slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-card-media': CardMedia;
  }
}
