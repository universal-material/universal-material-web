import { html, HTMLTemplateResult, LitElement, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';

import '../../ripple/ripple';

export abstract class UmSelectionControl extends LitElement {
  static readonly formAssociated = true;

  protected readonly elementInternals: ElementInternals;

  @property() name: string | undefined = '';
  @property({type: Boolean, reflect: true}) disabled = false;
  @query('input') input!: HTMLInputElement;

  // eslint-disable-next-line
  // #value: any = '';

  get form(): HTMLFormElement | null {
    return this.elementInternals.form;
  }

  #checked = false;
  protected inputType: 'checkbox' | 'radio' = 'checkbox';
  protected renderRipple = true;

  protected abstract renderIndicator(): HTMLTemplateResult;

  /**
   * The element value to use in form submission when checked.
   */
  @property() value = 'on';

  @property({type: Boolean})
  get checked() {
    return this.#checked;
  }
  set checked(value: boolean) {
    console.log(value);
    this.#checked = value;
    this.elementInternals.setFormValue(value ? this.value : null);
  }

  protected constructor() {
    super();
    this.elementInternals = this.attachInternals();
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.#handleClick);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this.#handleClick)
  }

  protected override render(): HTMLTemplateResult {
    const ripple = html`<u-ripple ?disabled=${this.disabled}></u-ripple>`;

    return html`
      <div class="container">
        ${this.renderRipple ? ripple : nothing}
        <input
          type=${this.inputType}
          class="focus-ring"
          ?name=${this.name}
          .checked=${this.#checked}
          .disabled=${this.disabled} />
        <div class="indicator-container">${this.renderIndicator()}</div>
      </div>`;
  }

  #handleClick() {
    this.checked = this.inputType === 'radio' || !this.checked;
    this.dispatchEvent(new Event('change', {bubbles: true}));
  }
}
