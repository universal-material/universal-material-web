import { html, HTMLTemplateResult, LitElement, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';

import '../elevation/elevation.js';
import '../ripple/ripple.js';
import { UmRipple } from '../ripple/ripple.js';

export abstract class UmButtonWrapper extends LitElement {

  /**
   * Whether the button is disabled or not.
   */
  @property({type: Boolean, reflect: true}) disabled = false;

  /**
   * The URL that the link button points to.
   */
  @property() href: string | undefined;

  /**
   * Where to display the linked `href` URL for a link button. Common options
   * include `_blank` to open in a new tab.
   */
  @property() target: string | undefined;

  @property() name: string | undefined;

  @query('.button') private readonly buttonElement!: HTMLElement;
  @query('u-ripple') private readonly ripple!: UmRipple;

  protected innerRole: string | null = null;

  get pathname(): string {
    return (<HTMLAnchorElement>this.buttonElement)?.pathname
  }

  protected override render(): HTMLTemplateResult {
    return typeof this.href === 'string'
      ? this.renderLink()
      : this.renderButton();
  }

  private renderButton() {
    return html`
      <button
        id="button"
        class="button"
        ?disabled=${this.disabled}
        aria-label=${this.ariaLabel || nothing}
        aria-labelledby="${this.ariaLabel ? nothing : 'text'}"
        .role=${this.innerRole}
        type="button">
        <u-ripple ?disabled=${this.disabled}></u-ripple>
        <u-elevation></u-elevation>
      </button>
      <div class="content">${this.renderContent()}</div>`;

  }

  private renderLink() {
    return html`<a
      id="link"
      class="button"
      href=${this.disabled ? nothing : this.href}
      aria-disabled=${this.disabled || nothing}
      aria-label=${this.ariaLabel || nothing}
      aria-labelledby="${this.ariaLabel ? nothing : 'text'}"
      .role=${this.innerRole}
      target=${this.target || nothing}>
      <u-elevation></u-elevation>
      <u-ripple ?disabled=${this.disabled}></u-ripple>
    </a>
    <div class="content">${this.renderContent()}</div>`;
  }

  protected abstract renderContent(): HTMLTemplateResult;

  override connectedCallback() {
    super.connectedCallback();

    this.addEventListener('click', this.innerClickHandler);
    this.addEventListener('focus', this.innerFocusHandler)
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener('click', this.innerClickHandler);
    this.removeEventListener('focus', this.innerFocusHandler);
  }

  override focus() {
    this.buttonElement?.focus();
  }

  override blur() {

    this.buttonElement?.blur();
  }

  protected getAriaLabel(): string | null | typeof nothing {
    console.log(this.ariaLabel);
    return this.ariaLabel || nothing;
  }

  private innerFocusHandler(): void {
    const tabIndexAttributeValue = this.getAttribute('tabindex');

    if (tabIndexAttributeValue !== "0") {
      return;
    }
 
    this.removeAttribute('tabindex');
    setTimeout(() => this.buttonElement?.focus());
  }

  private innerClickHandler(event: MouseEvent): void {

    if (this.disabled) {
      return;
    }

    if (!(<PointerEvent>event).pointerType) {
      this.ripple.createRipple();
    }

    this.handleClick(event);
  }

  protected handleClick(_: UIEvent): void {

  }
}
