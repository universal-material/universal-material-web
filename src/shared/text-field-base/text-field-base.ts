import { CSSResultGroup } from '@lit/reactive-element/css-tag';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { styles } from './text-field-base.styles.js';

import { UmFieldBase } from '../../field/field-base.js';

export abstract class UmTextFieldBase extends UmFieldBase {
  static readonly formAssociated = true;

  static override styles: CSSResultGroup = [UmFieldBase.styles, styles];

  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  override empty = true;

  @property({reflect: true}) placeholder: string | undefined;

  get form(): HTMLFormElement | null {
    return this.elementInternals.form;
  }

  protected readonly elementInternals: ElementInternals;

  constructor() {
    super();
    this.elementInternals = this.attachInternals();
  }
}
