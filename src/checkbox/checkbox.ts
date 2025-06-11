import { PropertyValues } from '@lit/reactive-element';

import { html, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { UmSelectionControl } from '../shared/selection-control/selection-control.js';
import { styles } from './checkbox.styles.js';

@customElement('u-checkbox')
export class UmCheckbox extends UmSelectionControl {
  static override styles = [
    baseStyles,
    styles,
  ];

  #indeterminate = false;

  @property({ type: Boolean, attribute: 'hide-state-layer', reflect: true }) hideStateLayer = false;

  @property({ type: Boolean })
  get indeterminate(): boolean {
    return this.#indeterminate;
  }

  set indeterminate(indeterminate: boolean) {
    this.#indeterminate = indeterminate;

    if (!indeterminate) {
      this.input?.classList.remove('indeterminate');
      return;
    }

    this.input?.classList.add('indeterminate');
    this.elementInternals.setFormValue(null);
  }

  override get checked(): boolean {
    return super.checked;
  }

  override set checked(checked: boolean) {
    super.checked = checked;
    this.indeterminate = false;
  }

  constructor() {
    super();
  }

  override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);

    this.indeterminate = this.indeterminate;
  }

  protected override renderIndicator(): HTMLTemplateResult {
    return html`
      <div class="border"><div class="indicator"></div></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-checkbox': UmCheckbox;
  }
}
