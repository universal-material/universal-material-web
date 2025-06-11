import { CSSResultGroup } from '@lit/reactive-element/css-tag';

import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { UmFieldBase } from '../../field/field-base.js';
import { styles } from './text-field-base.styles.js';

export abstract class UmTextFieldBase extends UmFieldBase {
  static readonly formAssociated = true;

  static override styles: CSSResultGroup = [UmFieldBase.styles, styles];

  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /**
   * Whether the field is empty or not. This changes the behavior of the floating label when the field is not focused.
   */
  override empty = true;

  @property({ reflect: true }) placeholder = '';

  get form(): HTMLFormElement | null {
    return this.elementInternals.form;
  }

  protected readonly elementInternals: ElementInternals;

  constructor() {
    super();
    this.elementInternals = this.attachInternals();
  }
}
