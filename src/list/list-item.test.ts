import { expect, fixture, html } from '@open-wc/testing';

import { ListItem } from './list-item.js';

suite('u-list-item', () => {
  teardown(() => {
    document.querySelectorAll('u-list-item').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-list-item', () => {
      expect(customElements.get('u-list-item')).to.equal(ListItem);
    });
  });

  suite('default rendering', () => {
    test('renders the container, content and headline parts', async () => {
      const el = await fixture<ListItem>(html`<u-list-item>Title</u-list-item>`);
      expect(el.shadowRoot!.querySelector('[part="container"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="content"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="headline"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="supporting-text"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="leading"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="trailing"]')).to.exist;
    });

    test('renders the headline default slot', async () => {
      const el = await fixture<ListItem>(html`<u-list-item>Title</u-list-item>`);
      const headlineSlot = el.shadowRoot!.querySelector('[part="headline"] slot:not([name])') as HTMLSlotElement;
      expect(headlineSlot).to.exist;
      const text = headlineSlot.assignedNodes({ flatten: true })
        .map((n) => n.textContent ?? '').join('').trim();
      expect(text).to.equal('Title');
    });

    test('renders the leading-icon, trailing-icon and supporting-text slots', async () => {
      const el = await fixture<ListItem>(html`<u-list-item></u-list-item>`);
      expect(el.shadowRoot!.querySelector('slot[name="leading-icon"]')).to.exist;
      expect(el.shadowRoot!.querySelector('slot[name="trailing-icon"]')).to.exist;
      expect(el.shadowRoot!.querySelector('slot[name="supporting-text"]')).to.exist;
    });
  });

  suite('selectable property', () => {
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

    test('does not render a u-ripple when selectable is false', async () => {
      const el = await fixture<ListItem>(html`<u-list-item>x</u-list-item>`);
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('u-ripple')).to.be.null;
    });

    test('renders a u-ripple inside the container when selectable is true', async () => {
      const el = await fixture<ListItem>(html`<u-list-item selectable>x</u-list-item>`);
      await el.updateComplete;
      const ripple = el.shadowRoot!.querySelector('[part="container"] u-ripple');
      expect(ripple).to.exist;
    });

    test('adds the "selectable" class to the container when selectable=true', async () => {
      const el = await fixture<ListItem>(html`<u-list-item selectable>x</u-list-item>`);
      await el.updateComplete;
      const container = el.shadowRoot!.querySelector<HTMLElement>('[part="container"]')!;
      expect(container.classList.contains('selectable')).to.be.true;
    });

    test('toggling selectable at runtime updates the container and ripple', async () => {
      const el = await fixture<ListItem>(html`<u-list-item>x</u-list-item>`);
      el.selectable = true;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('u-ripple')).to.exist;

      el.selectable = false;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('u-ripple')).to.be.null;
    });
  });

  suite('no-inset property', () => {
    test('defaults to false', async () => {
      const el = await fixture<ListItem>(html`<u-list-item>x</u-list-item>`);
      expect(el.noInset).to.be.false;
      expect(el.hasAttribute('no-inset')).to.be.false;
    });

    test('reflects to the no-inset attribute', async () => {
      const el = await fixture<ListItem>(html`<u-list-item>x</u-list-item>`);
      el.noInset = true;
      await el.updateComplete;
      expect(el.hasAttribute('no-inset')).to.be.true;
    });

    test('applies a negative inline margin equal to the inline padding', async () => {
      const el = await fixture<ListItem>(html`<u-list-item no-inset>x</u-list-item>`);
      await el.updateComplete;
      const container = el.shadowRoot!.querySelector<HTMLElement>('[part="container"]')!;
      const style = getComputedStyle(container);
      // default inline padding is 16px -> the margin cancels it on both sides
      expect(style.marginLeft).to.equal('-16px');
      expect(style.marginRight).to.equal('-16px');
    });

    test('has no negative margin without the attribute', async () => {
      const el = await fixture<ListItem>(html`<u-list-item>x</u-list-item>`);
      await el.updateComplete;
      const container = el.shadowRoot!.querySelector<HTMLElement>('[part="container"]')!;
      expect(getComputedStyle(container).marginLeft).to.equal('0px');
    });
  });
});
