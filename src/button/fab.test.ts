import { expect, fixture, html } from '@open-wc/testing';

import { Fab } from './fab.js';

const containerOf = (el: Fab) =>
  el.shadowRoot!.querySelector<HTMLElement>('[part="container"]')!;

suite('u-fab', () => {
  teardown(() => {
    document.querySelectorAll('u-fab').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-fab', () => {
      expect(customElements.get('u-fab')).to.equal(Fab);
    });

    test('is form-associated', () => {
      expect((Fab as unknown as { formAssociated: boolean }).formAssociated).to.be.true;
    });
  });

  suite('default property values', () => {
    test('defaults color to primary and size to medium', async () => {
      const el = await fixture<Fab>(html`<u-fab></u-fab>`);
      expect(el.color).to.equal('primary');
      expect(el.size).to.equal('medium');
      expect(el.lowered).to.be.false;
      expect(el.label).to.equal(null);
    });

    test('extended is false when label is null', async () => {
      const el = await fixture<Fab>(html`<u-fab></u-fab>`);
      expect(el.extended).to.be.false;
    });
  });

  suite('color/size container classes', () => {
    (['primary', 'secondary', 'tertiary', 'surface', 'branded'] as const).forEach((color) => {
      test(`applies the "${color}" color class`, async () => {
        const el = await fixture<Fab>(html`<u-fab .color=${color}></u-fab>`);
        expect(containerOf(el).classList.contains(color)).to.be.true;
      });
    });

    (['small', 'medium', 'large'] as const).forEach((size) => {
      test(`applies the "${size}" size class`, async () => {
        const el = await fixture<Fab>(html`<u-fab .size=${size}></u-fab>`);
        expect(containerOf(el).classList.contains(size)).to.be.true;
      });
    });
  });

  suite('label and extended', () => {
    test('renders a <span> with the label when label is set', async () => {
      const el = await fixture<Fab>(html`<u-fab label="Compose"></u-fab>`);
      const labelSpan = el.shadowRoot!.querySelector('.content span:not(.icon)')!;
      expect(labelSpan).to.exist;
      expect(labelSpan.textContent!.trim()).to.equal('Compose');
    });

    test('extended returns true when label is a non-empty string', async () => {
      const el = await fixture<Fab>(html`<u-fab label="Compose"></u-fab>`);
      expect(el.extended).to.be.true;
    });

    test('extended returns false when label is empty string', async () => {
      const el = await fixture<Fab>(html`<u-fab label=""></u-fab>`);
      expect(el.extended).to.be.false;
    });

    test('applies "extended" class to the container when label is set', async () => {
      const el = await fixture<Fab>(html`<u-fab label="Compose"></u-fab>`);
      expect(containerOf(el).classList.contains('extended')).to.be.true;
    });
  });

  suite('lowered property', () => {
    test('reflects to the lowered attribute', async () => {
      const el = await fixture<Fab>(html`<u-fab></u-fab>`);
      el.lowered = true;
      await el.updateComplete;
      expect(el.hasAttribute('lowered')).to.be.true;
      expect(containerOf(el).classList.contains('lowered')).to.be.true;
    });
  });

  suite('scrollContainer resolution', () => {
    type FabInternals = { _effectiveScrollContainer: HTMLElement | Window | null };
    const internals = (el: Fab) => el as unknown as FabInternals;

    test('returns window when unset (and no ancestor scaffold)', async () => {
      const el = await fixture<Fab>(html`<u-fab></u-fab>`);
      expect(internals(el)._effectiveScrollContainer).to.equal(window);
    });

    test('returns null when explicitly set to "none"', async () => {
      const el = await fixture<Fab>(html`<u-fab scroll-container="none"></u-fab>`);
      expect(internals(el)._effectiveScrollContainer).to.equal(null);
    });

    test('returns window when explicitly set to "window"', async () => {
      const el = await fixture<Fab>(html`<u-fab scroll-container="window"></u-fab>`);
      expect(internals(el)._effectiveScrollContainer).to.equal(window);
    });

    test('returns the element with matching id when set to an id string', async () => {
      const wrap = await fixture<HTMLElement>(html`
        <div>
          <div id="scrolly"></div>
          <u-fab scroll-container="scrolly"></u-fab>
        </div>
      `);
      const fab = wrap.querySelector('u-fab') as Fab;
      const target = wrap.querySelector('#scrolly');
      expect(internals(fab)._effectiveScrollContainer).to.equal(target);
    });

    test('returns the provided HTMLElement when assigned directly', async () => {
      const target = document.createElement('div');
      const el = await fixture<Fab>(html`<u-fab></u-fab>`);
      el.scrollContainer = target;
      await el.updateComplete;
      expect(internals(el)._effectiveScrollContainer).to.equal(target);
    });
  });

  suite('form association', () => {
    test('exposes the parent form via .form', async () => {
      const formEl = await fixture<HTMLFormElement>(html`
        <form><u-fab></u-fab></form>
      `);
      const fab = formEl.querySelector('u-fab') as Fab;
      expect(fab.form).to.equal(formEl);
    });
  });
});
