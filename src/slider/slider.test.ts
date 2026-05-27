import { expect, fixture, html, oneEvent } from '@open-wc/testing';

import { Slider } from './slider.js';

suite('u-slider', () => {
  teardown(() => {
    document.querySelectorAll('u-slider').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-slider', () => {
      expect(customElements.get('u-slider')).to.equal(Slider);
    });

    test('is form-associated', () => {
      expect((Slider as unknown as { formAssociated: boolean }).formAssociated).to.be.true;
    });
  });

  suite('default values', () => {
    test('defaults min=0, max=100, step=1', async () => {
      const el = await fixture<Slider>(html`<u-slider></u-slider>`);
      expect(el.min).to.equal(0);
      expect(el.max).to.equal(100);
      expect(el.step).to.equal(1);
    });

    test('value defaults to midpoint when unset', async () => {
      const el = await fixture<Slider>(html`<u-slider></u-slider>`);
      expect(el.value).to.equal(50);
    });

    test('value defaults to midpoint of custom min/max', async () => {
      const el = await fixture<Slider>(html`<u-slider min="10" max="30"></u-slider>`);
      expect(el.value).to.equal(20);
    });
  });

  suite('range mode auto-enable', () => {
    test('range becomes true when both value-start and value-end are set', async () => {
      const el = await fixture<Slider>(html`<u-slider value-start="20" value-end="60"></u-slider>`);
      expect(el.range).to.be.true;
    });

    test('range is false when only one of value-start / value-end is set', async () => {
      const el = await fixture<Slider>(html`<u-slider value-start="20"></u-slider>`);
      expect(el.range).to.be.false;
    });

    test('range can also be forced via the range attribute', async () => {
      const el = await fixture<Slider>(html`<u-slider range></u-slider>`);
      expect(el.range).to.be.true;
      expect(el.valueStart).to.equal(0);
      expect(el.valueEnd).to.equal(100);
    });

    test('valueStart and valueEnd are swapped when out of order', async () => {
      const el = await fixture<Slider>(html`<u-slider value-start="80" value-end="20"></u-slider>`);
      expect(el.valueStart).to.equal(20);
      expect(el.valueEnd).to.equal(80);
    });
  });

  suite('rendering', () => {
    test('renders a single range input in single mode', async () => {
      const el = await fixture<Slider>(html`<u-slider></u-slider>`);
      const inputs = el.shadowRoot!.querySelectorAll<HTMLInputElement>('input[type=range]');
      expect(inputs.length).to.equal(1);
    });

    test('renders two range inputs in range mode', async () => {
      const el = await fixture<Slider>(html`<u-slider value-start="0" value-end="100"></u-slider>`);
      const inputs = el.shadowRoot!.querySelectorAll<HTMLInputElement>('input[type=range]');
      expect(inputs.length).to.equal(2);
    });

    test('renders the track parts', async () => {
      const el = await fixture<Slider>(html`<u-slider></u-slider>`);
      expect(el.shadowRoot!.querySelector('[part="track"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="track-active"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="thumb"]')).to.exist;
    });
  });

  suite('disabled', () => {
    test('reflects to the disabled attribute and disables the inner input', async () => {
      const el = await fixture<Slider>(html`<u-slider disabled></u-slider>`);
      const input = el.shadowRoot!.querySelector<HTMLInputElement>('input[type=range]')!;
      expect(input.disabled).to.be.true;
    });
  });

  suite('change event', () => {
    test('fires a change event from the inner input', async () => {
      const el = await fixture<Slider>(html`<u-slider></u-slider>`);
      const input = el.shadowRoot!.querySelector<HTMLInputElement>('input[type=range]')!;

      setTimeout(() => {
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });

      const event = await oneEvent(el, 'change');
      expect(event.bubbles).to.be.true;
    });
  });

  suite('input event', () => {
    test('changing the inner input value fires an input event with the new value', async () => {
      const el = await fixture<Slider>(html`<u-slider></u-slider>`);
      const input = el.shadowRoot!.querySelector<HTMLInputElement>('input[type=range]')!;

      setTimeout(() => {
        input.value = '70';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });

      const event = await oneEvent(el, 'input');
      expect(event).to.exist;
      expect(el.value).to.equal(70);
    });
  });

  suite('form association', () => {
    test('submits name=value for single-thumb sliders', async () => {
      const formEl = await fixture<HTMLFormElement>(html`
        <form><u-slider name="vol" value="42"></u-slider></form>
      `);
      const data = new FormData(formEl);
      expect(data.get('vol')).to.equal('42');
    });

    test('submits name-start and name-end for range sliders', async () => {
      const formEl = await fixture<HTMLFormElement>(html`
        <form><u-slider name="r" value-start="10" value-end="80"></u-slider></form>
      `);
      const data = new FormData(formEl);
      expect(data.get('r-start')).to.equal('10');
      expect(data.get('r-end')).to.equal('80');
    });

    test('omits the form value when name is empty', async () => {
      const formEl = await fixture<HTMLFormElement>(html`
        <form><u-slider value="42"></u-slider></form>
      `);
      const data = new FormData(formEl);
      expect(Array.from(data.keys()).length).to.equal(0);
    });
  });

  suite('discrete / ticks rendering', () => {
    test('renders tick marks when discrete is set and step is > 0', async () => {
      const el = await fixture<Slider>(html`<u-slider discrete step="25"></u-slider>`);
      await el.updateComplete;
      const ticks = el.shadowRoot!.querySelectorAll('.tick');
      // 0, 25, 50, 75, 100 → 5 ticks
      expect(ticks.length).to.equal(5);
    });

    test('renders tick marks when ticks is set', async () => {
      const el = await fixture<Slider>(html`<u-slider ticks step="50"></u-slider>`);
      await el.updateComplete;
      const ticks = el.shadowRoot!.querySelectorAll('.tick');
      // 0, 50, 100 → 3 ticks
      expect(ticks.length).to.equal(3);
    });

    test('does not render ticks when neither discrete nor ticks is set', async () => {
      const el = await fixture<Slider>(html`<u-slider></u-slider>`);
      const ticks = el.shadowRoot!.querySelectorAll('.tick');
      expect(ticks.length).to.equal(0);
    });
  });
});
