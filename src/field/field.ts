import { PropertyValues } from '@lit/reactive-element';
import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js';

import { config } from '../config';
import { styles as baseStyles } from '../shared/base.styles';
import { styles } from './field.styles.js';

@customElement('u-field')
export class UmField extends LitElement {
  static override styles = [baseStyles, styles];

  @property({reflect: true}) variant: 'filled' | 'outlined' = config.fields.defaultAppearance;
  @property({type: Boolean, reflect: true}) empty = true;
  @property({type: Boolean, reflect: true}) disabled = false;
  @property({type: Boolean, reflect: true}) invalid = false;

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

  /**
   * Whether the field has a counter or not
   *
   * _Note:_ Readonly
   */
  @property({type: Boolean, attribute: 'has-counter', reflect: true}) hasCounter = false;

  @queryAssignedElements({slot: 'leading-icon', flatten: true})
  private readonly assignedLeadingIcons!: HTMLElement[];

  @queryAssignedElements({slot: 'trailing-icon', flatten: true})
  private readonly assignedTrailingIcons!: HTMLElement[];

  @queryAssignedElements({slot: 'error-text', flatten: true})
  private readonly assignedErrorTexts!: HTMLElement[];

  @queryAssignedElements({slot: 'counter', flatten: true})
  private readonly assignedCounters!: HTMLElement[];

  @query('.counter') counter: HTMLElement | undefined;
  @query('.label') label!: HTMLElement;

  private control: HTMLInputElement | null = null;
  private labelSizeObserver: ResizeObserver | null = null;

  protected override render(): HTMLTemplateResult {
    return html`
      <div class="field">
        <slot
          class="icon leading-icon"
          name="leading-icon"
          @slotchange="${this.handleLeadingIconSlotChange}">
        </slot>
        <slot class="label" name="label"></slot>
        <slot class="input"></slot>
        <slot
          class="icon trailing-icon"
          name="trailing-icon"
          @slotchange="${this.handleTrailingIconSlotChange}">
        </slot>
      </div>
      <div class="supporting-text">
        <slot
          class="error-text"
          name="error-text"
          @slotchange="${this.handleErrorTextSlotChange}"></slot>
        <slot class="supporting-text-slot" name="supporting-text" id="supporting-text"></slot>
        <slot
          class="counter"
          name="counter"
          @slotchange="${this.handleCounterSlotChange}"></slot>
      </div>
    `;
  }

  override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    this.hasLeadingIcon = !!this.assignedLeadingIcons.length;

    this.labelSizeObserver = new ResizeObserver(() => this.setLabelWidthProperties())
    this.labelSizeObserver.observe(this.label);
    this.setLabelWidthProperties();
  }

  override connectedCallback() {
    super.connectedCallback();
    this.control = <HTMLInputElement | null>this.querySelector('input, select, button, textarea');
    this.control?.addEventListener('input', this.handleControlInput);
    this.empty = !this.control?.value;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.control?.removeEventListener('input', this.handleControlInput);
    this.control = null;

    this.labelSizeObserver!.disconnect();
    this.labelSizeObserver = null;
  }

  private handleControlInput = () => {
    this.empty = !this.control?.value;
  }

  private handleLeadingIconSlotChange() {
    this.label.style.transition = 'none';
    this.hasLeadingIcon = this.assignedLeadingIcons.length > 0;

    setTimeout(() => {
      this.label.style.transition = '';
    });
  }

  private handleTrailingIconSlotChange() {
    this.hasTrailingIcon = this.assignedTrailingIcons.length > 0;
  }

  private handleErrorTextSlotChange() {
    this.hasErrorText = this.assignedErrorTexts.length > 0;
  }

  private handleCounterSlotChange() {
    this.hasCounter = this.assignedCounters.length > 0;
  }

  private setLabelWidthProperties() {

    const width = this.label.offsetWidth;
    this.style.setProperty('--u-field-label-width', `${width}px`);
    this.style.setProperty('--u-field-label-half-width', `${width / 2}px`);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-field': UmField;
  }
}
