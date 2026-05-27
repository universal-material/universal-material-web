import { expect, fixture, html, oneEvent } from '@open-wc/testing';

// Importing option.js pulls select.js as a side effect, ensuring the parent
// is registered before children consume it. u-menu is registered explicitly
// because select's _setSelectedByUser path calls _menu.close().
import '../menu/menu.js';
import '../menu/menu-item.js';
import './select.js';
import { Option } from './option.js';
import { Select } from './select.js';

suite('u-option', () => {
  teardown(() => {
    document.querySelectorAll('u-select, u-option').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-option', () => {
      expect(customElements.get('u-option')).to.equal(Option);
    });

    test('inherits from MenuItem (innerRole "menuitem")', async () => {
      const select = await fixture<Select>(html`
        <u-select>
          <u-option value="a">A</u-option>
        </u-select>
      `);
      const option = select.querySelector('u-option') as Option;
      await option.updateComplete;
      const button = option.shadowRoot!.querySelector('button')!;
      expect(button.role).to.equal('menuitem');
    });
  });

  suite('value getter/setter', () => {
    test('reflects to the value attribute', async () => {
      const select = await fixture<Select>(html`
        <u-select>
          <u-option value="a">A</u-option>
        </u-select>
      `);
      const option = select.querySelector('u-option') as Option;
      expect(option.value).to.equal('a');
      expect(option.getAttribute('value')).to.equal('a');

      option.value = 'b';
      await option.updateComplete;
      expect(option.getAttribute('value')).to.equal('b');
    });

    test('setter is a no-op when the value is unchanged', async () => {
      const select = await fixture<Select>(html`
        <u-select>
          <u-option value="a">A</u-option>
        </u-select>
      `);
      const option = select.querySelector('u-option') as Option;
      const initial = option.value;
      option.value = 'a';
      expect(option.value).to.equal(initial);
    });
  });

  suite('selected property', () => {
    test('defaults to false', async () => {
      const option = await fixture<Option>(html`<u-option value="a">A</u-option>`);
      expect(option.selected).to.be.false;
    });

    test('selected setter updates the getter (no attribute reflection)', async () => {
      const select = await fixture<Select>(html`
        <u-select>
          <u-option value="a">A</u-option>
          <u-option value="b">B</u-option>
        </u-select>
      `);
      const second = select.querySelectorAll<Option>('u-option')[1];
      second.selected = true;
      expect(second.selected).to.be.true;
      // selected is a state property — not reflected as an attribute.
      expect(second.hasAttribute('selected')).to.be.false;
    });
  });

  suite('defaultSelected', () => {
    test('reads the "selected" attribute', async () => {
      const select = await fixture<Select>(html`
        <u-select>
          <u-option value="a">A</u-option>
          <u-option value="b" selected>B</u-option>
        </u-select>
      `);
      const options = select.querySelectorAll<Option>('u-option');
      expect(options[0].defaultSelected).to.be.false;
      expect(options[1].defaultSelected).to.be.true;
    });

    test('writes the "selected" attribute', async () => {
      const option = await fixture<Option>(html`<u-option value="a">A</u-option>`);
      option.defaultSelected = true;
      expect(option.hasAttribute('selected')).to.be.true;
      option.defaultSelected = false;
      expect(option.hasAttribute('selected')).to.be.false;
    });
  });

  suite('tabindex', () => {
    test('sets tabindex="-1" on the host after connect', async () => {
      const select = await fixture<Select>(html`
        <u-select>
          <u-option value="a">A</u-option>
        </u-select>
      `);
      const option = select.querySelector('u-option') as Option;
      expect(option.getAttribute('tabindex')).to.equal('-1');
    });
  });

  suite('click behavior', () => {
    test('clicking an enabled option inside u-select selects it', async () => {
      const select = await fixture<Select>(html`
        <u-select>
          <u-option value="a">A</u-option>
          <u-option value="b">B</u-option>
        </u-select>
      `);
      await select.updateComplete;
      const second = select.querySelectorAll<Option>('u-option')[1];

      // setTimeout + oneEvent ensures the menu has rendered before the click
      // path tries to close it (mirrors the pattern used by select.test.ts).
      setTimeout(() => second.click());
      await oneEvent(select, 'change');
      expect(select.value).to.equal('b');
    });

    test('clicking a disabled option is a no-op', async () => {
      const select = await fixture<Select>(html`
        <u-select>
          <u-option value="a">A</u-option>
          <u-option value="b" disabled>B</u-option>
        </u-select>
      `);
      await select.updateComplete;
      const second = select.querySelectorAll<Option>('u-option')[1];
      second.click();
      await select.updateComplete;
      expect(select.value).to.equal('a');
    });

    test('clicking an option without a parent select is a no-op', async () => {
      const option = await fixture<Option>(html`<u-option value="a">A</u-option>`);
      expect(() => option.click()).to.not.throw();
    });
  });

  suite('container selected class', () => {
    test('applies "selected" class to the container when option is selected', async () => {
      const select = await fixture<Select>(html`
        <u-select>
          <u-option value="a" selected>A</u-option>
        </u-select>
      `);
      await select.updateComplete;
      const option = select.querySelector('u-option') as Option;
      await option.updateComplete;
      const container = option.shadowRoot!.querySelector<HTMLElement>('[part="container"]')!;
      expect(container.classList.contains('selected')).to.be.true;
    });
  });
});
