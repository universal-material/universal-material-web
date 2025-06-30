import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';

@customElement('u-overflow-menu-item')
export class OverflowMenuItem extends LitElement {
  @property() label = '';
  @property({ type: Boolean }) priority = false;

  @queryAssignedElements() icons!: HTMLElement[];

  protected override render(): HTMLTemplateResult {
    return html`
      <u-icon-button .title="${this.label}">
        <slot></slot>
      </u-icon-button>
    `;
  }
}
