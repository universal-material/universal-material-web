import { expect, fixture, html, oneEvent } from '@open-wc/testing';

import { Typeahead } from './typeahead.js';

const flush = async (ms = 350) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

suite('u-typeahead', () => {
  teardown(() => {
    document.querySelectorAll('u-typeahead, input.typeahead-target').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-typeahead', () => {
      expect(customElements.get('u-typeahead')).to.equal(Typeahead);
    });

    test('is form-associated', () => {
      expect((Typeahead as unknown as { formAssociated: boolean }).formAssociated).to.be.true;
    });
  });

  suite('default property values', () => {
    test('debounce defaults to 300', async () => {
      const el = await fixture<Typeahead>(html`<u-typeahead></u-typeahead>`);
      expect(el.debounce).to.equal(300);
    });

    test('limit defaults to 10', async () => {
      const el = await fixture<Typeahead>(html`<u-typeahead></u-typeahead>`);
      expect(el.limit).to.equal(10);
    });

    test('minLength defaults to 2', async () => {
      const el = await fixture<Typeahead>(html`<u-typeahead></u-typeahead>`);
      expect(el.minLength).to.equal(2);
    });

    test('openOnFocus, editable, fitTarget default to false', async () => {
      const el = await fixture<Typeahead>(html`<u-typeahead></u-typeahead>`);
      expect(el.openOnFocus).to.be.false;
      expect(el.editable).to.be.false;
      expect(el.fitTarget).to.be.false;
    });

    test('autocomplete defaults to "off"', async () => {
      const el = await fixture<Typeahead>(html`<u-typeahead></u-typeahead>`);
      expect(el.autocomplete).to.equal('off');
    });
  });

  suite('value getter/setter', () => {
    test('stores arbitrary values', async () => {
      const el = await fixture<Typeahead>(html`<u-typeahead></u-typeahead>`);
      el.value = { id: 1, label: 'one' };
      expect(el.value).to.deep.equal({ id: 1, label: 'one' });
    });

    test('returns undefined initially', async () => {
      const el = await fixture<Typeahead>(html`<u-typeahead></u-typeahead>`);
      expect(el.value).to.equal(undefined);
    });
  });

  suite('source as an array (filtered locally)', () => {
    test('filters suggestions by the term entered in the target', async () => {
      const wrap = await fixture<HTMLElement>(html`
        <div>
          <input id="t1" type="text" class="typeahead-target" />
          <u-typeahead target-id="t1" debounce="10" .source=${['apple', 'apricot', 'banana']}></u-typeahead>
        </div>
      `);
      const ta = wrap.querySelector('u-typeahead') as Typeahead;
      const target = wrap.querySelector<HTMLInputElement>('#t1')!;

      target.value = 'ap';
      target.dispatchEvent(new Event('input', { bubbles: true }));

      await flush(50);
      await ta.updateComplete;

      const items = ta.shadowRoot!.querySelectorAll('u-menu-item');
      expect(items.length).to.equal(2);
    });
  });

  suite('source as a Promise function', () => {
    test('uses raw results without local filtering', async () => {
      const source = async (_term: string) => [{ id: 1 }, { id: 2 }, { id: 3 }];
      const wrap = await fixture<HTMLElement>(html`
        <div>
          <input id="t2" type="text" class="typeahead-target" />
          <u-typeahead
            target-id="t2"
            debounce="10"
            .source=${source}
            .formatter=${(v: any) => `Item ${v.id}`}
          ></u-typeahead>
        </div>
      `);
      const ta = wrap.querySelector('u-typeahead') as Typeahead;
      const target = wrap.querySelector<HTMLInputElement>('#t2')!;

      target.value = 'xy';
      target.dispatchEvent(new Event('input', { bubbles: true }));

      await flush(50);
      await ta.updateComplete;

      const items = ta.shadowRoot!.querySelectorAll('u-menu-item');
      expect(items.length).to.equal(3);
    });
  });

  suite('minLength enforcement', () => {
    test('does not show suggestions before minLength characters', async () => {
      const wrap = await fixture<HTMLElement>(html`
        <div>
          <input id="t3" type="text" class="typeahead-target" />
          <u-typeahead target-id="t3" debounce="10" .minLength=${3} .source=${['apple', 'banana']}></u-typeahead>
        </div>
      `);
      const ta = wrap.querySelector('u-typeahead') as Typeahead;
      const target = wrap.querySelector<HTMLInputElement>('#t3')!;

      target.value = 'ap'; // 2 chars, below minLength=3
      target.dispatchEvent(new Event('input', { bubbles: true }));

      await flush(50);
      await ta.updateComplete;

      expect(ta.shadowRoot!.querySelectorAll('u-menu-item').length).to.equal(0);
    });
  });

  suite('limit enforcement', () => {
    test('caps the number of suggestions at limit', async () => {
      const wrap = await fixture<HTMLElement>(html`
        <div>
          <input id="t4" type="text" class="typeahead-target" />
          <u-typeahead
            target-id="t4"
            debounce="10"
            limit="2"
            .source=${['ab1', 'ab2', 'ab3', 'ab4']}
          ></u-typeahead>
        </div>
      `);
      const ta = wrap.querySelector('u-typeahead') as Typeahead;
      const target = wrap.querySelector<HTMLInputElement>('#t4')!;

      target.value = 'ab';
      target.dispatchEvent(new Event('input', { bubbles: true }));

      await flush(50);
      await ta.updateComplete;

      expect(ta.shadowRoot!.querySelectorAll('u-menu-item').length).to.equal(2);
    });
  });

  suite('selected event', () => {
    test('clicking an item dispatches a cancelable "selected" event with the value detail', async () => {
      const wrap = await fixture<HTMLElement>(html`
        <div>
          <input id="t5" type="text" class="typeahead-target" />
          <u-typeahead target-id="t5" debounce="10" .source=${['apple', 'apricot']}></u-typeahead>
        </div>
      `);
      const ta = wrap.querySelector('u-typeahead') as Typeahead;
      const target = wrap.querySelector<HTMLInputElement>('#t5')!;

      target.value = 'ap';
      target.dispatchEvent(new Event('input', { bubbles: true }));

      await flush(50);
      await ta.updateComplete;

      const item = ta.shadowRoot!.querySelector<HTMLElement>('u-menu-item')!;

      setTimeout(() => item.click());
      const event = await oneEvent(ta, 'selected');

      expect(event).to.exist;
      expect(event.cancelable).to.be.true;
      expect((event as CustomEvent).detail).to.equal('apple');
    });
  });

  suite('clear()', () => {
    test('clears the target value', async () => {
      const wrap = await fixture<HTMLElement>(html`
        <div>
          <input id="t6" type="text" class="typeahead-target" value="hi" />
          <u-typeahead target-id="t6" .source=${['apple']}></u-typeahead>
        </div>
      `);
      const ta = wrap.querySelector('u-typeahead') as Typeahead;
      const target = wrap.querySelector<HTMLInputElement>('#t6')!;
      expect(target.value).to.equal('hi');
      ta.clear();
      expect(target.value).to.equal('');
    });
  });

  suite('re-attach after a DOM move', () => {
    test('still reacts to input after the typeahead is moved in the DOM', async () => {
      const wrap = await fixture<HTMLElement>(html`
        <div>
          <input id="tm" type="text" class="typeahead-target" />
          <u-typeahead target-id="tm" debounce="10" .source=${['apple', 'apricot', 'banana']}></u-typeahead>
        </div>
      `);
      const ta = wrap.querySelector('u-typeahead') as Typeahead;
      const target = wrap.querySelector<HTMLInputElement>('#tm')!;

      // Move the typeahead to a new parent: disconnect + reconnect.
      const newParent = document.createElement('div');
      document.body.appendChild(newParent);
      newParent.appendChild(ta);
      await flush(20);

      // Typing in the (unchanged) target must still drive the typeahead.
      target.value = 'ap';
      target.dispatchEvent(new Event('input', { bubbles: true }));

      await flush(50);
      await ta.updateComplete;

      expect(ta.shadowRoot!.querySelectorAll('u-menu-item').length).to.equal(2);
      newParent.remove();
    });
  });
});
