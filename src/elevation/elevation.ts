import { css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('u-elevation')
export class Elevation extends LitElement {
  static override styles = css`
    :host {
      --_level: var(--u-elevation-level, 0);
      --_shadow-color: var(--u-shadow-color, #000);

      -webkit-tap-highlight-color: transparent;
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
    }

    :host::before,
    :host::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      transition: box-shadow 150ms ease-in-out;
    }
    
    :host::before {
      box-shadow: 0 calc(1px*(clamp(0,var(--_level),1) + clamp(0,var(--_level) - 3,1) + 2*clamp(0,var(--_level) - 4,1))) calc(1px*(2*clamp(0,var(--_level),1) + clamp(0,var(--_level) - 2,1) + clamp(0,var(--_level) - 4,1))) 0 var(--_shadow-color);
      opacity: .3;
    }
    
    :host::after {
      box-shadow: 0 calc(1px*(clamp(0,var(--_level),1) + clamp(0,var(--_level) - 1,1) + 2*clamp(0,var(--_level) - 2,3))) calc(1px*(3*clamp(0,var(--_level),2) + 2*clamp(0,var(--_level) - 2,3))) calc(1px*(clamp(0,var(--_level),4) + 2*clamp(0,var(--_level) - 4,1))) var(--_shadow-color);
      opacity: .15;
    }
  `;

  override ariaHidden = "true";
}

declare global {
  interface HTMLElementTagNameMap {
    'u-elevation': Elevation;
  }
}
