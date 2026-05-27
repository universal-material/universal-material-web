import { expect, fixture, html } from '@open-wc/testing';

import { Highlight } from './highlight.js';

const childTagsOf = (el: Highlight) =>
  Array.from(el.shadowRoot!.children).map((c) => c.tagName.toLowerCase());

const childTextsOf = (el: Highlight) =>
  Array.from(el.shadowRoot!.children).map((c) => c.textContent ?? '');

suite('u-highlight', () => {
  teardown(() => {
    document.querySelectorAll('u-highlight').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-highlight', () => {
      expect(customElements.get('u-highlight')).to.equal(Highlight);
    });
  });

  suite('default rendering', () => {
    test('renders an empty <span> when no result is set', async () => {
      const el = await fixture<Highlight>(html`<u-highlight></u-highlight>`);
      await el.updateComplete;
      const tags = childTagsOf(el);
      expect(tags).to.deep.equal(['span']);
      expect(el.shadowRoot!.children[0].textContent).to.equal('');
    });

    test('renders the result as a plain <span> when term is empty', async () => {
      const el = await fixture<Highlight>(html`<u-highlight .result=${'hello'}></u-highlight>`);
      await el.updateComplete;
      expect(childTagsOf(el)).to.deep.equal(['span']);
      expect(el.shadowRoot!.children[0].textContent).to.equal('hello');
    });
  });

  suite('term highlighting', () => {
    test('wraps the matching part of the result in a <strong>', async () => {
      const el = await fixture<Highlight>(html`
        <u-highlight .result=${'hello world'} .term=${'world'}></u-highlight>
      `);
      await el.updateComplete;
      const tags = childTagsOf(el);
      // result = ['hello ', 'world', ''] → span, strong, span
      expect(tags).to.deep.equal(['span', 'strong', 'span']);
      expect(childTextsOf(el)).to.deep.equal(['hello ', 'world', '']);
    });

    test('matching is case-insensitive', async () => {
      const el = await fixture<Highlight>(html`
        <u-highlight .result=${'Hello World'} .term=${'world'}></u-highlight>
      `);
      await el.updateComplete;
      // preserves original case in the matched substring
      expect(childTextsOf(el)).to.deep.equal(['Hello ', 'World', '']);
    });

    test('handles multiple occurrences of the term', async () => {
      const el = await fixture<Highlight>(html`
        <u-highlight .result=${'na na na'} .term=${'na'}></u-highlight>
      `);
      await el.updateComplete;
      const tags = childTagsOf(el);
      // result = ['', 'na', ' ', 'na', ' ', 'na', ''] → 7 elements alternating
      expect(tags.length).to.equal(7);
      expect(tags[1]).to.equal('strong');
      expect(tags[3]).to.equal('strong');
      expect(tags[5]).to.equal('strong');
    });

    test('escapes regex metacharacters in the term', async () => {
      const el = await fixture<Highlight>(html`
        <u-highlight .result=${'find (this)'} .term=${'(this)'}></u-highlight>
      `);
      await el.updateComplete;
      // result split by literal "(this)" → ['find ', '(this)', '']
      expect(childTextsOf(el)).to.deep.equal(['find ', '(this)', '']);
    });

    test('updating the term re-renders', async () => {
      const el = await fixture<Highlight>(html`
        <u-highlight .result=${'hello world'} .term=${'hello'}></u-highlight>
      `);
      await el.updateComplete;
      expect(childTextsOf(el)).to.deep.equal(['', 'hello', ' world']);

      el.term = 'world';
      await el.updateComplete;
      expect(childTextsOf(el)).to.deep.equal(['hello ', 'world', '']);
    });
  });

  suite('result without match', () => {
    test('keeps the whole result in a single span when term does not match', async () => {
      const el = await fixture<Highlight>(html`
        <u-highlight .result=${'hello'} .term=${'xyz'}></u-highlight>
      `);
      await el.updateComplete;
      expect(childTagsOf(el)).to.deep.equal(['span']);
      expect(childTextsOf(el)).to.deep.equal(['hello']);
    });
  });
});
