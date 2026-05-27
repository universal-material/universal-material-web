import { expect, fixture, html } from '@open-wc/testing';

import { redispatchEvent } from './redispatch-event.js';

suite('redispatchEvent', () => {
  let host: HTMLDivElement;

  setup(async () => {
    host = await fixture<HTMLDivElement>(html`<div></div>`);
  });

  teardown(() => {
    host.remove();
  });

  suite('return value', () => {
    test('returns true when the redispatched event is not cancelled', () => {
      const event = new Event('click', { cancelable: true });
      const result = redispatchEvent(host, event);
      expect(result).to.be.true;
    });

    test('returns false when a listener calls preventDefault on the copy', () => {
      host.addEventListener('click', (e) => e.preventDefault());
      const event = new Event('click', { cancelable: true });
      const result = redispatchEvent(host, event);
      expect(result).to.be.false;
    });

    test('propagates preventDefault back to the original event', () => {
      host.addEventListener('click', (e) => e.preventDefault());
      const event = new Event('click', { cancelable: true });
      redispatchEvent(host, event);
      expect(event.defaultPrevented).to.be.true;
    });
  });

  suite('event copy', () => {
    test('dispatches a new event of the same type by default', () => {
      let receivedEvent: Event | null = null;
      host.addEventListener('click', (e) => (receivedEvent = e));

      const original = new Event('click', { bubbles: true });
      redispatchEvent(host, original);

      expect(receivedEvent).to.exist;
      expect(receivedEvent).to.not.equal(original);
      expect((receivedEvent as unknown as Event).type).to.equal('click');
    });

    test('renames the event when newType is provided', () => {
      let received: Event | null = null;
      host.addEventListener('tap', (e) => (received = e));

      const original = new Event('click', { bubbles: true });
      redispatchEvent(host, original, 'tap');

      expect(received).to.exist;
      expect((received as unknown as Event).type).to.equal('tap');
    });

    test('preserves the constructor (uses Reflect.construct on event.constructor)', () => {
      let received: Event | null = null;
      host.addEventListener('input', (e) => (received = e));

      const original = new InputEvent('input', { bubbles: true, data: 'x' });
      redispatchEvent(host, original);

      expect(received).to.be.instanceOf(InputEvent);
    });
  });

  suite('bubbling propagation control', () => {
    test('stops propagation of the original bubbling event when host has no shadowRoot', () => {
      let stopped = false;
      const original = new Event('click', { bubbles: true, cancelable: true });
      const realStop = original.stopPropagation.bind(original);
      original.stopPropagation = () => {
        stopped = true;
        realStop();
      };

      redispatchEvent(host, original);
      expect(stopped).to.be.true;
    });

    test('does not stop propagation for non-bubbling events', () => {
      let stopped = false;
      const original = new Event('click', { bubbles: false, cancelable: true });
      const realStop = original.stopPropagation.bind(original);
      original.stopPropagation = () => {
        stopped = true;
        realStop();
      };

      redispatchEvent(host, original);
      expect(stopped).to.be.false;
    });
  });
});
