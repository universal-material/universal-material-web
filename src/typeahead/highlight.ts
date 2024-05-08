import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { styles } from './highlight.styles.js';

import { normalizeText } from '../shared/normalize-text.js';

function regExpEscape(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

@customElement('u-highlight')
export class UmHighlight extends LitElement {
  static override styles = styles;

  #result: string | undefined;
  #term: string | undefined;
  @state() private parts: string[] | undefined;

  /**
   * The result text to display. If the term is found inside this text, it's highlighted
   */
  @property()
  get result(): string | undefined {
    return this.#result;
  }
  set result(value: string | undefined) {
    this.#result = value;

    this.setParts();
  }

  /**
   * The searched term
   */
  @property()
  get term(): string | undefined {
    return this.#term;
  }
  set term(value: string | undefined) {
    this.#term = value;

    this.setParts();
  }

  protected override render(): HTMLTemplateResult | HTMLTemplateResult[] {
    return this.parts
      ? this.parts.map((part, index) => {
        return index % 2
          ? html`<strong>${part}</strong>`
          : html`<span>${part}</span>`;
      })
      : html`<span></span>`;
  }

  private setParts() {
    const resultStr = this.result || '';
    const resultNormalized = normalizeText(resultStr).toLowerCase();
    const termLC = normalizeText(this.term || '').toLowerCase();
    let currentIdx = 0;

    if (termLC.length <= 0) {
      this.parts = [resultStr];
      return;
    }

    this.parts = resultNormalized
      .split(new RegExp(`(${regExpEscape(termLC)})`))
      .map(part => {
        const originalPart = resultStr.substring(currentIdx, currentIdx + part.length);
        currentIdx += part.length;
        return originalPart;
      });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-highlight': UmHighlight;
  }
}
