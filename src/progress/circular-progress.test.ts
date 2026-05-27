import { expect, fixture, html } from '@open-wc/testing';

import { CircularProgress } from './circular-progress.js';

suite('u-circular-progress', () => {
  teardown(() => {
    document.querySelectorAll('u-circular-progress').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-circular-progress', () => {
      expect(customElements.get('u-circular-progress')).to.equal(CircularProgress);
    });
  });

  suite('default property values', () => {
    test('value defaults to undefined (indeterminate)', async () => {
      const el = await fixture<CircularProgress>(html`<u-circular-progress></u-circular-progress>`);
      expect(el.value).to.equal(undefined);
    });

    test('max defaults to 1', async () => {
      const el = await fixture<CircularProgress>(html`<u-circular-progress></u-circular-progress>`);
      expect(el.max).to.equal(1);
    });
  });

  suite('indeterminate mode', () => {
    test('renders an SVG with the "indeterminate" class when value is undefined', async () => {
      const el = await fixture<CircularProgress>(html`<u-circular-progress></u-circular-progress>`);
      expect(el.shadowRoot!.querySelector('.circular.indeterminate')).to.exist;
      expect(el.shadowRoot!.querySelector('.circular.on-going')).to.be.null;
    });
  });

  suite('determinate mode', () => {
    test('renders the on-going SVG circles when value is provided', async () => {
      const el = await fixture<CircularProgress>(html`<u-circular-progress value="0.5"></u-circular-progress>`);
      const circles = el.shadowRoot!.querySelectorAll('.circular.on-going');
      expect(circles.length).to.equal(2);
    });

    test('respects a custom max', async () => {
      const el = await fixture<CircularProgress>(html`<u-circular-progress value="50" max="100"></u-circular-progress>`);
      const circles = el.shadowRoot!.querySelectorAll('.circular.on-going');
      expect(circles.length).to.equal(2);
    });

    test('switches back to indeterminate when value is cleared', async () => {
      const el = await fixture<CircularProgress>(html`<u-circular-progress value="0.5"></u-circular-progress>`);
      el.value = undefined;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.circular.indeterminate')).to.exist;
    });
  });
});
