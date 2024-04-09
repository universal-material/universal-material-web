import { CSSResult, html, HTMLTemplateResult, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { ButtonBase } from './button-base';
import { styles as buttonBaseStyles } from './button-base.styles';
import { styles } from './fab.styles';

@customElement('u-fab')
export class FabButton extends ButtonBase {

  static override styles: CSSResult | CSSResult[] = [buttonBaseStyles, styles];
  
  /**
   * The FAB color variant to render.
   */
  @property({reflect: true}) color: 'primary' | 'secondary' | 'tertiary' | 'surface' | 'branded' = 'primary';

  /**
   * The size of the FAB.
   */
  @property({reflect: true}) size: 'small' | 'medium' | 'large' = 'medium';

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
      <span class="icon" aria-hidden="true"><slot name="icon"></slot></span>
      ${this.label ? labelTag : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-fab': FabButton;
  }
}
