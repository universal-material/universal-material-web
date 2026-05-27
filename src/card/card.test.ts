import { expect, fixture, html } from '@open-wc/testing';

import { CardContent } from './card-content.js';
import { CardMedia } from './card-media.js';
import { Card } from './card.js';

suite('u-card', () => {
  teardown(() => {
    document.querySelectorAll('u-card').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('u-card is registered', () => {
      expect(customElements.get('u-card')).to.equal(Card);
    });

    test('u-card-content is registered', () => {
      expect(customElements.get('u-card-content')).to.equal(CardContent);
    });

    test('u-card-media is registered', () => {
      expect(customElements.get('u-card-media')).to.equal(CardMedia);
    });
  });

  suite('variant property', () => {
    test('defaults to "filled"', async () => {
      const el = await fixture<Card>(html`<u-card></u-card>`);
      expect(el.variant).to.equal('filled');
      expect(el.getAttribute('variant')).to.equal('filled');
    });

    (['filled', 'elevated', 'outlined'] as const).forEach((variant) => {
      test(`reflects "${variant}" to the variant attribute`, async () => {
        const el = await fixture<Card>(html`<u-card variant=${variant}></u-card>`);
        expect(el.variant).to.equal(variant);
        expect(el.getAttribute('variant')).to.equal(variant);
      });
    });
  });

  suite('rendering', () => {
    test('contains a u-card-content with part="content"', async () => {
      const el = await fixture<Card>(html`<u-card></u-card>`);
      expect(el.shadowRoot!.querySelector('u-card-content[part="content"]')).to.exist;
    });

    test('renders the before-content slot', async () => {
      const el = await fixture<Card>(html`<u-card></u-card>`);
      expect(el.shadowRoot!.querySelector('slot[name="before-content"]')).to.exist;
    });

    test('renders the after-content slot', async () => {
      const el = await fixture<Card>(html`<u-card></u-card>`);
      expect(el.shadowRoot!.querySelector('slot[name="after-content"]')).to.exist;
    });
  });
});

suite('u-card-content', () => {
  teardown(() => {
    document.querySelectorAll('u-card-content').forEach((el) => el.remove());
  });

  suite('hasContent', () => {
    test('starts as false when the slot is empty', async () => {
      const el = await fixture<CardContent>(html`<u-card-content></u-card-content>`);
      await el.updateComplete;
      expect(el.hasContent).to.be.false;
      expect(el.hasAttribute('has-content')).to.be.false;
    });

    test('becomes true when an element is slotted', async () => {
      const el = await fixture<CardContent>(html`
        <u-card-content><div>body</div></u-card-content>
      `);
      await el.updateComplete;
      expect(el.hasContent).to.be.true;
      expect(el.hasAttribute('has-content')).to.be.true;
    });

    test('becomes true when only text is slotted', async () => {
      const el = await fixture<CardContent>(html`<u-card-content>text</u-card-content>`);
      await el.updateComplete;
      expect(el.hasContent).to.be.true;
    });

    test('stays false when only whitespace is slotted', async () => {
      const el = await fixture<CardContent>(html`<u-card-content>   </u-card-content>`);
      await el.updateComplete;
      expect(el.hasContent).to.be.false;
    });
  });
});

suite('u-card-media', () => {
  teardown(() => {
    document.querySelectorAll('u-card-media').forEach((el) => el.remove());
  });

  suite('wide property', () => {
    test('defaults to false', async () => {
      const el = await fixture<CardMedia>(html`<u-card-media></u-card-media>`);
      expect(el.wide).to.be.false;
      expect(el.hasAttribute('wide')).to.be.false;
    });

    test('reflects to the wide attribute', async () => {
      const el = await fixture<CardMedia>(html`<u-card-media></u-card-media>`);
      el.wide = true;
      await el.updateComplete;
      expect(el.hasAttribute('wide')).to.be.true;
    });
  });
});
