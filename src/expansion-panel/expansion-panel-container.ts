import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { ExpansionPanel } from './expansion-panel.js';
import { styles } from './expansion-panel-container.styles.js';

/**
 * Coordinates a group of `<u-expansion-panel>` children. When `multi` is `false`
 * (default), opening one panel closes the others.
 *
 * @slot - Default slot for `<u-expansion-panel>` children.
 */
@customElement('u-expansion-panel-container')
export class ExpansionPanelContainer extends LitElement {
  static override styles = [baseStyles, styles];

  /**
   * When `true`, multiple panels may be expanded simultaneously.
   */
  @property({ type: Boolean, reflect: true }) multi = false;

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('change', this.#handlePanelChange);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('change', this.#handlePanelChange);
  }

  override render(): HTMLTemplateResult {
    return html`<slot></slot>`;
  }

  #handlePanelChange = (event: Event) => {
    if (this.multi) return;
    const target = event.target as ExpansionPanel | null;
    if (!(target instanceof ExpansionPanel) || !target.expanded) return;
    for (const panel of this.querySelectorAll<ExpansionPanel>('u-expansion-panel')) {
      if (panel !== target && panel.expanded) {
        panel.expanded = false;
      }
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'u-expansion-panel-container': ExpansionPanelContainer;
  }
}
