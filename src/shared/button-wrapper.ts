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

  get pathname(): string {
    return (<HTMLAnchorElement>this.buttonElement)?.pathname
  }

  protected override render() {
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
        aria-label="${this.getAriaLabel()}"
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
      aria-label="${this.getAriaLabel()}"
      target=${this.target || nothing}>
      <u-elevation></u-elevation>
      <u-ripple ?disabled=${this.disabled}></u-ripple>
    </a>
    <div class="content">${this.renderContent()}</div>`;
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
  }

  protected handleClick(_: UIEvent): void {

  }
}
