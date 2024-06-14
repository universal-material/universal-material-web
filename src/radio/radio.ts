import { PropertyValues } from '@lit/reactive-element';
import { html, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './radio.styles.js';

import { UmSelectionControl } from '../shared/selection-control/selection-control.js';

@customElement('u-radio')
export class UmRadio extends UmSelectionControl {
  static override styles = [baseStyles, styles];

  @property({ type: Boolean, attribute: 'hide-state-layer', reflect: true }) hideStateLayer = false;

  protected override inputType: 'radio' | 'checkbox' = 'radio';

  protected override renderIndicator(): HTMLTemplateResult {
    return html`
      <div class="indicator"></div>
    `;
  }

  override get checked() {
    return super.checked;
  }
  override set checked(value: boolean) {
    super.checked = value;

    if (!value) {
      return;
    }

    this.uncheckSiblings();

    if (this.input) {
      this.input.tabIndex = 0;
    }
  }

  get #siblings(): UmRadio[] {
    if (!this.name) {
      return [this];
    }

    return Array.from((<Element>this.getRootNode()).querySelectorAll<UmRadio>(`${this.tagName}[name="${this.name}"]`));
  }

  constructor() {
    super();
  }

  override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);

    this.ensureOnlyOneChecked();
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keydown', this.#handleKeyDown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.#handleKeyDown);
  }

  #handleKeyDown(event: KeyboardEvent) {
    const isDown = event.key === 'ArrowDown';
    const isUp = event.key === 'ArrowUp';
    const isLeft = event.key === 'ArrowLeft';
    const isRight = event.key === 'ArrowRight';

    if (!isLeft && !isRight && !isDown && !isUp) {
      return;
    }

    // Don't try to select another sibling if there aren't any.
    const siblings = this.#siblings;

    if (!siblings.length) {
      return;
    }

    event.preventDefault();

    const isRtl = getComputedStyle(this).direction === 'rtl';
    const forwards = isRtl ? isLeft || isDown : isRight || isDown;
    const factor = forwards ? 1 : -1;

    const thisIndex = siblings.indexOf(this);
    let nextIndex = thisIndex + factor;

    while (nextIndex !== thisIndex) {
      if (nextIndex >= siblings.length) {
        // Return to start if moving past the last item.
        nextIndex = 0;
      } else if (nextIndex < 0) {
        // Go to end if moving before the first item.
        nextIndex = siblings.length - 1;
      }

      const nextSibling = siblings[nextIndex];

      if (nextSibling.disabled) {
        nextIndex += factor;
        continue;
      }

      const clickCanceled = !nextSibling.dispatchEvent(
        new Event('click', {
          bubbles: true,
          cancelable: true,
        }),
      );

      nextSibling.input.focus();

      if (clickCanceled) {
        break;
      }

      nextSibling.checked = true;
      nextSibling.dispatchEvent(new Event('change', { bubbles: true }));
      break;
    }
  }

  private ensureOnlyOneChecked() {
    if (!this.name) {
      return;
    }

    const radios = Array.from(document.querySelectorAll<UmRadio>(`${this.tagName}[name="${this.name}"]`));
    const lastChecked = radios.reverse().find(r => r.checked);

    if (!lastChecked) {
      return;
    }

    lastChecked.checked = true;
  }

  private uncheckSiblings() {
    for (const radio of this.#siblings) {
      if (radio === this) {
        continue;
      }

      if (radio.input) {
        radio.input.tabIndex = -1;
      }

      radio.checked = false;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-radio': UmRadio;
  }
}
