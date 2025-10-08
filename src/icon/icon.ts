import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { styles } from './icon.styles.js';

@customElement('u-icon')
export class UmIcon extends LitElement {

  static override styles = [styles];

  protected override render(): HTMLTemplateResult {
    return html`
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-icon': UmIcon;
  }
}
