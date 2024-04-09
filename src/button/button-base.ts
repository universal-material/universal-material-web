import { html, HTMLTemplateResult, LitElement, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';

import '../elevation/elevation';
import '../ripple/ripple';
import { Ripple } from '../ripple/ripple';

export abstract class ButtonBase extends LitElement {

  static readonly formAssociated = true;

  /**
   * Whether or not the button is disabled.
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

  @property() form: string | undefined;

  @query('.button') private readonly buttonElement!: HTMLElement;
  @query('u-ripple') private readonly ripple!: Ripple;

  protected override render() {
    return this.href
      ? this.renderLink()
      : this.renderButton();
  }

  private renderButton() {

    // Needed for closure conformance
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
    // Needed for closure conformance
    // const {ariaLabel, ariaHasPopup, ariaExpanded} = this as ARIAMixinStrict;
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

    const formElement = this.getFormElement();

    if (this.type === 'submit') {
      formElement?.submit()
      return;
    }

    formElement?.reset();
  }

  protected handleClick(_: UIEvent): void {

  }

  private getFormElement(): HTMLFormElement | null {
    if (!this.form) {
      return this.closest<HTMLFormElement>('FORM');
    }

    return <HTMLFormElement>document.getElementById(this.form);
  }
}
