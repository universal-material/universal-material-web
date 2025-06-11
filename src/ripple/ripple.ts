import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import { styles } from './ripple.styles.js';

@customElement('u-ripple')
export class UmRipple extends LitElement {

  static override styles = styles;

  private isTouching = false;

  /**
   * Disables the ripple.
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  @query('.ripple-container') private readonly rippleContainer!: HTMLElement;

  constructor() {
    super();
  }

  override render(): HTMLTemplateResult {
    return html`<div class="ripple-container"></div><slot></slot>`;
  }

  override connectedCallback() {
    super.connectedCallback();

    this.attachEvents();
    this.ariaHidden = 'true';
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    this.dettachEvents();
  }

  private attachEvents(): void {

    this.addEventListener('mousedown', this.handleMouseDown);
    this.addEventListener('touchstart', this.handleTouchStart);
  }

  private dettachEvents(): void {

    this.removeEventListener('mousedown', this.handleMouseDown);
    this.removeEventListener('touchstart', this.handleTouchStart);
  }

  private handleMouseDown(e: MouseEvent): void {

    if (this.isTouching || !this.canCreateRipple()) {
      return;
    }

    this.createRipple(e.clientX, e.clientY, 'mouseup');
  }

  private handleTouchStart(e: TouchEvent): void {

    if (!this.canCreateRipple()) {
      return;
    }

    this.isTouching = true;

    const dismiss = this.createRipple(e.touches[0].clientX, e.touches[0].clientY, 'touchend')!;

    this.addEventListener('touchmove', dismiss);
  }

  private canCreateRipple(): boolean {
    return !this.disabled;
  }

  createRipple(targetX: number | null = null, targetY: number | null = null, releaseEventName: string | null = null): (() => void) | null {
    const preClientRect = this.rippleContainer.getBoundingClientRect();
    targetX ??= preClientRect.x + this.rippleContainer.clientWidth / 2;
    targetY ??= preClientRect.y + this.rippleContainer.clientHeight / 2;

    const ripple = document.createElement('DIV');
    ripple.classList.add('ripple');
    this.rippleContainer.appendChild(ripple);

    requestAnimationFrame(() => {
      const clientRect = this.getBoundingClientRect();
      const largestDimensionSize = Math.max(this.clientWidth, this.clientHeight);
      const rippleSize = largestDimensionSize * 2;

      UmRipple._setElementSquareSizeAndCenter(ripple, rippleSize);
      ripple.style.setProperty('--_ripple-transition-duration', `${1080 * Math.pow(rippleSize, 0.3)}ms`);

      const x = (targetX - clientRect.left) + ((rippleSize - this.rippleContainer.clientWidth) / 2);
      const y = (targetY - clientRect.top) + ((rippleSize - this.rippleContainer.clientHeight) / 2);

      ripple.style.transformOrigin = `${x}px ${y}px`;
      ripple.classList.add(releaseEventName ? 'show' : 'show-forced');
    });

    const interval = setInterval(() => {

      if (!ripple.classList.contains('dismiss') && !ripple.classList.contains('show-forced')) {
        return;
      }

      const animations = ripple.getAnimations();

      if (animations.length) {
        return;
      }

      clearInterval(interval);
      ripple.remove();
    }, 1000);

    if (!releaseEventName) {
      return null;
    }

    return this.createDismissEvent(ripple, releaseEventName);
  }

  private createDismissEvent(ripple: HTMLElement, releaseEventName: string): () => void {
    const dismiss = () => {
      ripple.classList.add('dismiss');

      this.isTouching = false;

      this.removeEventListener('dragover', dismiss);
      this.removeEventListener('mouseleave', dismiss);
      window.removeEventListener(releaseEventName, dismiss);
    };

    this.addEventListener('dragover', dismiss);
    this.addEventListener('mouseleave', dismiss);
    window.addEventListener(releaseEventName, dismiss);

    return dismiss;
  }

  private static _setElementSquareSizeAndCenter(element: HTMLElement, size: number) {
    element.style.top = '50%';
    element.style.left = '50%';
    element.style.width = `${size}px`;
    element.style.height = `${size}px`;
    element.style.marginLeft = `${-size / 2}px`;
    element.style.marginTop = `${-size / 2}px`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-ripple': UmRipple;
  }
}
