import { LitElement, svg, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles } from './circular-progress.styles.js';

const basePercentage = 255;

// https://codepen.io/ConAntonakos/pen/ryMaOX
@customElement('u-circular-progress')
export class UmCircularProgress extends LitElement {
  static override styles = [styles];

  @property({type: Number}) value: number | undefined;
  @property({type: Number}) max: number = 1;

  protected override render(): TemplateResult {
    return this.value === undefined
      ? this.#renderIndeterminate()
      : this.#renderDeterminate();
  }

  #renderCircle(className: string): TemplateResult {
    return svg`
      <svg class="circular ${className}" viewBox="0 0 50 50">
        <circle
          class="path"
          cx="50%"
          cy="50%"
          r="20"
          fill="none"
          stroke-width="4"
          stroke-miterlimit="10" />
      </svg>`;
  }

  #renderIndeterminate(): TemplateResult {
    return this.#renderCircle('indeterminate');
  }

  #renderDeterminate(): TemplateResult {

    let proportion = this.value! / this.max;
    const offset = proportion === 0 || proportion === 1
      ? 0
      : 0.10625;
    proportion = Math.floor(proportion! * 100) / 100;
    const percentage = basePercentage - basePercentage * proportion;
    const trackPercentage = basePercentage - basePercentage * Math.max(1 - offset - proportion, 0) * -1;

    return svg`
      <svg class="circular on-going" viewBox="0 0 50 50">
        <circle
          class="path"
          cx="50%"
          cy="50%"
          r="20"
          fill="none"
          stroke-width="4"
          stroke-miterlimit="10"
          stroke-dasharray=${`${basePercentage}%`} 
          stroke-dashoffset=${`${percentage}%`} />
      </svg>
      <svg class="circular track on-going" viewBox="0 0 50 50">
        <circle
          class="path"
          cx="50%"
          cy="50%"
          r="20"
          fill="none"
          stroke-width="4"
          stroke-miterlimit="10"
          stroke-dasharray=${`${basePercentage}%`}
          stroke-dashoffset=${`${trackPercentage}%`}/>
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-circular-progress': UmCircularProgress;
  }
}
