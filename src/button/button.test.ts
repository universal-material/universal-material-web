import { expect, fixture, html, oneEvent } from '@open-wc/testing';

import { Button } from './button.js';

const containerOf = (el: Button) =>
  el.shadowRoot!.querySelector<HTMLElement>('[part="container"]')!;

suite('u-button', () => {
  teardown(() => {
    document.querySelectorAll('u-button').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-button', () => {
      expect(customElements.get('u-button')).to.equal(Button);
    });

    test('is form-associated', () => {
      expect((Button as unknown as { formAssociated: boolean }).formAssociated).to.be.true;
    });
  });

  suite('default rendering', () => {
    test('renders a native <button> element by default', async () => {
      const el = await fixture<Button>(html`<u-button>label</u-button>`);
      expect(el.shadowRoot!.querySelector('button')).to.exist;
      expect(el.shadowRoot!.querySelector('a')).to.be.null;
    });

    test('applies the default "filled" and "primary" classes to the container', async () => {
      const el = await fixture<Button>(html`<u-button>label</u-button>`);
      const container = containerOf(el);
      expect(container.classList.contains('filled')).to.be.true;
      expect(container.classList.contains('primary')).to.be.true;
    });

    test('renders the default slot for the label', async () => {
      const el = await fixture<Button>(html`<u-button>Save</u-button>`);
      const labelSlot = el.shadowRoot!.querySelector('.label-default slot:not([name])');
      expect(labelSlot).to.exist;
      const assigned = (labelSlot as HTMLSlotElement).assignedNodes({ flatten: true });
      expect(assigned.map((n) => n.textContent).join('').trim()).to.equal('Save');
    });
  });

  suite('variant property', () => {
    (['filled', 'tonal', 'elevated', 'outlined', 'text'] as const).forEach((variant) => {
      test(`applies the "${variant}" class to the container`, async () => {
        const el = await fixture<Button>(html`<u-button .variant=${variant}>x</u-button>`);
        expect(containerOf(el).classList.contains(variant)).to.be.true;
      });
    });
  });

  suite('color property', () => {
    (['primary', 'secondary', 'tertiary', 'error'] as const).forEach((color) => {
      test(`applies the "${color}" class to the container`, async () => {
        const el = await fixture<Button>(html`<u-button .color=${color}>x</u-button>`);
        expect(containerOf(el).classList.contains(color)).to.be.true;
      });
    });

    test('color=undefined collapses classMap to a literal "undefined" class (documented gotcha #10)', async () => {
      const el = await fixture<Button>(html`<u-button>x</u-button>`);
      el.color = undefined as unknown as Button['color'];
      await el.updateComplete;
      const container = containerOf(el);
      // Regression test: this documents the gotcha #10 from CLAUDE.md.
      // Consumers must filter out undefined before assigning .color.
      expect(container.classList.contains('undefined')).to.be.true;
    });
  });

  suite('trailingIcon', () => {
    test('defaults to false', async () => {
      const el = await fixture<Button>(html`<u-button>x</u-button>`);
      expect(el.trailingIcon).to.be.false;
      expect(el.hasAttribute('trailing-icon')).to.be.false;
    });

    test('reflects to the trailing-icon attribute', async () => {
      const el = await fixture<Button>(html`<u-button>x</u-button>`);
      el.trailingIcon = true;
      await el.updateComplete;
      expect(el.hasAttribute('trailing-icon')).to.be.true;
      expect(containerOf(el).classList.contains('trailing-icon')).to.be.true;
    });
  });

  suite('link mode (href)', () => {
    test('renders an <a> instead of a <button> when href is set', async () => {
      const el = await fixture<Button>(html`<u-button href="/foo">link</u-button>`);
      expect(el.shadowRoot!.querySelector('a')).to.exist;
      expect(el.shadowRoot!.querySelector('button')).to.be.null;
    });

    test('forwards href to the inner <a>', async () => {
      const el = await fixture<Button>(html`<u-button href="/foo">link</u-button>`);
      const a = el.shadowRoot!.querySelector('a')!;
      expect(a.getAttribute('href')).to.equal('/foo');
    });

    test('forwards target to the inner <a>', async () => {
      const el = await fixture<Button>(html`<u-button href="/foo" target="_blank">link</u-button>`);
      const a = el.shadowRoot!.querySelector('a')!;
      expect(a.getAttribute('target')).to.equal('_blank');
    });
  });

  suite('disabled property', () => {
    test('reflects to the disabled attribute', async () => {
      const el = await fixture<Button>(html`<u-button>x</u-button>`);
      el.disabled = true;
      await el.updateComplete;
      expect(el.hasAttribute('disabled')).to.be.true;
    });

    test('disables the inner button', async () => {
      const el = await fixture<Button>(html`<u-button disabled>x</u-button>`);
      const inner = el.shadowRoot!.querySelector('button')!;
      expect(inner.disabled).to.be.true;
    });
  });

  suite('toggle behavior', () => {
    test('does not fire change on click when toggle=false', async () => {
      const el = await fixture<Button>(html`<u-button>x</u-button>`);
      let fired = false;
      el.addEventListener('change', () => (fired = true));
      el.shadowRoot!.querySelector('button')!.click();
      expect(fired).to.be.false;
    });

    test('toggles selected and fires change on click when toggle=true', async () => {
      const el = await fixture<Button>(html`<u-button toggle>x</u-button>`);
      expect(el.selected).to.be.false;

      const inner = el.shadowRoot!.querySelector('button')!;
      setTimeout(() => inner.click());
      const event = await oneEvent(el, 'change');

      expect(event).to.exist;
      expect(el.selected).to.be.true;
    });

    test('selected reflects to the selected attribute', async () => {
      const el = await fixture<Button>(html`<u-button toggle>x</u-button>`);
      el.selected = true;
      await el.updateComplete;
      expect(el.hasAttribute('selected')).to.be.true;
    });
  });

  suite('aria-label-selected', () => {
    test('swaps to ariaLabelSelected when selected and present', async () => {
      const el = await fixture<Button>(html`
        <u-button toggle aria-label="Off" aria-label-selected="On">x</u-button>
      `);
      expect(el.getAriaLabel()).to.equal('Off');
      el.selected = true;
      expect(el.getAriaLabel()).to.equal('On');
    });

    test('falls back to ariaLabel when ariaLabelSelected is empty', async () => {
      const el = await fixture<Button>(html`<u-button toggle aria-label="Action">x</u-button>`);
      el.selected = true;
      expect(el.getAriaLabel()).to.equal('Action');
    });
  });
});
