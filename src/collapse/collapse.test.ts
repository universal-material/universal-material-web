import { expect, fixture, html } from '@open-wc/testing';

import { Collapse } from './collapse.js';

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

suite('u-collapse', () => {
  teardown(() => {
    document.querySelectorAll('u-collapse').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-collapse', () => {
      expect(customElements.get('u-collapse')).to.equal(Collapse);
    });
  });

  suite('rendering', () => {
    test('renders a content wrapper with part="content"', async () => {
      const el = await fixture<Collapse>(html`<u-collapse>body</u-collapse>`);
      expect(el.shadowRoot!.querySelector('[part="content"]')).to.exist;
    });

    test('forwards children to the default slot', async () => {
      const el = await fixture<Collapse>(html`
        <u-collapse><div id="x">hi</div></u-collapse>
      `);
      const slot = el.shadowRoot!.querySelector('slot')!;
      const assigned = slot.assignedElements();
      expect(assigned).to.have.lengthOf(1);
      expect((assigned[0] as HTMLElement).id).to.equal('x');
    });
  });

  suite('open property', () => {
    test('defaults to false', async () => {
      const el = await fixture<Collapse>(html`<u-collapse>body</u-collapse>`);
      expect(el.open).to.be.false;
      expect(el.hasAttribute('open')).to.be.false;
    });

    test('reflects to the open attribute', async () => {
      const el = await fixture<Collapse>(html`<u-collapse>body</u-collapse>`);
      el.open = true;
      await el.updateComplete;
      expect(el.hasAttribute('open')).to.be.true;
    });

    test('honors initial open attribute', async () => {
      const el = await fixture<Collapse>(html`<u-collapse open>body</u-collapse>`);
      expect(el.open).to.be.true;
    });
  });

  suite('max-height behavior', () => {
    test('sets host max-height to "0" when closed', async () => {
      const el = await fixture<Collapse>(html`<u-collapse><div style="height: 50px;"></div></u-collapse>`);
      await el.updateComplete;
      expect(el.style.maxHeight).to.equal('0px');
    });

    test('sets host max-height to the content scrollHeight when open', async () => {
      const el = await fixture<Collapse>(html`
        <u-collapse open><div style="height: 50px;"></div></u-collapse>
      `);
      await el.updateComplete;
      await nextFrame();
      const max = parseInt(el.style.maxHeight, 10);
      expect(max).to.be.greaterThan(0);
    });
  });
});
