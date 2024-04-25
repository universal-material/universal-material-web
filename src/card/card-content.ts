import { HTMLTemplateResult, LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './card-content.styles.js';

@customElement('u-card-content')
export class UmCardContent extends LitElement {

  static override styles = [baseStyles, styles];

  @property({type: Boolean, attribute: 'has-content', reflect: true}) hasContent = false;

  override render(): HTMLTemplateResult {
    return html`
      <slot @slotchange="${this.handleSlotChange}"></slot>`;
  }

  private handleSlotChange(e: Event) {
    const slot = <HTMLSlotElement>e.target;

    this.hasContent = slot.assignedElements({flatten: true}).length > 0;

    if (this.hasContent) {
      return;
    }

    const nodes = slot.assignedNodes({flatten: true});

    for (const node of nodes) {
      if (node.nodeValue?.trim()) {
        this.hasContent = true;
        return;
      }
    }

    this.hasContent = false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-card-content': UmCardContent;
  }
}
