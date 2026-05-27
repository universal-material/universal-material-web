import { expect, fixture, html } from '@open-wc/testing';

import { ProgressBar } from './progress-bar.js';

suite('u-progress-bar', () => {
  teardown(() => {
    document.querySelectorAll('u-progress-bar').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-progress-bar', () => {
      expect(customElements.get('u-progress-bar')).to.equal(ProgressBar);
    });
  });

  suite('default property values', () => {
    test('value defaults to undefined (indeterminate)', async () => {
      const el = await fixture<ProgressBar>(html`<u-progress-bar></u-progress-bar>`);
      expect(el.value).to.equal(undefined);
    });

    test('max defaults to 1', async () => {
      const el = await fixture<ProgressBar>(html`<u-progress-bar></u-progress-bar>`);
      expect(el.max).to.equal(1);
    });
  });

  suite('indeterminate mode', () => {
    test('renders the indeterminate container when value is undefined', async () => {
      const el = await fixture<ProgressBar>(html`<u-progress-bar></u-progress-bar>`);
      expect(el.shadowRoot!.querySelector('.indeterminate')).to.exist;
      expect(el.shadowRoot!.querySelector('.determinate')).to.be.null;
    });
  });

  suite('determinate mode', () => {
    test('renders the determinate container when value is a number', async () => {
      const el = await fixture<ProgressBar>(html`<u-progress-bar value="0.5"></u-progress-bar>`);
      expect(el.shadowRoot!.querySelector('.determinate')).to.exist;
      expect(el.shadowRoot!.querySelector('.indeterminate')).to.be.null;
    });

    test('sets the active bar flex-basis proportional to value/max', async () => {
      const el = await fixture<ProgressBar>(html`<u-progress-bar value="0.25"></u-progress-bar>`);
      const active = el.shadowRoot!.querySelector<HTMLElement>('.bar.active')!;
      expect(active.style.flexBasis).to.equal('25%');
    });

    test('respects a custom max', async () => {
      const el = await fixture<ProgressBar>(html`<u-progress-bar value="50" max="100"></u-progress-bar>`);
      const active = el.shadowRoot!.querySelector<HTMLElement>('.bar.active')!;
      expect(active.style.flexBasis).to.equal('50%');
    });

    test('switches back to indeterminate when value is cleared', async () => {
      const el = await fixture<ProgressBar>(html`<u-progress-bar value="0.5"></u-progress-bar>`);
      expect(el.shadowRoot!.querySelector('.determinate')).to.exist;
      el.value = undefined;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.indeterminate')).to.exist;
    });
  });
});
