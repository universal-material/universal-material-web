import { expect, fixture, html, oneEvent } from '@open-wc/testing';

import '../menu/menu.js';
import '../menu/menu-item.js';
import { Option } from './option.js';
import { Select } from './select.js';

suite('u-select / u-option', () => {
  teardown(() => {
    document.querySelectorAll('u-select').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('u-select is registered', () => {
      expect(customElements.get('u-select')).to.equal(Select);
    });

    test('u-option is registered', () => {
      expect(customElements.get('u-option')).to.equal(Option);
    });

    test('is form-associated (via TextFieldBase)', () => {
      expect((Select as unknown as { formAssociated: boolean }).formAssociated).to.be.true;
    });
  });

  suite('initial selection', () => {
    test('selects the first enabled option when none has [selected]', async () => {
      const el = await fixture<Select>(html`
        <u-select>
          <u-option value="a">A</u-option>
          <u-option value="b">B</u-option>
        </u-select>
      `);
      await el.updateComplete;
      expect(el.value).to.equal('a');
      expect(el.selectedIndex).to.equal(0);
    });

    test('selects the [selected] option when set in markup', async () => {
      const el = await fixture<Select>(html`
        <u-select>
          <u-option value="a">A</u-option>
          <u-option value="b" selected>B</u-option>
        </u-select>
      `);
      await el.updateComplete;
      expect(el.value).to.equal('b');
      expect(el.selectedIndex).to.equal(1);
    });
  });

  suite('value setter', () => {
    test('selects the option matching the given value', async () => {
      const el = await fixture<Select>(html`
        <u-select>
          <u-option value="a">A</u-option>
          <u-option value="b">B</u-option>
          <u-option value="c">C</u-option>
        </u-select>
      `);
      await el.updateComplete;
      el.value = 'c';
      await el.updateComplete;
      expect(el.selectedIndex).to.equal(2);
      expect(el.selectedOptions[0].value).to.equal('c');
    });

    test('deselects when value does not match any option', async () => {
      const el = await fixture<Select>(html`
        <u-select>
          <u-option value="a">A</u-option>
          <u-option value="b">B</u-option>
        </u-select>
      `);
      await el.updateComplete;
      el.value = 'z';
      await el.updateComplete;
      expect(el.selectedIndex).to.equal(-1);
    });
  });

  suite('selectedIndex setter', () => {
    test('selects the option at the given index', async () => {
      const el = await fixture<Select>(html`
        <u-select>
          <u-option value="a">A</u-option>
          <u-option value="b">B</u-option>
        </u-select>
      `);
      await el.updateComplete;
      el.selectedIndex = 1;
      await el.updateComplete;
      expect(el.value).to.equal('b');
    });

    test('clamps to -1 when the index is out of range', async () => {
      const el = await fixture<Select>(html`
        <u-select>
          <u-option value="a">A</u-option>
        </u-select>
      `);
      await el.updateComplete;
      el.selectedIndex = 99;
      await el.updateComplete;
      expect(el.selectedIndex).to.equal(-1);
    });
  });

  suite('user selection via option click', () => {
    test('clicking an option fires a change event and updates value', async () => {
      const el = await fixture<Select>(html`
        <u-select>
          <u-option value="a">A</u-option>
          <u-option value="b">B</u-option>
        </u-select>
      `);
      await el.updateComplete;
      const optionB = el.querySelectorAll<Option>('u-option')[1];

      setTimeout(() => optionB.click());
      const event = await oneEvent(el, 'change');

      expect(event).to.exist;
      expect(el.value).to.equal('b');
    });

    test('does not fire change when clicking the already-selected option', async () => {
      const el = await fixture<Select>(html`
        <u-select>
          <u-option value="a" selected>A</u-option>
          <u-option value="b">B</u-option>
        </u-select>
      `);
      await el.updateComplete;
      const optionA = el.querySelector<Option>('u-option')!;
      let fired = false;
      el.addEventListener('change', () => (fired = true));
      optionA.click();
      expect(fired).to.be.false;
    });
  });

  suite('menuPositioning', () => {
    test('defaults to "relative"', async () => {
      const el = await fixture<Select>(html`<u-select></u-select>`);
      expect(el.menuPositioning).to.equal('relative');
    });

    test('reflects to the menu-positioning attribute', async () => {
      const el = await fixture<Select>(html`<u-select menu-positioning="fixed"></u-select>`);
      expect(el.menuPositioning).to.equal('fixed');
    });
  });

  suite('form association', () => {
    test('submits the current value with the form', async () => {
      const formEl = await fixture<HTMLFormElement>(html`
        <form>
          <u-select name="letter">
            <u-option value="a">A</u-option>
            <u-option value="b" selected>B</u-option>
          </u-select>
        </form>
      `);
      const select = formEl.querySelector('u-select') as Select;
      await select.updateComplete;
      const data = new FormData(formEl);
      expect(data.get('letter')).to.equal('b');
    });
  });
});
