import { html, HTMLTemplateResult, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export abstract class UmSetBase extends LitElement {

  /**
   * Set the alignment of the set at the `start`, `center` or at the `end`.
   */
  @property({reflect: true}) alignment: 'start' | 'center' | 'end' = 'start';

  override render(): HTMLTemplateResult {
    return html`
      <slot></slot>`;
  }
}
