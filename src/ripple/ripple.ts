import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import { styles } from './ripple.styles';

@customElement('u-ripple')
export class Ripple extends LitElement {

  static override styles = styles;

  private isTouching = false;
  override ariaHidden = "true";

  @property({type: Boolean, reflect: true}) disabled = false;
  @query('.ripple-container') private readonly rippleContainer!: HTMLElement;

  constructor() {
    super();
    
    this.attachEvents();
  }

  override render(): HTMLTemplateResult {
    return html`<div class="ripple-container"></div><slot></slot>`
  }

  private attachEvents(): void {

    this.addEventListener('mousedown', this.handleMouseDown);
    this.addEventListener('touchstart', this.handleTouchStart);
  }

  private handleMouseDown(e: MouseEvent): void {

    if (this.isTouching || !this.canCreateRipple()) {
      return;
    }

    this.createRipple('mouseup', e.clientX, e.clientY);
  }

  private handleTouchStart(e: TouchEvent): void {

    if (!this.canCreateRipple()) {
      return;
    }

    this.isTouching = true;

    let release: (() => void) | null;
    let cancel = false;

    const touchMove = () => {

      cancel = true;

      this.removeEventListener("touchmove", touchMove);

      if (release) {
        release();
      }
    };

    this.addEventListener("touchmove", touchMove);

    setTimeout(() => {
      if (cancel) {
        return;
      }

      release = this.createRipple('touchend', e.touches[0].clientX, e.touches[0].clientY);
    }, 100);
  }

  private canCreateRipple(): boolean {
    if (this.disabled) return false;

    const parent = this.parentElement;

    if (!parent || window.getComputedStyle(parent).position !== "relative" && window.getComputedStyle(parent).position !== "absolute" && window.getComputedStyle(parent).position !== "fixed") {
      console.warn('Ripple: Parent element position must be "relative", "absolute" or "fixed"');
      return false;
    }

    return true;
  }

  createRipple(releaseEventName: string | null = null, targetX: number | null = null, targetY: number | null = null): () => void {
    const preClientRect = this.rippleContainer.getBoundingClientRect();
    targetX ??= preClientRect.x + this.rippleContainer.clientWidth / 2;
    targetY ??= preClientRect.y + this.rippleContainer.clientHeight / 2;

    const ripple = document.createElement('DIV');
    ripple.classList.add('ripple');
    this.rippleContainer!.appendChild(ripple);

    const release = () => {
      ripple.classList.add('dismiss');
      this.isTouching = false;
    };

    this.addEventListener("dragstart", release);
    this.addEventListener("mouseleave", release);
    ripple.addEventListener('transitionend', () => {
      if (!ripple.classList.contains('dismiss') && !ripple.classList.contains('show-forced')) {
        return;
      }

      ripple.remove();
      this.removeEventListener('dragstart', release);
      this.removeEventListener('mouseleave', release);

      if (releaseEventName) {
        window.removeEventListener(releaseEventName, release);
      }
    });

    requestAnimationFrame(() => {
      const clientRect = this.getBoundingClientRect();
      const largestDimensionSize = Math.max(this.clientWidth, this.clientHeight);
      const rippleSize = largestDimensionSize * 2;

      Ripple._setElementSquareSizeAndCenter(ripple, rippleSize);
      ripple.style.transitionDuration = (1080 * Math.pow(rippleSize, 0.3)) + 'ms, 750ms';

      const x = (targetX! - clientRect.left) + ((rippleSize - this.rippleContainer.clientWidth) / 2);
      const y = (targetY! - clientRect.top) + ((rippleSize - this.rippleContainer.clientHeight) / 2);

      ripple.style.transformOrigin = x + "px " + y + "px";
      ripple.classList.add(releaseEventName ? 'show' : 'show-forced');
    });

    if (releaseEventName) {
      window.addEventListener(releaseEventName, release);
    }

    return release;
  }

  private static _setElementSquareSizeAndCenter(element: HTMLElement, size: number) {
    element.style.top = "50%";
    element.style.left = "50%";
    element.style.width = size + 'px';
    element.style.height = size + 'px';
    element.style.marginLeft = -size / 2 + 'px';
    element.style.marginTop = -size / 2 + 'px';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-ripple': Ripple;
  }
}
