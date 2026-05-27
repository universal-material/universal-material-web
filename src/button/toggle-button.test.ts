import { expect, fixture, html, oneEvent } from '@open-wc/testing';

import { Button } from './button.js';

// Reference the class at runtime so esbuild keeps the side-effect import
// (which registers the `u-button` custom element).
const ButtonRef = Button;

const containerOf = (el: Button) =>
  el.shadowRoot!.querySelector<HTMLElement>('[part="container"]')!;

// ToggleButton is abstract; we exercise it through `u-button` since it
// extends ToggleButton without altering the toggle behavior.
suite('ToggleButton (via u-button)', () => {
  teardown(() => {
    document.querySelectorAll('u-button').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('u-button is registered (and inherits from ToggleButton)', () => {
      expect(customElements.get('u-button')).to.equal(ButtonRef);
    });
  });

  suite('toggle property', () => {
    test('attribute "toggle" reflects when set via property', async () => {
      const el = await fixture<Button>(html`<u-button>x</u-button>`);
      el.toggle = true;
      await el.updateComplete;
      expect(el.hasAttribute('toggle')).to.be.true;
      expect(containerOf(el).classList.contains('toggle')).to.be.true;
    });

    test('attribute "toggle" set in markup is picked up', async () => {
      const el = await fixture<Button>(html`<u-button toggle>x</u-button>`);
      expect(el.toggle).to.be.true;
    });
  });

  suite('selected property', () => {
    test('reflects to the selected attribute when set', async () => {
      const el = await fixture<Button>(html`<u-button toggle>x</u-button>`);
      el.selected = true;
      await el.updateComplete;
      expect(el.hasAttribute('selected')).to.be.true;
      expect(containerOf(el).classList.contains('selected')).to.be.true;
    });
  });

  suite('shape property', () => {
    test('applies the shape class to the container when set via attribute', async () => {
      const el = await fixture<Button>(html`<u-button shape="square">x</u-button>`);
      expect(el.shape).to.equal('square');
      expect(containerOf(el).classList.contains('square')).to.be.true;
    });
  });

  suite('size property', () => {
    test('applies the size class to the container when set via attribute', async () => {
      const el = await fixture<Button>(html`<u-button size="large">x</u-button>`);
      expect(el.size).to.equal('large');
      expect(containerOf(el).classList.contains('large')).to.be.true;
    });
  });

  suite('toggleShape property', () => {
    test('reflects to the toggle-shape attribute when set via attribute', async () => {
      const el = await fixture<Button>(html`<u-button toggle-shape>x</u-button>`);
      expect(el.toggleShape).to.be.true;
      expect(containerOf(el).classList.contains('toggle-shape')).to.be.true;
    });
  });

  suite('change event semantics', () => {
    test('click on the inner button toggles selected when toggle=true', async () => {
      const el = await fixture<Button>(html`<u-button toggle>x</u-button>`);
      const inner = el.shadowRoot!.querySelector('button')!;

      setTimeout(() => inner.click());
      const event = await oneEvent(el, 'change');

      expect(event).to.exist;
      expect(event.bubbles).to.be.true;
      expect(el.selected).to.be.true;
    });

    test('a second click toggles back to unselected', async () => {
      const el = await fixture<Button>(html`<u-button toggle selected>x</u-button>`);
      const inner = el.shadowRoot!.querySelector('button')!;

      setTimeout(() => inner.click());
      await oneEvent(el, 'change');

      expect(el.selected).to.be.false;
    });

    test('does not toggle or fire change when toggle attribute is absent', async () => {
      const el = await fixture<Button>(html`<u-button>x</u-button>`);
      const inner = el.shadowRoot!.querySelector('button')!;

      let fired = false;
      el.addEventListener('change', () => (fired = true));
      inner.click();

      expect(el.selected).to.not.equal(true);
      expect(fired).to.be.false;
    });
  });
});
