import { property } from 'lit/decorators.js';

import { styles } from './button-base.styles.js';

import { UmButtonWrapper } from '../shared/button-wrapper.js';

export abstract class UmButtonBase extends UmButtonWrapper {

  static readonly formAssociated = true;

  static override styles = [UmButtonWrapper.styles, styles]

  @property() type: string = 'submit';

  @property({reflect: true}) value: string = '';

  get form(): HTMLFormElement | null {
    return this.#elementInternals.form;
  }

  readonly #elementInternals: ElementInternals;

  constructor() {
    super();
    this.#elementInternals = this.attachInternals();
  }

  protected override handleClick(_: UIEvent): void {

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
      (submitEvent) => {
        Object.defineProperty(submitEvent, 'submitter', {
          configurable: true,
          enumerable: true,
          get: () => this,
        });
      },
      {capture: true, once: true},
    );
    this.form.requestSubmit();
  }
}
