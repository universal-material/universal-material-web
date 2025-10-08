import { consume, Context, ContextProvider } from '@lit/context';
import { CSSResultGroup } from '@lit/reactive-element/css-tag';

import { html, LitElement, nothing, TemplateResult } from 'lit';
import { property, query, queryAssignedElements, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './field-base.styles.js';
import { fieldDefaultsContext } from './field-defaults-context.js';
import { UmFieldDefaults } from './field-defaults.js';

export abstract class UmFieldBase extends LitElement {
  static override styles: CSSResultGroup = [baseStyles, styles];

  @consume({ context: fieldDefaultsContext, subscribe: true })
  @state()
  private readonly config: UmFieldDefaults | undefined;

  @property() variant: 'filled' | 'outlined' | undefined = 'filled';

  /**
   * The floating label for the field
   */
  @property()
  label: string | undefined;

  @state() protected _innerCounter: string | undefined;
  @property() counter: string | undefined;

  @property({ type: Boolean, attribute: 'hide-counter' }) hideCounter = false;

  /**
   * Supporting text conveys additional information about the field, such as how it will be used
   */
  @property({ attribute: 'supporting-text' }) supportingText: string | undefined;

  /**
   * For text fields that validate their content (such as passwords), replace supporting text with error text when applicable.
   * If `errorText` is not an empty string, changing the property `invalid` to `true` will show the `errorText` instead of `supportingText`
   */
  @property({ attribute: 'error-text' }) errorText: string | undefined;

  /**
   * Whether the field is empty or not. This changes the behavior of the floating label when the field is not focused.
   */
  @property({ type: Boolean, reflect: true }) empty = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Get or sets where or not the field is in a visually invalid state.
   */
  @property({ type: Boolean, reflect: true }) invalid = false;

  static setDefaults(
    contextRoot: HTMLElement,
    config: UmFieldDefaults,
  ): ContextProvider<Context<HTMLElement, UmFieldDefaults>> {
    return new ContextProvider(contextRoot, {
      context: fieldDefaultsContext,
      initialValue: config,
    });
  }

  /**
   * Whether the field has a leading icon or not
   *
   * _Note:_ Readonly
   */
  @property({ type: Boolean, attribute: 'has-leading-icon', reflect: true })
  hasLeadingIcon = false;

  /**
   * Whether the field has a trailing icon or not
   *
   * _Note:_ Readonly
   */
  @property({ type: Boolean, attribute: 'has-trailing-icon', reflect: true })
  hasTrailingIcon = false;

  /**
   * Whether the field has an error text or not
   *
   * _Note:_ Readonly
   */
  @property({ type: Boolean, attribute: 'has-error-text', reflect: true })
  hasErrorText = false;

  @queryAssignedElements({ slot: 'leading-icon', flatten: true })
  protected readonly assignedLeadingIcons!: HTMLElement[];

  @queryAssignedElements({ slot: 'trailing-icon', flatten: true })
  protected readonly assignedTrailingIcons!: HTMLElement[];

  @queryAssignedElements({ slot: 'error-text', flatten: true })
  private readonly assignedErrorTexts!: HTMLElement[];

  @query('.label', true) private readonly _labelElement!: HTMLElement;
  @query('.container', true) protected _container!: HTMLElement;

  constructor() {
    super();
    this.variant = undefined;
  }

  protected override render(): TemplateResult {
    const variant = this.variant ?? this.config?.variant ?? 'filled';

    const classes = {
      [variant]: true,
      'no-label': !this.label,
    };

    const counter = html`
      <slot class="counter" name="counter">
        <div>${this.counter ?? this._innerCounter}</div>
      </slot>
    `;

    const outline = html`
      <div class="outline">
        <div class="outline-start"></div>
        <div class="outline-notch">
          <div class="outline-notch-label">${this.label}</div>
        </div>
        <div class="outline-end"></div>
      </div>
    `;

    return html`
      <div class="container ${classMap(classes)}">
        ${variant === 'outlined' ? outline : nothing}
        <slot class="icon leading-icon" name="leading-icon" @slotchange="${this.handleLeadingIconSlotChange}"></slot>
        <label class="label" id="label">${this.label}</label>
        <div class="input-wrapper" part="wrapper">${this.renderControl()}</div>
        <slot class="icon trailing-icon" name="trailing-icon" @slotchange="${this.handleTrailingIconSlotChange}">
          <span>${this.renderDefaultTrailingIcon()}</span>
        </slot>
      </div>
      <div class="supporting-text" id="supporting-text">
        <slot class="error-text" name="error-text" @slotchange="${this.handleErrorTextSlotChange}">
          <div>${this.errorText}</div>
        </slot>
        <slot name="supporting-text" id="supporting-text">
          <div>${this.supportingText}</div>
        </slot>
        ${this.hideCounter ? nothing : counter}
      </div>
      ${this.renderAfterContent()}
    `;
  }

  protected abstract renderControl(): TemplateResult;

  protected renderAfterContent(): TemplateResult {
    return html``;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.hasLeadingIcon = !!this.assignedLeadingIcons.length;
  }

  private handleLeadingIconSlotChange() {
    this._labelElement.style.transition = 'none';
    this.hasLeadingIcon = this.assignedLeadingIcons.length > 0;

    setTimeout(() => {
      this._labelElement.style.transition = '';
    });
  }

  private handleTrailingIconSlotChange() {
    this.hasTrailingIcon = this.assignedTrailingIcons.length > 0;
  }

  private handleErrorTextSlotChange() {
    this.hasErrorText = this.assignedErrorTexts.length > 0;
  }

  protected renderDefaultTrailingIcon(): TemplateResult | typeof nothing {
    return nothing;
  }
}
