import { CSSResultGroup } from '@lit/reactive-element/css-tag';
import { html, HTMLTemplateResult, LitElement, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';

import { styles as baseStyles } from './base.styles.js';

import { UmRipple } from '../ripple/ripple.js';
import { styles } from './button-wrapper.styles';
import { redispatchEvent } from './events/redispatch-event.js';

import '../elevation/elevation.js';
import '../ripple/ripple.js';

export abstract class UmButtonWrapper extends LitElement {

  static override styles: CSSResultGroup = [baseStyles, styles];

  /**
   * Whether the button is disabled or not.
   */
  @property({type: Boolean, reflect: true}) disabled = false;

  @state() renderRipple = true;

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

  @query('.button') readonly buttonElement!: HTMLElement;
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
        class="button focus-ring"
        ?disabled=${this.disabled}
        aria-label=${this.getAriaLabel() || nothing}
        aria-labelledby="${this.getAriaLabel() ? nothing : 'text'}"
        .role=${this.innerRole}
        type="button"
        @click=${this.#innerClickHandler}>
        <u-ripple ?disabled=${this.disabled || !this.renderRipple}></u-ripple>
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
      target=${this.target || nothing}
      @click=${this.#innerClickHandler}>
      <u-elevation></u-elevation>
      <u-ripple ?disabled=${this.disabled || !this.renderRipple}></u-ripple>
    </a>
    <div class="content">${this.renderContent()}</div>`;
  }

  protected abstract renderContent(): HTMLTemplateResult;

  override connectedCallback() {
    super.connectedCallback();

    this.addEventListener('focus', this.innerFocusHandler)
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener('focus', this.innerFocusHandler);
  }

  override focus() {
    this.buttonElement?.focus();
  }

  override blur() {

    this.buttonElement?.blur();
  }

  protected getAriaLabel(): string | null {
    return this.ariaLabel;
  }

  private innerFocusHandler(): void {
    const tabIndexAttributeValue = this.getAttribute('tabindex');

    if (tabIndexAttributeValue !== "0") {
      return;
    }
 
    this.removeAttribute('tabindex');
    setTimeout(() => this.buttonElement?.focus());
  }

  #innerClickHandler(event: MouseEvent): void {
    
    if (this.disabled) {
      return;
    }

    const preventDefault = !redispatchEvent(this, event);

    if (preventDefault) {
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
