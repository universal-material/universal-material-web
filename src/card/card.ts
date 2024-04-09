import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles';
import { styles } from './card.styles';
import './card-content';
import './card-media';
import '../elevation/elevation';

@customElement('u-card')
export class Card extends LitElement {

  static override styles = [baseStyles, styles];

  @property({reflect: true}) variant: 'filled' | 'elevated' | 'outlined' = 'elevated';

  override render(): HTMLTemplateResult {
    return html`
      <u-elevation></u-elevation>
      <slot name="before-content"></slot>
      <u-card-content>
        <slot></slot>
      </u-card-content>
      <slot name="after-content"></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-card': Card;
  }
}
