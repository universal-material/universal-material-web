import { html, LitElement, render } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('u-typeahead-template-render')
export class TypeaheadTemplateRender extends LitElement {
  @property() content: string | HTMLElement | null = null;

  override render() {
    if (this.content instanceof HTMLElement || typeof this.content === 'string') {
      return html`${this.content}`;
    }

    const container = document.createElement('div');
    render(this.content, container);
    return html`${container}`;
  }
}
