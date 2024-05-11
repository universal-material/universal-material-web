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

  @property({reflect: true}) placeholder: string | undefined;

  get form(): HTMLFormElement | null {
    return this.elementInternals.form;
  }

  // @state()
  // get empty() { return false; }

  protected readonly elementInternals: ElementInternals;

  constructor() {
    super();
    this.elementInternals = this.attachInternals();
  }
  //
  // protected override render(): HTMLTemplateResult {
  //   const supportingText = this.supportingText
  //     ? html`<span slot="supporting-text">${this.supportingText}</span>`
  //     : html`<slot slot="supporting-text" name="supporting-text"></slot>`;
  //
  //   const errorText = this.errorText
  //     ? html`<span slot="error-text">${this.errorText}</span>`
  //     : html`<slot slot="error-text" name="error-text"></slot>`;
  //
  //   const counter = this.counter
  //     ? html`<span slot="counter">${this.counter}</span>`
  //     : html`<slot slot="counter" name="counter"></slot>`;
  //
  //   return html`
  //     <u-field
  //       .variant=${this.variant}
  //       ?invalid=${this.invalid}
  //       ?disabled=${this.disabled}
  //       ?empty=${this.empty}>
  //       <label slot="label" id="label">
  //         <slot name="label">${this.label}</slot>
  //       </label>
  //       <slot slot="leading-icon" name="leading-icon"></slot>
  //       ${this.renderContent()}
  //       <slot slot="trailing-icon" name="trailing-icon"></slot>
  //       ${supportingText}
  //       ${errorText}
  //       ${counter}
  //     </u-field>`;
  // }
  //
  // protected abstract renderContent(): HTMLTemplateResult;
}
