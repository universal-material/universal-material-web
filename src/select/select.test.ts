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

  suite('value attribute', () => {
    test('selects the option matching the initial value attribute', async () => {
      const el = await fixture<Select>(html`
        <u-select value="b">
          <u-option value="a">A</u-option>
          <u-option value="b">B</u-option>
          <u-option value="c">C</u-option>
        </u-select>
      `);
      await el.updateComplete;
      expect(el.value).to.equal('b');
      expect(el.selectedIndex).to.equal(1);
    });

    test('the value attribute wins over <u-option selected>', async () => {
      const el = await fixture<Select>(html`
        <u-select value="a">
          <u-option value="a">A</u-option>
          <u-option value="b" selected>B</u-option>
        </u-select>
      `);
      await el.updateComplete;
      expect(el.value).to.equal('a');
    });

    test('reflects the current value back to the attribute', async () => {
      const el = await fixture<Select>(html`
        <u-select>
          <u-option value="a">A</u-option>
          <u-option value="b">B</u-option>
        </u-select>
      `);
      await el.updateComplete;
      expect(el.getAttribute('value')).to.equal('a');
      el.value = 'b';
      await el.updateComplete;
      expect(el.getAttribute('value')).to.equal('b');
    });
  });

  suite('constraint validation', () => {
    test('required with an empty-valued option is invalid until a value is chosen', async () => {
      const el = await fixture<Select>(html`
        <u-select required>
          <u-option value="">Choose…</u-option>
          <u-option value="a">A</u-option>
        </u-select>
      `);
      await el.updateComplete;
      expect(el.value).to.equal('');
      expect(el.checkValidity()).to.be.false;
      expect(el.validity.valueMissing).to.be.true;

      el.value = 'a';
      await el.updateComplete;
      expect(el.checkValidity()).to.be.true;
    });

    test('blocks native form submission while invalid', async () => {
      const formEl = await fixture<HTMLFormElement>(html`
        <form>
          <u-select name="x" required>
            <u-option value="">Choose…</u-option>
            <u-option value="a">A</u-option>
          </u-select>
        </form>
      `);
      const select = formEl.querySelector('u-select') as Select;
      await select.updateComplete;
      let submitted = false;
      formEl.addEventListener('submit', (e) => { e.preventDefault(); submitted = true; });
      formEl.requestSubmit();
      expect(submitted).to.be.false;
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

  // Exercises SelectNavigationController (which extends MenuFieldNavigationController).
  suite('keyboard navigation', () => {
    const sendKey = (target: HTMLElement, key: string) => {
      target.dispatchEvent(new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        cancelable: true,
        composed: true,
      }));
    };

    const mountWithOptions = async () => {
      const el = await fixture<Select>(html`
        <u-select>
          <u-option value="a">Alpha</u-option>
          <u-option value="b">Beta</u-option>
          <u-option value="c">Carrot</u-option>
          <u-option value="d">Carrots</u-option>
        </u-select>
      `);
      await el.updateComplete;
      return el;
    };

    test('ArrowDown on a closed select opens the menu', async () => {
      const el = await mountWithOptions();
      sendKey(el, 'ArrowDown');
      await el.updateComplete;
      expect(el._menu.open).to.be.true;
    });

    test('ArrowUp on a closed select also opens the menu', async () => {
      const el = await mountWithOptions();
      sendKey(el, 'ArrowUp');
      await el.updateComplete;
      expect(el._menu.open).to.be.true;
    });

    test('Escape closes an open menu', async () => {
      const el = await mountWithOptions();
      el._menu.open = true;
      await el.updateComplete;
      sendKey(el, 'Escape');
      await el.updateComplete;
      expect(el._menu.open).to.be.false;
    });

    test('Home focuses the first option', async () => {
      const el = await mountWithOptions();
      el._menu.open = true;
      await el.updateComplete;
      sendKey(el, 'Home');
      expect(el._options[0].active).to.be.true;
    });

    test('End focuses the last option', async () => {
      const el = await mountWithOptions();
      el._menu.open = true;
      await el.updateComplete;
      sendKey(el, 'End');
      const last = el._options.length - 1;
      expect(el._options[last].active).to.be.true;
    });

    test('ArrowDown moves the focus forward in an open menu', async () => {
      const el = await mountWithOptions();
      el._menu.open = true;
      await el.updateComplete;
      sendKey(el, 'Home');
      sendKey(el, 'ArrowDown');
      expect(el._options[1].active).to.be.true;
    });

    test('ArrowUp wraps to the last option from the first', async () => {
      const el = await mountWithOptions();
      el._menu.open = true;
      await el.updateComplete;
      sendKey(el, 'Home');
      sendKey(el, 'ArrowUp');
      const last = el._options.length - 1;
      expect(el._options[last].active).to.be.true;
    });

    test('Enter selects the focused option and closes the menu', async () => {
      const el = await mountWithOptions();
      el._menu.open = true;
      await el.updateComplete;
      sendKey(el, 'Home');
      sendKey(el, 'ArrowDown'); // focus index 1 = "Beta"

      setTimeout(() => sendKey(el, 'Enter'));
      await oneEvent(el, 'change');
      expect(el.value).to.equal('b');
      expect(el._menu.open).to.be.false;
    });

    test('typeahead jumps to the option whose label starts with the typed letter', async () => {
      const el = await mountWithOptions();
      el._menu.open = true;
      await el.updateComplete;
      sendKey(el, 'c');
      // "Carrot" (index 2) starts with 'c'.
      expect(el._options[2].active).to.be.true;
    });

    test('typeahead with multiple letters refines the match', async () => {
      const el = await mountWithOptions();
      el._menu.open = true;
      await el.updateComplete;
      sendKey(el, 'c');
      sendKey(el, 'a');
      sendKey(el, 'r');
      // Still matches first "Carrot" prefix; nothing closer matches.
      expect(el._options[2].active).to.be.true;
    });

    test('typeahead with a closed menu selects the matching option without opening', async () => {
      const el = await mountWithOptions();
      // Menu starts closed.
      sendKey(el, 'b');
      await el.updateComplete;
      expect(el.value).to.equal('b');
    });
  });
});
