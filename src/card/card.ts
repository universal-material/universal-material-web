import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles';
import { styles } from './card.styles';
import './card-content.js';
import './card-media.js';
import '../elevation/elevation.js';

@customElement('u-card')
export class UmCard extends LitElement {

  static override styles = [baseStyles, styles];

  /**
   * The Card variant to render.
   */
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
    'u-card': UmCard;
  }
}
