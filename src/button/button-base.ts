import { css, CSSResult, html, HTMLTemplateResult, LitElement, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';

import '../elevation/elevation';
import '../ripple/ripple';
import { Ripple } from '../ripple/ripple';

export abstract class ButtonBase extends LitElement {

  static readonly formAssociated = true;

  static override styles: CSSResult | CSSResult[] = css`

    :host {
      --_primary-color: var(--u-primary-color, #6750a4);
      --_shadow-color-rgb: var(--u-shadow-color-rgb, 0, 0, 0);

      -webkit-tap-highlight-color: transparent;
      display: inline-block;
      vertical-align: baseline;
      font-family: var(--u-font-family-base, system-ui);
      transition: color 150ms ease-in-out, background-color 150ms ease-in-out;
    }

    :host([disabled]) {
      --u-elevation-level: 0 !important;
      background-color: var(--u-button-disabled-background-color, rgba(var(--u-on-surface-color-rgb, 29, 27, 32), .12)) !important;
      color: var(--u-button-disabled-text-color, rgba(var(--u-on-surface-color-rgb, 29, 27, 32), .38)) !important;
    }

    :host([disabled]) .button {
      cursor: default;
    }

    * {
      color: inherit;
    }

    u-elevation {
      z-index: -1;
    }

    .button {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      width: 100%;
      height: 100%;
      margin: 0;
      font-family: inherit;
      border-radius: inherit;
      color: inherit;
      border: none;
      text-align: center;
      white-space: nowrap;
      background: transparent;
      user-select: none;
      text-decoration: none;
      outline: 0;
      z-index: 0;
    }

    .button:focus-visible {
      animation: offset-pulse 400ms ease;
      animation-fill-mode: forwards;
      outline-offset: 2px;
    }

    ::slotted([slot=icon]) {
      display: inline-block;
    }

    @keyframes offset-pulse {
      0% {
        outline: 4px solid var(--u-primary-color, #6750a4)
      }
      50% {
        outline: 8px solid var(--u-primary-color, #6750a4)
      }
      100% {
        outline: 4px solid var(--u-primary-color, #6750a4)
      }
    }
  `;

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
  @property() target: '_blank' | '_parent' | '_self' | '_top' | '' = '';

  @property() type: 'submit' | 'button' | 'reset' = 'submit';
  // @property() variant: 'filled' | 'tonal' | 'outlined' | 'text' = 'filled';

  @property() form: string | null = null;

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
        <u-elevation></u-elevation>
        <u-ripple ?disabled=${this.disabled}></u-ripple>
        ${this.renderContent()}
      </button>`;
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
      ${this.renderContent()}
    </a>`;
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
