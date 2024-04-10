import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles } from './container.styles.js';

type SpacingSizes = 'none' | 'small' | 'medium ' | 'large' | 'extra-large';

@customElement('u-container')
export class UmContainer extends LitElement {

  static override styles = styles;

  @property({reflect: true}) margin: SpacingSizes | undefined;

  override render(): HTMLTemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-container': UmContainer;
  }
}
