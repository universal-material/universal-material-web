import { consume, Context, ContextProvider } from '@lit/context';
import { CSSResultGroup } from '@lit/reactive-element/css-tag';
import { html, HTMLTemplateResult, LitElement } from 'lit';
import { property, query, queryAssignedElements, state } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './field-base.styles.js';

import { fieldDefaultsContext } from './field-defaults-context.js';
import { UmFieldDefaults } from './field-defaults.js';

export abstract class UmFieldBase extends LitElement {
  static override styles: CSSResultGroup = [baseStyles, styles];

  @consume({context: fieldDefaultsContext, subscribe: true})
  @state()
  private config: UmFieldDefaults | undefined;

  @property() variant: 'filled' | 'outlined' | undefined = 'filled';

  @property() label: string | undefined;
  @property() counter: string | undefined;
  @property({attribute: 'supporting-text'}) supportingText: string | undefined;
  @property({attribute: 'error-text'}) errorText: string | undefined;

  @property({type: Boolean, reflect: true}) empty = false;
  @property({type: Boolean, reflect: true}) disabled = false;
  @property({type: Boolean, reflect: true}) invalid = false;

  static setDefaults(contextRoot: HTMLElement, config: UmFieldDefaults): ContextProvider<Context<HTMLElement, UmFieldDefaults>> {
    return new ContextProvider(contextRoot, {
      context: fieldDefaultsContext,
      initialValue: config
    });
  }

  /**
   * Whether the field has a leading icon or not
   *
   * _Note:_ Readonly
   */
  @property({type: Boolean, attribute: 'has-leading-icon', reflect: true}) hasLeadingIcon = false;

  /**
   * Whether the field has a trailing icon or not
   *
   * _Note:_ Readonly
   */
  @property({type: Boolean, attribute: 'has-trailing-icon', reflect: true}) hasTrailingIcon = false;

  /**
   * Whether the field has an error text or not
   *
   * _Note:_ Readonly
   */
  @property({type: Boolean, attribute: 'has-error-text', reflect: true}) hasErrorText = false;

  @queryAssignedElements({slot: 'leading-icon', flatten: true})
  private readonly assignedLeadingIcons!: HTMLElement[];

  @queryAssignedElements({slot: 'trailing-icon', flatten: true})
  private readonly assignedTrailingIcons!: HTMLElement[];

  @queryAssignedElements({slot: 'error-text', flatten: true})
  private readonly assignedErrorTexts!: HTMLElement[];

  @query('.label') labelElement!: HTMLElement;
  @query('.container') container!: HTMLElement;

  private labelSizeObserver: ResizeObserver | null = null;

  constructor() {
    super();
    this.variant = undefined;
  }

  protected override render(): HTMLTemplateResult {
    return html`
      <div class="container ${this.variant ?? this.config?.variant ?? 'filled'}">
        <slot
          class="icon leading-icon"
          name="leading-icon"
          @slotchange="${this.handleLeadingIconSlotChange}">
        </slot>
        <label class="label" slot="label" id="label">
          <slot name="label">${this.label}</slot>
        </label>
        <div class="input-wrapper" part="wrapper">
          ${this.renderControl()}
        </div>
        <slot
          class="icon trailing-icon"
          name="trailing-icon"
          @slotchange="${this.handleTrailingIconSlotChange}">
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
        <slot class="counter" name="counter">
          <div>${this.counter}</div>
        </slot>
      </div>
    `;
  }

  protected abstract renderControl(): HTMLTemplateResult;

  override connectedCallback() {
    super.connectedCallback();
    this.hasLeadingIcon = !!this.assignedLeadingIcons.length;

    setTimeout(() => {
      this.labelSizeObserver = new ResizeObserver(() => this.setLabelWidthProperties())
      this.labelSizeObserver.observe(this.labelElement);
      this.setLabelWidthProperties();
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    this.labelSizeObserver!.disconnect();
    this.labelSizeObserver = null;
  }

  private handleLeadingIconSlotChange() {
    this.labelElement.style.transition = 'none';
    this.hasLeadingIcon = this.assignedLeadingIcons.length > 0;

    setTimeout(() => {
      this.labelElement.style.transition = '';
    });
  }

  private handleTrailingIconSlotChange() {
    this.hasTrailingIcon = this.assignedTrailingIcons.length > 0;
  }

  private handleErrorTextSlotChange() {
    this.hasErrorText = this.assignedErrorTexts.length > 0;
  }

  private setLabelWidthProperties() {

    const width = this.labelElement.offsetWidth;

    this.style.setProperty('--u-field-label-width', `${width}px`);
    this.style.setProperty('--u-field-label-half-width', `${width / 2}px`);

    if (!width) {
      this.container.classList.add('no-label');
    }
  }
}
