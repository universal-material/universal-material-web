import { expect, fixture, html } from '@open-wc/testing';

import { Icon } from './icon.js';

suite('u-icon', () => {
  teardown(() => {
    document.querySelectorAll('u-icon').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-icon', () => {
      expect(customElements.get('u-icon')).to.equal(Icon);
    });

    test('instantiates a class extending HTMLElement', async () => {
      const el = await fixture<Icon>(html`<u-icon></u-icon>`);
      expect(el).to.be.instanceOf(Icon);
      expect(el).to.be.instanceOf(HTMLElement);
    });
  });

  suite('rendering', () => {
    test('renders a default slot in shadow DOM', async () => {
      const el = await fixture<Icon>(html`<u-icon></u-icon>`);
      const slot = el.shadowRoot!.querySelector('slot');
      expect(slot).to.exist;
      expect(slot!.name).to.equal('');
    });

    test('forwards children to the default slot', async () => {
      const el = await fixture<Icon>(html`<u-icon>star</u-icon>`);
      const slot = el.shadowRoot!.querySelector('slot')!;
      const assigned = slot.assignedNodes({ flatten: true });
      const text = assigned
        .map((n) => n.textContent ?? '')
        .join('')
        .trim();
      expect(text).to.equal('star');
    });

    test('accepts element children in the slot', async () => {
      const el = await fixture<Icon>(html`
        <u-icon><svg></svg></u-icon>
      `);
      const slot = el.shadowRoot!.querySelector('slot')!;
      const assignedElements = slot.assignedElements();
      expect(assignedElements).to.have.lengthOf(1);
      expect(assignedElements[0].tagName.toLowerCase()).to.equal('svg');
    });
  });
});
