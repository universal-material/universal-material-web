import { expect, fixture, html } from '@open-wc/testing';

import { ListItem } from './list-item.js';
import { List } from './list.js';

suite('u-list / u-list-item', () => {
  teardown(() => {
    document.querySelectorAll('u-list, u-list-item').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('u-list is registered', () => {
      expect(customElements.get('u-list')).to.equal(List);
    });

    test('u-list-item is registered', () => {
      expect(customElements.get('u-list-item')).to.equal(ListItem);
    });
  });

  suite('u-list', () => {
    test('renders a default slot for items', async () => {
      const list = await fixture<List>(html`
        <u-list>
          <u-list-item>A</u-list-item>
          <u-list-item>B</u-list-item>
        </u-list>
      `);
      const slot = list.shadowRoot!.querySelector('slot')!;
      const assigned = slot.assignedElements();
      expect(assigned).to.have.lengthOf(2);
    });
  });

  suite('u-list-item: selectable property', () => {
    test('defaults to false', async () => {
      const el = await fixture<ListItem>(html`<u-list-item>x</u-list-item>`);
      expect(el.selectable).to.be.false;
      expect(el.hasAttribute('selectable')).to.be.false;
    });

    test('reflects to the selectable attribute', async () => {
      const el = await fixture<ListItem>(html`<u-list-item>x</u-list-item>`);
      el.selectable = true;
      await el.updateComplete;
      expect(el.hasAttribute('selectable')).to.be.true;
    });

    test('renders a ripple when selectable is true', async () => {
      const el = await fixture<ListItem>(html`<u-list-item selectable>x</u-list-item>`);
      expect(el.shadowRoot!.querySelector('u-ripple')).to.exist;
    });

    test('does not render a ripple when selectable is false', async () => {
      const el = await fixture<ListItem>(html`<u-list-item>x</u-list-item>`);
      expect(el.shadowRoot!.querySelector('u-ripple')).to.be.null;
    });
  });

  suite('u-list-item: parts', () => {
    test('exposes container, leading, content, headline, supporting-text, trailing parts', async () => {
      const el = await fixture<ListItem>(html`<u-list-item>x</u-list-item>`);
      expect(el.shadowRoot!.querySelector('[part="container"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="content"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="headline"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="supporting-text"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="leading"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="trailing"]')).to.exist;
    });
  });

  suite('u-list-item: slot routing', () => {
    test('headline slot fallback receives default slot content', async () => {
      const el = await fixture<ListItem>(html`<u-list-item>headline text</u-list-item>`);
      const headlineSlot = el.shadowRoot!.querySelector('[part="headline"] slot')!;
      const text = (headlineSlot as HTMLSlotElement).assignedNodes({ flatten: true })
        .map((n) => n.textContent ?? '').join('').trim();
      expect(text).to.equal('headline text');
    });

    test('supporting-text slot receives slot="supporting-text" content', async () => {
      const el = await fixture<ListItem>(html`
        <u-list-item>
          Headline
          <span slot="supporting-text">subtitle</span>
        </u-list-item>
      `);
      const slot = el.shadowRoot!.querySelector('[name="supporting-text"]')!;
      const assigned = (slot as HTMLSlotElement).assignedElements();
      expect(assigned).to.have.lengthOf(1);
      expect(assigned[0].textContent).to.equal('subtitle');
    });
  });
});
