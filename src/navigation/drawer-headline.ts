import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

import { UmButtonWrapper } from '../shared/button-wrapper.js';
import { styles } from './drawer-headline.styles.js';

@customElement('u-drawer-headline')
export class UmDrawerHeadline extends LitElement {

  static override styles = [
    UmButtonWrapper.styles,
    styles,
  ];

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-drawer-headline': UmDrawerHeadline;
  }
}
