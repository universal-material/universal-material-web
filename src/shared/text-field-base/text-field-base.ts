import { PropertyValues } from '@lit/reactive-element';
import { CSSResultGroup } from '@lit/reactive-element/css-tag';

import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { FieldBase } from '../../field/field-base.js';
import { styles } from './text-field-base.styles.js';

/** The validity flags a subclass reports, plus the message/anchor for the bubble. */
export interface FieldValidity {
  flags: ValidityStateFlags;
  message: string;
  anchor?: HTMLElement;
}

export abstract class TextFieldBase extends FieldBase {
  static readonly formAssociated = true;

  static override styles: CSSResultGroup = [FieldBase.styles, styles];

  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /**
   * Whether the field is empty or not. This changes the behavior of the floating label when the field is not focused.
   */
  override empty = true;

  /**
   * The placeholder text shown when the field is empty
   */
  @property({ reflect: true }) placeholder = '';

  /**
   * Whether the field must have a value to satisfy constraint validation.
   * Drives `checkValidity()`/`reportValidity()` and blocks native form submit.
   */
  @property({ type: Boolean, reflect: true }) required = false;

  get form(): HTMLFormElement | null {
    return this.elementInternals.form;
  }

  /** The live `ValidityState` of the field (mirrors a native form control). */
  get validity(): ValidityState {
    return this.elementInternals.validity;
  }

  /** The message shown by `reportValidity()` when the field is invalid. */
  get validationMessage(): string {
    return this.elementInternals.validationMessage;
  }

  protected readonly elementInternals: ElementInternals;

  constructor() {
    super();
    this.elementInternals = this.attachInternals();
  }

  /**
   * Reports the current validity. Subclasses override to delegate to a native
   * input (`u-text-field`) or compute their own (`u-select`). The default only
   * enforces `required` against the empty state.
   */
  protected _getValidity(): FieldValidity {
    const valueMissing = this.required && this.empty;

    return {
      flags: { valueMissing },
      message: valueMissing ? 'Please fill out this field.' : '',
    };
  }

  /** Pushes the subclass's validity into the ElementInternals form state. */
  protected _syncValidity(): void {
    const { flags, message, anchor } = this._getValidity();
    const isValid = !Object.values(flags).some(Boolean);

    if (isValid) {
      this.elementInternals.setValidity({});
      return;
    }

    // A non-empty message is required when any flag is set.
    this.elementInternals.setValidity(flags, message || 'Invalid value.', anchor);
  }

  /** Returns whether the field is valid (fires an `invalid` event if not). */
  checkValidity(): boolean {
    this._syncValidity();
    return this.elementInternals.checkValidity();
  }

  /**
   * Like `checkValidity()`, but also surfaces the native validation bubble and
   * reflects the result onto the visual `invalid` state.
   */
  reportValidity(): boolean {
    this._syncValidity();
    const valid = this.elementInternals.reportValidity();
    this.invalid = !valid;
    return valid;
  }

  protected override updated(changed: PropertyValues): void {
    super.updated(changed);
    // Keep the form-level validity current so native submit honors constraints.
    this._syncValidity();
  }
}
