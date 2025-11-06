import { html, HTMLTemplateResult, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UmButtonBase } from './button-base.js';
import { styles } from './fab.styles.js';

export type UmFabColor = 'primary' | 'secondary' | 'tertiary' | 'surface' | 'branded';
export type UmFabSize = 'small' | 'medium' | 'large';

@customElement('u-fab')
export class UmFab extends UmButtonBase {

  static override styles = [UmButtonBase.styles, styles];

  /**
   * The FAB color variant to render.
   */
  @property() color: UmFabColor = 'primary';

  /**
   * The size of the FAB.
   */
  @property() size: UmFabSize = 'medium';

  /**
   * The text to display the FAB.
   */
  @property() label: string | null = null;

  /**
   * Lowers the FAB's elevation.
   */
  @property({ type: Boolean, reflect: true }) lowered = false;

  get extended(): boolean {
    return !!this.label;
  }

  protected override _getContainerClasses(): Record<string, boolean> {
    return {
      ...super._getContainerClasses(),
      [this.color]: true,
      [this.size]: true,
      lowered: this.lowered,
      extended: this.extended,
    };
  }

  protected override _renderContent(): HTMLTemplateResult {
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
