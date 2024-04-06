import { css, html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import './card-content';
import './card-media';
import '../elevation/elevation';
import { BaseStyles } from '../shared/base-styles';

@customElement('u-card')
export class Card extends LitElement {

  static override styles = [
    BaseStyles.styles,
    css`
      :host {
        display: block;
        position: relative;
        border-radius: var(--u-card-shape, var(--u-shape-corner-medium, 12px));
      }

      :host(:not(:first-child)) {
        margin-top: 8px;
      }

      :host([variant=elevated]) {
        background-color: var(--u-surface-container-low-color, #f7f2fa);
        --u-elevation-level: var(--u-elevated-card-elevation-level, 1);
      }

      :host([variant=filled]) {
        background-color: var(--u-surface-container-highest-color, #e6e0e9);
      }

      :host([variant=outlined]) {
        border: var(--u-outlined-card-outline-width, 1px) solid var(--u-outlined-card-outline-color, var(--u-outline-variant-color, #cac4d0));
      }
    `];

  @property({reflect: true}) variant: 'filled' | 'elevated' | 'outlined' = 'elevated';

  override render(): HTMLTemplateResult {
    return html`
      <u-elevation></u-elevation>
      <slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-card': Card;
  }
}
