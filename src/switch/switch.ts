import { html, HTMLTemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './switch.styles.js';

import { UmSelectionControl } from '../shared/selection-control/selection-control.js';

@customElement('u-switch')
export class UmSwitch extends UmSelectionControl {
  static override styles = [
    baseStyles,
    styles
  ];

  constructor() {
    super();
  }

  protected override renderRipple = false;

  protected override renderIndicator(): HTMLTemplateResult {
    return html`<div class="indicator">
      <div class="state-layer">
        <div class="handle"></div>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-switch': UmSwitch;
  }
}
