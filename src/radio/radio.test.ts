import { expect, fixture, html, oneEvent } from '@open-wc/testing';

import { Radio } from './radio.js';

const internalInput = (el: Radio) =>
  el.shadowRoot!.querySelector<HTMLInputElement>('input')!;

suite('u-radio', () => {
  teardown(() => {
    document.querySelectorAll('u-radio').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-radio', () => {
      expect(customElements.get('u-radio')).to.equal(Radio);
    });

    test('is form-associated', () => {
      expect((Radio as unknown as { formAssociated: boolean }).formAssociated).to.be.true;
    });
  });

  suite('rendering', () => {
    test('renders a radio <input> internally', async () => {
      const el = await fixture<Radio>(html`<u-radio></u-radio>`);
      expect(internalInput(el).type).to.equal('radio');
    });

    test('renders the indicator', async () => {
      const el = await fixture<Radio>(html`<u-radio></u-radio>`);
      expect(el.shadowRoot!.querySelector('.indicator')).to.exist;
    });

    test('renders the ripple', async () => {
      const el = await fixture<Radio>(html`<u-radio></u-radio>`);
      expect(el.shadowRoot!.querySelector('u-ripple')).to.exist;
    });
  });

  suite('checked property', () => {
    test('defaults to false', async () => {
      const el = await fixture<Radio>(html`<u-radio></u-radio>`);
      expect(el.checked).to.be.false;
    });

    test('respects the checked property binding on initialization', async () => {
      const el = await fixture<Radio>(html`<u-radio .checked=${true}></u-radio>`);
      expect(el.checked).to.be.true;
    });

    test('unchecks siblings with the same name when set to true', async () => {
      const root = await fixture<HTMLElement>(html`
        <div>
          <u-radio name="g" value="a" .checked=${true}></u-radio>
          <u-radio name="g" value="b"></u-radio>
        </div>
      `);
      const [first, second] = Array.from(root.querySelectorAll<Radio>('u-radio'));
      second.checked = true;
      expect(first.checked).to.be.false;
      expect(second.checked).to.be.true;
    });

    test('does not affect siblings with different names', async () => {
      const root = await fixture<HTMLElement>(html`
        <div>
          <u-radio name="a" .checked=${true}></u-radio>
          <u-radio name="b"></u-radio>
        </div>
      `);
      const [a, b] = Array.from(root.querySelectorAll<Radio>('u-radio'));
      b.checked = true;
      expect(a.checked).to.be.true;
      expect(b.checked).to.be.true;
    });
  });

  suite('keyboard navigation', () => {
    test('ArrowDown moves selection to the next sibling', async () => {
      const root = await fixture<HTMLElement>(html`
        <div>
          <u-radio name="g" value="a" .checked=${true}></u-radio>
          <u-radio name="g" value="b"></u-radio>
          <u-radio name="g" value="c"></u-radio>
        </div>
      `);
      const radios = Array.from(root.querySelectorAll<Radio>('u-radio'));
      radios[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      expect(radios[1].checked).to.be.true;
      expect(radios[0].checked).to.be.false;
    });

    test('ArrowUp wraps from first to last', async () => {
      const root = await fixture<HTMLElement>(html`
        <div>
          <u-radio name="g" value="a" .checked=${true}></u-radio>
          <u-radio name="g" value="b"></u-radio>
          <u-radio name="g" value="c"></u-radio>
        </div>
      `);
      const radios = Array.from(root.querySelectorAll<Radio>('u-radio'));
      radios[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      expect(radios[2].checked).to.be.true;
    });

    test('skips disabled siblings', async () => {
      const root = await fixture<HTMLElement>(html`
        <div>
          <u-radio name="g" value="a" .checked=${true}></u-radio>
          <u-radio name="g" value="b" disabled></u-radio>
          <u-radio name="g" value="c"></u-radio>
        </div>
      `);
      const radios = Array.from(root.querySelectorAll<Radio>('u-radio'));
      radios[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      expect(radios[2].checked).to.be.true;
      expect(radios[1].checked).to.be.false;
    });

    test('non-arrow keys are ignored', async () => {
      const root = await fixture<HTMLElement>(html`
        <div>
          <u-radio name="g" value="a" .checked=${true}></u-radio>
          <u-radio name="g" value="b"></u-radio>
        </div>
      `);
      const radios = Array.from(root.querySelectorAll<Radio>('u-radio'));
      radios[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      expect(radios[0].checked).to.be.true;
      expect(radios[1].checked).to.be.false;
    });

    test('keyboard navigation fires a change event on the newly checked radio', async () => {
      const root = await fixture<HTMLElement>(html`
        <div>
          <u-radio name="g" value="a" .checked=${true}></u-radio>
          <u-radio name="g" value="b"></u-radio>
        </div>
      `);
      const radios = Array.from(root.querySelectorAll<Radio>('u-radio'));
      const eventPromise = oneEvent(radios[1], 'change');
      radios[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      const event = await eventPromise;
      expect(event).to.exist;
    });
  });

  suite('disabled property', () => {
    test('reflects to the disabled attribute', async () => {
      const el = await fixture<Radio>(html`<u-radio></u-radio>`);
      el.disabled = true;
      await el.updateComplete;
      expect(el.hasAttribute('disabled')).to.be.true;
      expect(internalInput(el).disabled).to.be.true;
    });
  });

  suite('form association', () => {
    test('submits its value when checked', async () => {
      const formEl = await fixture<HTMLFormElement>(html`
        <form>
          <u-radio name="g" value="a"></u-radio>
          <u-radio name="g" value="b" .checked=${true}></u-radio>
        </form>
      `);
      const data = new FormData(formEl);
      expect(data.get('g')).to.equal('b');
    });
  });
});
