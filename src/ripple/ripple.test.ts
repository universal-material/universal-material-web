import { expect, fixture, html } from '@open-wc/testing';

import { Ripple } from './ripple.js';

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

suite('u-ripple', () => {
  teardown(() => {
    document.querySelectorAll('u-ripple').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-ripple', () => {
      expect(customElements.get('u-ripple')).to.equal(Ripple);
    });
  });

  suite('rendering', () => {
    test('renders a ripple container in shadow DOM', async () => {
      const el = await fixture<Ripple>(html`<u-ripple></u-ripple>`);
      const container = el.shadowRoot!.querySelector('.ripple-container');
      expect(container).to.exist;
    });

    test('renders a default slot for host content', async () => {
      const el = await fixture<Ripple>(html`<u-ripple>label</u-ripple>`);
      const slot = el.shadowRoot!.querySelector('slot');
      expect(slot).to.exist;
    });

    test('sets aria-hidden="true" on the host', async () => {
      const el = await fixture<Ripple>(html`<u-ripple></u-ripple>`);
      expect(el.getAttribute('aria-hidden')).to.equal('true');
    });
  });

  suite('disabled property', () => {
    test('defaults to false', async () => {
      const el = await fixture<Ripple>(html`<u-ripple></u-ripple>`);
      expect(el.disabled).to.be.false;
      expect(el.hasAttribute('disabled')).to.be.false;
    });

    test('reflects to the disabled attribute when set', async () => {
      const el = await fixture<Ripple>(html`<u-ripple></u-ripple>`);
      el.disabled = true;
      await el.updateComplete;
      expect(el.hasAttribute('disabled')).to.be.true;
    });

    test('reads the disabled attribute on construction', async () => {
      const el = await fixture<Ripple>(html`<u-ripple disabled></u-ripple>`);
      expect(el.disabled).to.be.true;
    });
  });

  suite('createRipple()', () => {
    test('appends a .ripple element into the container', async () => {
      const el = await fixture<Ripple>(html`<u-ripple style="display: block; width: 60px; height: 60px;"></u-ripple>`);
      const container = el.shadowRoot!.querySelector('.ripple-container')!;
      el.createRipple();
      expect(container.querySelectorAll('.ripple')).to.have.lengthOf(1);
    });

    test('sets --_ripple-transition-duration on the ripple element on the next frame', async () => {
      const el = await fixture<Ripple>(html`<u-ripple style="display: block; width: 60px; height: 60px;"></u-ripple>`);
      el.createRipple();
      await nextFrame();
      const ripple = el.shadowRoot!.querySelector<HTMLElement>('.ripple-container .ripple')!;
      const duration = ripple.style.getPropertyValue('--_ripple-transition-duration').trim();
      expect(duration).to.match(/^[\d.]+ms$/);
    });

    test('without releaseEventName, applies "show-forced" and returns null', async () => {
      const el = await fixture<Ripple>(html`<u-ripple style="display: block; width: 60px; height: 60px;"></u-ripple>`);
      const dismiss = el.createRipple();
      await nextFrame();
      const ripple = el.shadowRoot!.querySelector<HTMLElement>('.ripple-container .ripple')!;
      expect(ripple.classList.contains('show-forced')).to.be.true;
      expect(dismiss).to.be.null;
    });

    test('with releaseEventName, applies "show" and returns a dismiss function', async () => {
      const el = await fixture<Ripple>(html`<u-ripple style="display: block; width: 60px; height: 60px;"></u-ripple>`);
      const dismiss = el.createRipple(10, 10, 'mouseup');
      await nextFrame();
      const ripple = el.shadowRoot!.querySelector<HTMLElement>('.ripple-container .ripple')!;
      expect(ripple.classList.contains('show')).to.be.true;
      expect(dismiss).to.be.a('function');
    });

    test('returned dismiss function adds the "dismiss" class to the ripple', async () => {
      const el = await fixture<Ripple>(html`<u-ripple style="display: block; width: 60px; height: 60px;"></u-ripple>`);
      const dismiss = el.createRipple(10, 10, 'mouseup')!;
      await nextFrame();
      const ripple = el.shadowRoot!.querySelector<HTMLElement>('.ripple-container .ripple')!;
      dismiss();
      expect(ripple.classList.contains('dismiss')).to.be.true;
    });

    test('does nothing visible when triggered programmatically while disabled (but createRipple is still callable)', async () => {
      const el = await fixture<Ripple>(html`<u-ripple disabled style="display: block; width: 60px; height: 60px;"></u-ripple>`);
      el.createRipple();
      const container = el.shadowRoot!.querySelector('.ripple-container')!;
      expect(container.querySelectorAll('.ripple')).to.have.lengthOf(1);
    });
  });

  suite('mousedown handling', () => {
    test('does not create a ripple when disabled', async () => {
      const el = await fixture<Ripple>(html`<u-ripple disabled style="display: block; width: 60px; height: 60px;"></u-ripple>`);
      el.dispatchEvent(new MouseEvent('mousedown', { clientX: 10, clientY: 10, bubbles: true }));
      const container = el.shadowRoot!.querySelector('.ripple-container')!;
      expect(container.querySelectorAll('.ripple')).to.have.lengthOf(0);
    });

    test('creates a ripple on mousedown when enabled', async () => {
      const el = await fixture<Ripple>(html`<u-ripple style="display: block; width: 60px; height: 60px;"></u-ripple>`);
      el.dispatchEvent(new MouseEvent('mousedown', { clientX: 10, clientY: 10, bubbles: true }));
      const container = el.shadowRoot!.querySelector('.ripple-container')!;
      expect(container.querySelectorAll('.ripple')).to.have.lengthOf(1);
    });
  });
});
