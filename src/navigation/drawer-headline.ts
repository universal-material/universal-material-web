import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

import { ButtonWrapper } from '../shared/button-wrapper.js';
import { styles } from './drawer-headline.styles.js';

@customElement('u-drawer-headline')
export class DrawerHeadline extends LitElement {

  static override styles = [
    ButtonWrapper.styles,
    styles,
  ];

  override render(): TemplateResult {
    return html`
      <div class="container">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-drawer-headline': DrawerHeadline;
  }
}
