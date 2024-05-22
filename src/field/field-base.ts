import { consume, Context, ContextProvider } from '@lit/context';
import { CSSResultGroup } from '@lit/reactive-element/css-tag';
import { html, LitElement, nothing, TemplateResult } from 'lit';
import {
  property,
  query,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './field-base.styles.js';

import { fieldDefaultsContext } from './field-defaults-context.js';
import { UmFieldDefaults } from './field-defaults.js';

export abstract class UmFieldBase extends LitElement {
  static override styles: CSSResultGroup = [baseStyles, styles];

  @consume({ context: fieldDefaultsContext, subscribe: true })
  @state()
  private config: UmFieldDefaults | undefined;

  @property() variant: 'filled' | 'outlined' | undefined = 'filled';

  /**
   * The floating label for the field
   */
  @property() label: string | undefined;

  @state() protected _innerCounter: string | undefined;
  @property() counter: string | undefined;

  @property({ type: Boolean, attribute: 'hide-counter' }) hideCounter = false;

  /**
   * Supporting text conveys additional information about the field, such as how it will be used
   */
  @property({ attribute: 'supporting-text' }) supportingText:
    | string
    | undefined;

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
  private readonly assignedLeadingIcons!: HTMLElement[];

  @queryAssignedElements({ slot: 'trailing-icon', flatten: true })
  private readonly assignedTrailingIcons!: HTMLElement[];

  @queryAssignedElements({ slot: 'error-text', flatten: true })
  private readonly assignedErrorTexts!: HTMLElement[];

  @query('.label') private _labelElement!: HTMLElement;
  @query('.container') protected _container!: HTMLElement;

  private labelSizeObserver: ResizeObserver | null = null;

  constructor() {
    super();
    this.variant = undefined;
  }

  protected override render(): TemplateResult {
    const classes = {
      [this.variant ?? this.config?.variant ?? 'filled']: true,
    };

    const counter = html`
      <slot class="counter" name="counter">
        <div>${this.counter ?? this._innerCounter}</div>
      </slot>
    `;

    return html`
      <div class="container ${classMap(classes)}">
        <slot
          class="icon leading-icon"
          name="leading-icon"
          @slotchange="${this.handleLeadingIconSlotChange}"></slot>
        <label class="label" slot="label" id="label">
          <slot name="label">${this.label}</slot>
        </label>
        <div class="input-wrapper" part="wrapper">${this.renderControl()}</div>
        <slot
          class="icon trailing-icon"
          name="trailing-icon"
          @slotchange="${this.handleTrailingIconSlotChange}">
          <span>${this.renderDefaultTrailingIcon()}</span>
        </slot>
      </div>
      <div class="supporting-text" id="supporting-text">
        <slot
          class="error-text"
          name="error-text"
          @slotchange="${this.handleErrorTextSlotChange}">
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

    this.#attach();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    this.labelSizeObserver?.disconnect();
    this.labelSizeObserver = null;
  }

  async #attach(): Promise<void> {
    await this.updateComplete;
    this.labelSizeObserver = new ResizeObserver(() =>
      this.setLabelWidthProperties(),
    );
    this.labelSizeObserver.observe(this._labelElement);
    this.setLabelWidthProperties();
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

  private setLabelWidthProperties() {
    const width = this._labelElement.offsetWidth;

    this.style.setProperty('--u-field-label-width', `${width}px`);
    this.style.setProperty('--u-field-label-half-width', `${width / 2}px`);

    if (!width) {
      this._container.classList.add('no-label');
      return;
    }

    this._container.classList.remove('no-label');
  }

  protected renderDefaultTrailingIcon(): TemplateResult | typeof nothing {
    return nothing;
  }
}
