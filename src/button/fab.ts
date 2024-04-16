import { CSSResult, html, HTMLTemplateResult, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles as buttonWrapperStyles } from '../shared/button-wrapper.styles';
import { UmButtonBase } from './button-base';
import { styles } from './fab.styles';

export type UmFabColor = 'primary' | 'secondary' | 'tertiary' | 'surface' | 'branded';
export type UmFabSize = 'small' | 'medium' | 'large';

@customElement('u-fab')
export class UmFab extends UmButtonBase {

  static override styles: CSSResult | CSSResult[] = [buttonWrapperStyles, styles];
  
  /**
   * The FAB color variant to render.
   */
  @property({reflect: true}) color: UmFabColor = 'primary';

  /**
   * The size of the FAB.
   */
  @property({reflect: true}) size: UmFabSize = 'medium';

  /**
   * The text to display the FAB.
   */
  @property({reflect: true}) label: string | null = null;

  /**
   * Lowers the FAB's elevation.
   */
  @property({type: Boolean, reflect: true}) lowered = false;

  @property({type: Boolean, reflect: true})
  get extended(): boolean {
    return !!this.label;
  }

  protected override renderContent(): HTMLTemplateResult {
    const labelTag = html`<span>${this.label}</span>`;

    return html`
      <span class="icon" aria-hidden="true"><slot></slot></span>
      ${this.label ? labelTag : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-fab': UmFab;
  }
}
