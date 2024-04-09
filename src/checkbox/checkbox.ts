import { css, html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, query, queryAssignedElements } from 'lit/decorators.js';

import { Ripple } from '../ripple/ripple';
import { styles as baseStyles } from '../shared/base.styles';

@customElement('u-checkbox')
export class Checkbox extends LitElement {
  static override styles = [
    baseStyles,
    css`
      :host {
        position: relative;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 48px;
        height: 48px;
      }
      
      ::slotted(input) {
        position: relative;
        padding: 0;
        margin: 0;
        aspect-ratio: 1;
        height: 100%;
        z-index: 1;
        appearance: none;
      }
      
      .touch {
        position: absolute;
        inset: 0;
        border-radius: 9999px;
      }
    `
  ];

  @query('u-ripple') private readonly ripple!: Ripple;
  @queryAssignedElements({selector: 'input', flatten: true})
  private readonly assignedInputs!: HTMLInputElement[];

  private input: HTMLInputElement | undefined;

  override render(): HTMLTemplateResult {
    return html`
      <div class="touch">
        <u-ripple><slot @slotchange="${this.handleSlotChange}"></slot></u-ripple>
      </div>`;
  }

  private handleSlotChange(): void {
    console.log('slotchange');

    if (this.input) {
      this.input.removeEventListener('click', this.handleInputChange);
    }

    this.input = this.assignedInputs[0];

    if (this.input) {
      this.input.addEventListener('click', this.handleInputChange);
    }
  }

  private handleInputChange = (e: MouseEvent) => {
    if (this.input !== document.elementFromPoint(e.clientX, e.clientY)) {
      this.ripple.createRipple();
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'u-checkbox': Checkbox;
  }
}
