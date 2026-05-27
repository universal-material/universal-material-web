import { expect, fixture, html } from '@open-wc/testing';

import { CardContent } from './card-content.js';

suite('u-card-content', () => {
  teardown(() => {
    document.querySelectorAll('u-card-content').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-card-content', () => {
      expect(customElements.get('u-card-content')).to.equal(CardContent);
    });
  });

  suite('default rendering', () => {
    test('renders a default slot', async () => {
      const el = await fixture<CardContent>(html`<u-card-content></u-card-content>`);
      const slot = el.shadowRoot!.querySelector('slot');
      expect(slot).to.exist;
    });
  });

  suite('hasContent', () => {
    test('defaults to false when empty', async () => {
      const el = await fixture<CardContent>(html`<u-card-content></u-card-content>`);
      await el.updateComplete;
      expect(el.hasContent).to.be.false;
      expect(el.hasAttribute('has-content')).to.be.false;
    });

    test('becomes true (and reflects) when a child element is slotted', async () => {
      const el = await fixture<CardContent>(html`<u-card-content><p>Hello</p></u-card-content>`);
      await el.updateComplete;
      expect(el.hasContent).to.be.true;
      expect(el.hasAttribute('has-content')).to.be.true;
    });

    test('becomes true when only non-whitespace text is slotted', async () => {
      const el = await fixture<CardContent>(html`<u-card-content>Hello</u-card-content>`);
      await el.updateComplete;
      expect(el.hasContent).to.be.true;
      expect(el.hasAttribute('has-content')).to.be.true;
    });

    test('stays false when only whitespace text is slotted', async () => {
      const el = await fixture<CardContent>(html`<u-card-content>   </u-card-content>`);
      await el.updateComplete;
      expect(el.hasContent).to.be.false;
    });

    test('updates when content is added after mount', async () => {
      const el = await fixture<CardContent>(html`<u-card-content></u-card-content>`);
      await el.updateComplete;
      expect(el.hasContent).to.be.false;

      const p = document.createElement('p');
      p.textContent = 'Hi';
      el.appendChild(p);

      await el.updateComplete;
      expect(el.hasContent).to.be.true;
    });
  });
});
