import { expect, fixture, html } from '@open-wc/testing';
import { html as litHtml } from 'lit';

import { TypeaheadTemplateRender } from './typeahead-template-render.js';

suite('u-typeahead-template-render', () => {
  teardown(() => {
    document.querySelectorAll('u-typeahead-template-render').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-typeahead-template-render', () => {
      expect(customElements.get('u-typeahead-template-render')).to.equal(TypeaheadTemplateRender);
    });
  });

  suite('content property', () => {
    test('defaults to null', async () => {
      const el = await fixture<TypeaheadTemplateRender>(html`<u-typeahead-template-render></u-typeahead-template-render>`);
      expect(el.content).to.equal(null);
    });

    test('renders a string as text', async () => {
      const el = await fixture<TypeaheadTemplateRender>(html`<u-typeahead-template-render></u-typeahead-template-render>`);
      el.content = 'Hello';
      await el.updateComplete;
      expect(el.shadowRoot!.textContent).to.contain('Hello');
    });

    test('renders an HTMLElement as a child of the shadow root', async () => {
      const el = await fixture<TypeaheadTemplateRender>(html`<u-typeahead-template-render></u-typeahead-template-render>`);
      const span = document.createElement('span');
      span.id = 'injected';
      span.textContent = 'World';
      el.content = span;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('#injected')).to.exist;
      expect(el.shadowRoot!.querySelector('#injected')!.textContent).to.equal('World');
    });

    test('renders a Lit template result inside a container element', async () => {
      const el = await fixture<TypeaheadTemplateRender>(html`<u-typeahead-template-render></u-typeahead-template-render>`);
      el.content = litHtml`<b id="bold">bold</b>` as unknown as HTMLElement;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('#bold')).to.exist;
    });

    test('replaces the previous content when reassigned', async () => {
      const el = await fixture<TypeaheadTemplateRender>(html`<u-typeahead-template-render></u-typeahead-template-render>`);
      el.content = 'first';
      await el.updateComplete;
      expect(el.shadowRoot!.textContent).to.contain('first');

      el.content = 'second';
      await el.updateComplete;
      expect(el.shadowRoot!.textContent).to.contain('second');
      expect(el.shadowRoot!.textContent).to.not.contain('first');
    });
  });
});
