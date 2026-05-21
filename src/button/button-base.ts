import { CSSResultGroup } from '@lit/reactive-element/css-tag';

import { property } from 'lit/decorators.js';

import { ButtonWrapper } from '../shared/button-wrapper.js';
import { styles } from './button-base.styles.js';

export abstract class ButtonBase extends ButtonWrapper {

  static readonly formAssociated = true;

  static override styles: CSSResultGroup = [ButtonWrapper.styles, styles];

  /**
   * The button behavior. Mirrors the native `type` attribute and accepts
   * values like `submit`, `reset` or `button`.
   */
  @property() type = 'submit';

  /**
   * The value submitted with the form when this button is the submitter
   */
  @property({ reflect: true }) value = '';

  get form(): HTMLFormElement | null {
    return this.#elementInternals.form;
  }

  readonly #elementInternals: ElementInternals;

  constructor() {
    super();
    this.#elementInternals = this.attachInternals();
  }

  protected override _handleClick(_: UIEvent): void {

    if (this.type === 'button' || !!this.href) {
      return;
    }

    if (!this.form) {
      return;
    }

    this.#elementInternals.setFormValue(this.value);

    if (this.type === 'reset') {
      this.form.reset();
      return;
    }

    this.form.addEventListener(
      'submit',
      submitEvent => {
        Object.defineProperty(submitEvent, 'submitter', {
          configurable: true,
          enumerable: true,
          get: () => this,
        });
      },
      { capture: true, once: true },
    );
    this.form.requestSubmit();
  }
}
