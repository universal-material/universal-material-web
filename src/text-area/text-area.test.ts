import { expect, fixture, html, oneEvent } from '@open-wc/testing';

import { TextArea } from './text-area.js';

const textareaOf = (el: TextArea) =>
  el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!;

suite('u-text-area', () => {
  teardown(() => {
    document.querySelectorAll('u-text-area').forEach((el) => el.remove());
  });

  suite('registration', () => {
    test('is registered as u-text-area', () => {
      expect(customElements.get('u-text-area')).to.equal(TextArea);
    });

    test('is form-associated', () => {
      expect((TextArea as unknown as { formAssociated: boolean }).formAssociated).to.be.true;
    });
  });

  suite('rendering', () => {
    test('renders an internal <textarea>', async () => {
      const el = await fixture<TextArea>(html`<u-text-area></u-text-area>`);
      expect(textareaOf(el)).to.exist;
    });

    test('renders the label', async () => {
      const el = await fixture<TextArea>(html`<u-text-area label="Notes"></u-text-area>`);
      const labelEl = el.shadowRoot!.querySelector('.label')!;
      expect(labelEl.textContent!.trim()).to.equal('Notes');
    });
  });

  suite('rows property', () => {
    test('defaults to 2', async () => {
      const el = await fixture<TextArea>(html`<u-text-area></u-text-area>`);
      expect(el.rows).to.equal(2);
      expect(textareaOf(el).rows).to.equal(2);
    });

    test('reflects the rows value to the inner textarea', async () => {
      const el = await fixture<TextArea>(html`<u-text-area rows="5"></u-text-area>`);
      expect(el.rows).to.equal(5);
      expect(textareaOf(el).rows).to.equal(5);
    });
  });

  suite('value property', () => {
    test('reflects to the inner textarea', async () => {
      const el = await fixture<TextArea>(html`<u-text-area></u-text-area>`);
      el.value = 'multi\nline\ntext';
      await el.updateComplete;
      expect(textareaOf(el).value).to.equal('multi\nline\ntext');
    });

    test('typing updates the value and empty', async () => {
      const el = await fixture<TextArea>(html`<u-text-area></u-text-area>`);
      const ta = textareaOf(el);
      ta.value = 'hi';
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      expect(el.value).to.equal('hi');
      expect(el.empty).to.be.false;
    });
  });

  suite('input event', () => {
    test('inputting fires an input event that bubbles', async () => {
      const el = await fixture<TextArea>(html`<u-text-area></u-text-area>`);
      const ta = textareaOf(el);

      setTimeout(() => {
        ta.value = 'x';
        ta.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      });

      const event = await oneEvent(el, 'input');
      expect(event).to.exist;
    });
  });

  suite('disabled', () => {
    test('disables the inner textarea', async () => {
      const el = await fixture<TextArea>(html`<u-text-area disabled></u-text-area>`);
      expect(textareaOf(el).disabled).to.be.true;
    });
  });

  suite('form association', () => {
    test('submits the value with the form', async () => {
      const formEl = await fixture<HTMLFormElement>(html`
        <form><u-text-area name="notes" .value=${'hi'}></u-text-area></form>
      `);
      const data = new FormData(formEl);
      expect(data.get('notes')).to.equal('hi');
    });
  });

  suite('variant', () => {
    test('defaults to filled variant', async () => {
      const el = await fixture<TextArea>(html`<u-text-area></u-text-area>`);
      const container = el.shadowRoot!.querySelector('.container')!;
      expect(container.classList.contains('filled')).to.be.true;
    });

    test('applies outlined when variant="outlined"', async () => {
      const el = await fixture<TextArea>(html`<u-text-area variant="outlined"></u-text-area>`);
      const container = el.shadowRoot!.querySelector('.container')!;
      expect(container.classList.contains('outlined')).to.be.true;
    });
  });
});
