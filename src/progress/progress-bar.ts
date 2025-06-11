import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles } from './progress-bar.styles.js';

@customElement('u-progress-bar')
export class UmProgressBar extends LitElement {
  static override styles = [styles];

  @property({ type: Number }) value: number | undefined;
  @property({ type: Number }) max = 1;

  protected override render(): TemplateResult {
    return this.value === undefined
      ? this.#renderIndeterminate()
      : this.#renderDeterminate();
  }

  #renderIndeterminate(): TemplateResult {
    return html`
      <div class="indeterminate">
        <div class="bar track first"></div>
        <div class="bar active fast"></div>
        <div class="bar track middle"></div>
        <div class="bar active slow"></div>
        <div class="bar track last"></div>
      </div>
    `;
  }

  #renderDeterminate(): TemplateResult {
    const proportion = this.value! / this.max;

    const percentage = Math.floor(proportion * 1000) / 10;
    const trackPercentage = 100 - percentage;

    return html`
      <div class="determinate">
        <div class="bar active" style="flex-basis: ${percentage}%"></div>
        <div class="bar track" style="flex-basis: ${trackPercentage}%"></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-progress-bar': UmProgressBar;
  }
}
