import { PropertyValues } from '@lit/reactive-element';
import { html, HTMLTemplateResult, LitElement, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';

import '../../ripple/ripple.js';

export abstract class UmSelectionControl extends LitElement {
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
    this.input!.focus(options);
  }

  #checked = false;
  protected inputType: 'checkbox' | 'radio' = 'checkbox';
  protected renderRipple = true;

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

  @property({ type: Boolean, attribute: 'checked' }) private _checkedAttribute = false;

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

    this.addEventListener('click', this.#handleClick);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this.#handleClick);
  }

  protected override render(): HTMLTemplateResult {
    const ripple = html`
      <u-ripple ?disabled=${this.disabled}></u-ripple>
    `;

    return html`
      <div class="container">
        ${this.renderRipple ? ripple : nothing}
        <input
          id="input"
          type=${this.inputType}
          class="focus-ring"
          .checked=${this._checkedAttribute}
          .disabled=${this.disabled} />
        <div class="indicator-container">${this.renderIndicator()}</div>
      </div>
    `;
  }

  #handleClick(e: Event) {
    if (e.defaultPrevented) {
      return;
    }

    console.log(e);
    this.checked = this.inputType === 'radio' || !this.checked;
    this.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }
}
