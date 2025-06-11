import { PropertyValues } from '@lit/reactive-element';
import { CSSResultGroup } from '@lit/reactive-element/css-tag';

import { html, HTMLTemplateResult, LitElement, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';

import { styles as baseStyles } from '../base.styles.js';
import { redispatchEvent } from '../events/redispatch-event.js';
import { styles } from './selection-control.styles.js';

import '../../ripple/ripple.js';

export const isActivationClick = (event: Event) => {
  // Event must start at the event target.
  if (event.currentTarget !== event.target) {
    return false;
  }

  // Event must not be retargeted from shadowRoot.
  if (event.composedPath()[0] !== event.target) {
    return false;
  }

  // Target must not be disabled; this should only occur for a synthetically
  // dispatched click.
  if ((event.target as EventTarget & { disabled: boolean }).disabled) {
    return false;
  }

  // This is an activation if the event should not be squelched.
  return !squelchEvent(event);
};

// TODO(https://bugzilla.mozilla.org/show_bug.cgi?id=1804576)
//  Remove when Firefox bug is addressed.
const squelchEvent = (event: Event) => {
  const squelched = isSquelchingEvents;

  if (squelched) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  squelchEventsForMicrotask();
  return squelched;
};

// Ignore events for one microtask only.
let isSquelchingEvents = false;

const squelchEventsForMicrotask = async () => {
  isSquelchingEvents = true;
  // Need to pause for just one microtask.
  /* eslint-disable @typescript-eslint/await-thenable */
  await null;
  isSquelchingEvents = false;
};

export abstract class UmSelectionControl extends LitElement {
  static override styles: CSSResultGroup = [baseStyles, styles];

  static readonly formAssociated = true;

  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  protected readonly elementInternals: ElementInternals;

  @property({ reflect: true }) name: string | undefined = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @query('input') input!: HTMLInputElement;

  get form(): HTMLFormElement | null {
    return this.elementInternals.form;
  }

  override focus(options?: FocusOptions) {
    this.input.focus(options);
  }

  #checked = false;

  protected inputType: 'checkbox' | 'radio' = 'checkbox';
  protected renderRipple = true;
  protected inputDescribedById: string | undefined = undefined;
  protected inputLabelledById: string | undefined = undefined;

  protected abstract renderIndicator(): HTMLTemplateResult;

  /**
   * The element value to use in form submission when checked.
   */
  @property() value = 'on';

  @property({ type: Boolean })
  get checked() {
    return this.input ? this.input.checked : this.#checked;
  }

  set checked(checked: boolean) {
    this.#checked = checked;

    if (this.input) {
      this.input.checked = checked;
    }

    this.elementInternals.setFormValue(checked ? this.value : null);
  }

  @property({ type: Boolean, attribute: 'checked' }) private readonly _checkedAttribute = false;

  protected constructor() {
    super();
    this.elementInternals = this.attachInternals();
  }

  override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);

    this.input.checked = this.#checked;
  }

  override connectedCallback() {
    super.connectedCallback();

    this.addEventListener('click', this._handleClick);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this._handleClick);
  }

  protected override render(): HTMLTemplateResult {
    const ripple = html`
      <u-ripple ?disabled=${this.disabled} @click=${this.#handleRippleClick}></u-ripple>
    `;

    return html`
      <div class="container">
        ${this.renderRipple ? ripple : nothing}
        <input
          id="input"
          type=${this.inputType}
          class="focus-ring"
          .checked=${this._checkedAttribute}
          .disabled=${this.disabled}
          aria-labelledby="${this.inputLabelledById || nothing}"
          aria-describedby="${this.inputDescribedById || nothing}"
          @input=${this.#handleInput}
          @change=${this.#handleChange} />
        <div class="indicator-container">${this.renderIndicator()}</div>
      </div>
    `;
  }

  #handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    // <input> 'input' event bubbles and is composed, don't re-dispatch it.
  }

  #handleChange(event: Event) {
    // <input> 'change' event is not composed, re-dispatch it.
    redispatchEvent(this, event);
  }

  #handleRippleClick(e: Event) {
    e.preventDefault();
    this.input.click();
  }

  protected _handleClick(e: Event) {
    if (isActivationClick(e)) {
      this.input.click();
    }
  }
}
