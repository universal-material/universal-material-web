import { css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('u-ripple')
export class Ripple extends LitElement {

  static override styles = css`

    :host,
    :host::before {
      display: block;
      inset: 0;
      overflow: hidden;
      isolation: isolate;
    }
    
    :host::before {
      content: '';
      background: var(--u-state-layer-color, currentColor);
      opacity: 0;
      transition: opacity 200ms;
    }
    
    @media (hover: hover) {
      :host(:not([disabled]):hover)::before {
        content: '';
        background: var(--u-state-layer-color, currentColor);
        opacity: .08;
      }
    }

    :host,
    :host::before,
    .ripple {
      position: absolute;
      border-radius: inherit;
    }

    .ripple {
      top: 50%;
      left: 50%;
      background: var(--u-state-layer-color, currentColor);
      border-radius: 50%;
      box-shadow: 0 0 4rem 4rem var(--u-state-layer-color, currentColor);
      opacity: .2;
      transform: scale3d(0, 0, 1);
      will-change: transform;
    }

    .ripple.show {
      transition: transform var(--u-ripple-wave-duration, 3s) cubic-bezier(.19, 1, .22, 1), opacity 750ms;
      transform: scale3d(1, 1, 1);
    }

    .ripple.show-forced {
      transition: transform var(--u-ripple-wave-duration, 3s) cubic-bezier(.19, 1, .22, 1), opacity 200ms 300ms;
      transform: scale3d(2, 2, 1);
      opacity: 0;
    }

    .ripple.dismiss {
      opacity: 0;
      transform: scale3d(2, 2, 1);
    }
  `;

  @property({type: Boolean, reflect: true}) disabled = false;
  private isTouching = false;
  override ariaHidden = "true";

  constructor() {
    super();
    
    this.attachEvents();
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

    const parent = this.parentElement!;

    if (window.getComputedStyle(parent).position !== "relative" && window.getComputedStyle(parent).position !== "absolute" && window.getComputedStyle(parent).position !== "fixed") {
      console.warn('Ripple: Parent element position must be "relative", "absolute" or "fixed"');
      return false;
    }

    return true;
  }

  createRipple(releaseEventName: string | null = null, targetX: number | null = null, targetY: number | null = null): () => void {
    const preClientRect = this.getBoundingClientRect();
    targetX ??= preClientRect.x + this.clientWidth / 2;
    targetY ??= preClientRect.y + this.clientHeight / 2;

    const ripple = document.createElement('DIV');
    ripple.classList.add('ripple');
    this.shadowRoot!.appendChild(ripple);

    const release = () => {
      ripple.classList.add('dismiss');
      this.isTouching = false;
    };

    ripple.addEventListener('transitionend', () => {
      if (!ripple.classList.contains('dismiss') && !ripple.classList.contains('show-forced')) {
        return;
      }

      ripple.remove();
      this.removeEventListener('dragover', release);
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

      const x = (targetX! - clientRect.left) + ((rippleSize - this.clientWidth) / 2);
      const y = (targetY! - clientRect.top) + ((rippleSize - this.clientHeight) / 2);

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
