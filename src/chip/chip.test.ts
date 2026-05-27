import { expect, fixture, html, oneEvent } from '@open-wc/testing';

import { ChipSet } from './chip-set.js';
import { Chip } from './chip.js';

const containerOf = (el: Chip) =>
  el.shadowRoot!.querySelector<HTMLElement>('[part="container"]')!;

suite('u-chip', () => {
  teardown(() => {
    document.querySelectorAll('u-chip').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-chip', () => {
      expect(customElements.get('u-chip')).to.equal(Chip);
    });
  });

  suite('default rendering', () => {
    test('renders a button container', async () => {
      const el = await fixture<Chip>(html`<u-chip>label</u-chip>`);
      expect(el.shadowRoot!.querySelector('button')).to.exist;
    });

    test('renders the label slot', async () => {
      const el = await fixture<Chip>(html`<u-chip>label</u-chip>`);
      const label = el.shadowRoot!.querySelector('.label slot');
      expect(label).to.exist;
    });
  });

  suite('boolean property reflection', () => {
    (
      [
        ['selected', 'selected'],
        ['clickable', 'clickable'],
        ['elevated', 'elevated'],
        ['toggle', 'toggle'],
        ['removable', 'removable'],
        ['hideSelectedIcon', 'hide-selected-icon'],
      ] as const
    ).forEach(([prop, attr]) => {
      test(`${prop} reflects to the "${attr}" attribute`, async () => {
        const el = await fixture<Chip>(html`<u-chip>x</u-chip>`);
        (el as any)[prop] = true;
        await el.updateComplete;
        expect(el.hasAttribute(attr)).to.be.true;
      });
    });
  });

  suite('container classes', () => {
    test('applies selected/toggle/clickable classes', async () => {
      const el = await fixture<Chip>(html`<u-chip toggle clickable selected>x</u-chip>`);
      const container = containerOf(el);
      expect(container.classList.contains('selected')).to.be.true;
      expect(container.classList.contains('toggle')).to.be.true;
      expect(container.classList.contains('clickable')).to.be.true;
    });
  });

  suite('removable', () => {
    test('renders a remove button when removable is set', async () => {
      const el = await fixture<Chip>(html`<u-chip removable>x</u-chip>`);
      const removeBtn = el.shadowRoot!.querySelector('.remove-button');
      expect(removeBtn).to.exist;
    });

    test('does not render a remove button when removable is not set', async () => {
      const el = await fixture<Chip>(html`<u-chip>x</u-chip>`);
      const removeBtn = el.shadowRoot!.querySelector('.remove-button');
      expect(removeBtn).to.be.null;
    });

    test('clicking the remove button removes the chip', async () => {
      const wrap = await fixture<HTMLElement>(html`
        <div><u-chip removable>x</u-chip></div>
      `);
      const chip = wrap.querySelector('u-chip') as Chip;
      const btn = chip.shadowRoot!.querySelector<HTMLElement>('.remove-button')!;
      btn.click();
      expect(wrap.querySelector('u-chip')).to.be.null;
    });

    test('clicking the remove button fires a cancelable "remove" event', async () => {
      const chip = await fixture<Chip>(html`<u-chip removable>x</u-chip>`);
      const btn = chip.shadowRoot!.querySelector<HTMLElement>('.remove-button')!;
      setTimeout(() => btn.click());
      const event = await oneEvent(chip, 'remove');
      expect(event.cancelable).to.be.true;
    });

    test('preventDefault on "remove" keeps the chip in the DOM', async () => {
      const wrap = await fixture<HTMLElement>(html`
        <div><u-chip removable>x</u-chip></div>
      `);
      const chip = wrap.querySelector('u-chip') as Chip;
      chip.addEventListener('remove', (e) => e.preventDefault());
      const btn = chip.shadowRoot!.querySelector<HTMLElement>('.remove-button')!;
      btn.click();
      expect(wrap.querySelector('u-chip')).to.equal(chip);
    });
  });

  suite('toggle behavior', () => {
    test('clicking the chip toggles selected and fires change when toggle=true', async () => {
      const chip = await fixture<Chip>(html`<u-chip toggle>x</u-chip>`);
      const inner = chip.shadowRoot!.querySelector<HTMLElement>('button')!;
      setTimeout(() => inner.click());
      const event = await oneEvent(chip, 'change');
      expect(event).to.exist;
      expect(chip.selected).to.be.true;
    });

    test('does not toggle when toggle=false', async () => {
      const chip = await fixture<Chip>(html`<u-chip>x</u-chip>`);
      const inner = chip.shadowRoot!.querySelector<HTMLElement>('button')!;
      inner.click();
      expect(chip.selected).to.equal(false);
    });
  });
});

suite('u-chip-set', () => {
  teardown(() => {
    document.querySelectorAll('u-chip-set').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-chip-set', () => {
      expect(customElements.get('u-chip-set')).to.equal(ChipSet);
    });
  });

  suite('alignment property', () => {
    test('defaults to "start"', async () => {
      const el = await fixture<ChipSet>(html`<u-chip-set></u-chip-set>`);
      expect(el.alignment).to.equal('start');
      expect(el.getAttribute('alignment')).to.equal('start');
    });

    (['start', 'center', 'end'] as const).forEach((alignment) => {
      test(`reflects "${alignment}" to the alignment attribute`, async () => {
        const el = await fixture<ChipSet>(html`<u-chip-set></u-chip-set>`);
        el.alignment = alignment;
        await el.updateComplete;
        expect(el.getAttribute('alignment')).to.equal(alignment);
      });
    });
  });
});
