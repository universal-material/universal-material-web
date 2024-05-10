import { CSSResultGroup } from '@lit/reactive-element/css-tag';
import { html, HTMLTemplateResult, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';

import { styles as baseStyles } from '../base.styles.js';
import { styles } from './text-field-base.styles.js';

import { config } from '../../config.js';

import '../../field/field.js';

export abstract class UmTextFieldBase extends LitElement {
  static readonly formAssociated = true;

  static override styles: CSSResultGroup = [baseStyles, styles];

  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  @property() variant = config.fields.defaultAppearance;
  @property() label: string | undefined;
  @property() counter: string | undefined;
  @property({reflect: true}) placeholder: string | undefined;
  @property({attribute: 'supporting-text'}) supportingText: string | undefined;
  @property({attribute: 'error-text'}) errorText: string | undefined;

  @property({type: Boolean, reflect: true}) disabled = false;
  @property({type: Boolean, reflect: true}) invalid = false;

  get form(): HTMLFormElement | null {
    return this.elementInternals.form;
  }

  @state()
  get empty() { return false; }

  protected readonly elementInternals: ElementInternals;

  constructor() {
    super();
    this.elementInternals = this.attachInternals();
  }

  protected override render(): HTMLTemplateResult {
    const label = this.label
      ? html`<label slot="label" id="label">${this.label}</label>`
      : html`<slot slot="label" name="label"></slot>`;

    const supportingText = this.supportingText
      ? html`<span slot="supporting-text">${this.supportingText}</span>`
      : html`<slot slot="supporting-text" name="supporting-text"></slot>`;

    const errorText = this.errorText
      ? html`<span slot="error-text">${this.errorText}</span>`
      : html`<slot slot="error-text" name="error-text"></slot>`;

    const counter = this.counter
      ? html`<span slot="counter">${this.counter}</span>`
      : html`<slot slot="counter" name="counter"></slot>`;

    return html`
      <u-field
        .variant=${this.variant}
        ?invalid=${this.invalid}
        ?disabled=${this.disabled}
        ?empty=${this.empty}>
        ${label}
        <slot slot="leading-icon" name="leading-icon"></slot>
        ${this.renderContent()}
        <slot slot="trailing-icon" name="trailing-icon"></slot>
        ${supportingText}
        ${errorText}
        ${counter}
      </u-field>`;
  }

  protected abstract renderContent(): HTMLTemplateResult;
}
