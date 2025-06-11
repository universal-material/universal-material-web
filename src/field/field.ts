import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UmFieldBase } from './field-base.js';

@customElement('u-field')
export class UmField extends UmFieldBase {

  @property({ type: Boolean }) autoEmpty = false;

  private control: HTMLInputElement | null = null;

  override connectedCallback() {
    super.connectedCallback();
    this.control = this.querySelector('input, select, button, textarea');
    this.control?.addEventListener('input', this.handleControlInput);

    if (this.autoEmpty) {
      this.empty = !this.control?.value;
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.control?.removeEventListener('input', this.handleControlInput);
    this.control = null;
  }

  private readonly handleControlInput = () => {
    if (this.autoEmpty) {
      this.empty = !this.control?.value;
    }
  };

  protected override renderControl() {
    return html`
      <slot name="prefix"></slot>
      <div class="input"><slot></slot></div>
      <slot name="suffix"></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-field': UmField;
  }
}
