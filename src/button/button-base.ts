import { html, HTMLTemplateResult, LitElement, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';

import '../elevation/elevation.js';
import '../ripple/ripple.js';
import { Ripple } from '../ripple/ripple';

export abstract class ButtonBase extends LitElement {

  static readonly formAssociated = true;

  /**
   * Whether the button is disabled.
   */
  @property({type: Boolean, reflect: true}) disabled = false;

  /**
   * The URL that the link button points to.
   */
  @property() href = '';

  /**
   * Where to display the linked `href` URL for a link button. Common options
   * include `_blank` to open in a new tab.
   */
  @property() target: string = '';

  @property() type: string = 'submit';

  @property({reflect: true}) value: string = '';
  @property() name: string | undefined;

  @query('.button') private readonly buttonElement!: HTMLElement;
  @query('u-ripple') private readonly ripple!: Ripple;

  /**
   * The `<form>` element to associate the button with (its form owner). The value of this attribute must be the id of a `<form>` in the same document. (If this attribute is not set, the button is associated with its ancestor `<form>` element, if any.)
   * @link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#form
   */
  @property()
  get form(): HTMLFormElement | null {
    return this.#elementInternals.form;
  }

  readonly #elementInternals: ElementInternals;

  constructor() {
    super();
    this.#elementInternals = this.attachInternals();
  }

  protected override render() {
    return this.href
      ? this.renderLink()
      : this.renderButton();
  }

  private renderButton() {

    return html`
      <button
        id="button"
        class="button"
        ?disabled=${this.disabled}
        aria-label="${this.getAriaLabel()}"
        type="button">
        <u-ripple ?disabled=${this.disabled}></u-ripple>
        <u-elevation></u-elevation>
      </button>
      ${this.renderContent()}`;
  }

  private renderLink() {

    return html`<a
      id="link"
      class="button"
      href=${this.disabled ? nothing : this.href}
      aria-disabled=${this.disabled || nothing}
      aria-label="${this.getAriaLabel()}"
      target=${this.target || nothing}>
      <u-elevation></u-elevation>
      <u-ripple ?disabled=${this.disabled}></u-ripple>
    </a>
    ${this.renderContent()}`;
  }

  protected abstract renderContent(): HTMLTemplateResult;

  override connectedCallback() {
    super.connectedCallback();

    this.addEventListener('click', this.innerHandleClick);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener('click', this.innerHandleClick);
  }

  override focus() {
    this.buttonElement?.focus();
  }

  override blur() {
    this.buttonElement?.blur();
  }

  protected getAriaLabel(): string | null | typeof nothing {
    return this.ariaLabel || nothing;
  }

  private innerHandleClick(event: UIEvent): void {

    if (this.disabled) {
      return;
    }

    if (event.detail === 0) {
      this.ripple.createRipple();
    }

    this.handleClick(event);

    if (this.type === 'button' || !!this.href) {
      return;
    }

    if (!this.form) {
      return;
    }

    this.#elementInternals.setFormValue(this.value);

    if (this.type === 'submit') {
      this.form.requestSubmit();
      return;
    }

    this.form.reset();
  }

  protected handleClick(_: UIEvent): void {

  }
}
