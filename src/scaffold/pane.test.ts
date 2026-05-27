import { expect, fixture, html, oneEvent } from '@open-wc/testing';

import { Pane } from './pane.js';

suite('u-pane', () => {
  teardown(() => {
    document.querySelectorAll('u-pane').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-pane', () => {
      expect(customElements.get('u-pane')).to.equal(Pane);
    });
  });

  suite('default property values', () => {
    test('variant defaults to "transparent"', async () => {
      const el = await fixture<Pane>(html`<u-pane></u-pane>`);
      expect(el.variant).to.equal('transparent');
    });

    test('mode defaults to "fixed"', async () => {
      const el = await fixture<Pane>(html`<u-pane></u-pane>`);
      expect(el.mode).to.equal('fixed');
    });

    test('queryContext defaults to "media"', async () => {
      const el = await fixture<Pane>(html`<u-pane></u-pane>`);
      expect(el.queryContext).to.equal('media');
    });

    test('animation defaults to "exit"', async () => {
      const el = await fixture<Pane>(html`<u-pane></u-pane>`);
      expect(el.animation).to.equal('exit');
    });
  });

  suite('open derivation from mode', () => {
    test('defaults to true for fixed mode', async () => {
      const el = await fixture<Pane>(html`<u-pane></u-pane>`);
      expect(el.open).to.be.true;
    });

    test('defaults to true for collapsible mode', async () => {
      const el = await fixture<Pane>(html`<u-pane mode="collapsible"></u-pane>`);
      expect(el.open).to.be.true;
    });

    test('defaults to false for sidebar mode', async () => {
      const el = await fixture<Pane>(html`<u-pane mode="sidebar"></u-pane>`);
      expect(el.open).to.be.false;
    });

    test('defaults to false for fullscreen mode', async () => {
      const el = await fixture<Pane>(html`<u-pane mode="fullscreen"></u-pane>`);
      expect(el.open).to.be.false;
    });

    test('sidebar pane created with mode=sidebar is closed by default', async () => {
      const el = await fixture<Pane>(html`<u-pane mode="sidebar"></u-pane>`);
      expect(el.open).to.be.false;
    });
  });

  suite('show() / close() / toggle()', () => {
    test('show() opens the pane', async () => {
      const el = await fixture<Pane>(html`<u-pane mode="sidebar"></u-pane>`);
      el.show();
      expect(el.open).to.be.true;
    });

    test('close() closes the pane', async () => {
      const el = await fixture<Pane>(html`<u-pane mode="sidebar"></u-pane>`);
      el.show();
      el.close();
      expect(el.open).to.be.false;
    });

    test('toggle() flips open', async () => {
      const el = await fixture<Pane>(html`<u-pane mode="sidebar"></u-pane>`);
      el.toggle();
      expect(el.open).to.be.true;
      el.toggle();
      expect(el.open).to.be.false;
    });
  });

  suite('open / close events', () => {
    test('dispatches an "open" event when opening from closed', async () => {
      const el = await fixture<Pane>(html`<u-pane mode="sidebar"></u-pane>`);
      setTimeout(() => el.show());
      const event = await oneEvent(el, 'open');
      expect(event).to.exist;
      expect(event.bubbles).to.be.true;
    });

    test('dispatches a "close" event when closing from open', async () => {
      const el = await fixture<Pane>(html`<u-pane mode="sidebar"></u-pane>`);
      el.show();
      setTimeout(() => el.close());
      const event = await oneEvent(el, 'close');
      expect(event).to.exist;
    });

    test('does not dispatch open when already open', async () => {
      const el = await fixture<Pane>(html`<u-pane mode="sidebar"></u-pane>`);
      el.show();
      let fired = false;
      el.addEventListener('open', () => (fired = true));
      el.show();
      expect(fired).to.be.false;
    });
  });

  suite('open attribute reflection', () => {
    test('reflects to the open attribute', async () => {
      const el = await fixture<Pane>(html`<u-pane mode="sidebar"></u-pane>`);
      expect(el.hasAttribute('open')).to.be.false;
      el.show();
      await el.updateComplete;
      expect(el.hasAttribute('open')).to.be.true;
      el.close();
      await el.updateComplete;
      expect(el.hasAttribute('open')).to.be.false;
    });
  });

  suite('scrim click closes', () => {
    test('clicking the scrim closes the pane', async () => {
      const el = await fixture<Pane>(html`<u-pane mode="sidebar"></u-pane>`);
      el.show();
      const scrim = el.shadowRoot!.querySelector<HTMLElement>('[part="scrim"]')!;
      scrim.click();
      expect(el.open).to.be.false;
    });
  });

  suite('rendering parts', () => {
    test('exposes scrim, container, header, content parts', async () => {
      const el = await fixture<Pane>(html`<u-pane></u-pane>`);
      expect(el.shadowRoot!.querySelector('[part="scrim"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="container"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="header"]')).to.exist;
      expect(el.shadowRoot!.querySelector('[part="content"]')).to.exist;
    });
  });

  suite('breakpoint mode overrides', () => {
    test('modeSm reflects to mode-sm attribute', async () => {
      const el = await fixture<Pane>(html`<u-pane></u-pane>`);
      el.modeSm = 'sidebar';
      await el.updateComplete;
      expect(el.getAttribute('mode-sm')).to.equal('sidebar');
    });
  });
});
