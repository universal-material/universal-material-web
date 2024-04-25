import { property } from 'lit/decorators.js';

import { UmButtonWrapper } from '../shared/button-wrapper.js';

export abstract class UmButtonBase extends UmButtonWrapper {

  static readonly formAssociated = true;

  @property() type: string = 'submit';

  @property({reflect: true}) value: string = '';

  /**
   * The `<form>` element to associate the button with (its form owner). The value of this attribute must be the id of a `<form>` in the same document. (If this attribute is not set, the button is associated with its ancestor `<form>` element, if any.)
   * @link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#form
   */
  @property()
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

    if (this.type === 'submit') {
      this.form.requestSubmit();
      return;
    }

    this.form.reset();
  }

}
