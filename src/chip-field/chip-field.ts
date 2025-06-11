import { CSSResultGroup } from '@lit/reactive-element/css-tag';

import { html, HTMLTemplateResult, nothing } from 'lit';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { customElement, property, query } from 'lit/decorators.js';

import { UmTextFieldBase } from '../shared/text-field-base/text-field-base.js';
import { styles } from './chip-field.styles.js';

@customElement('u-chip-field')
export class UmChipField extends UmTextFieldBase {
  static override styles: CSSResultGroup = [UmTextFieldBase.styles, styles];

  @query('input') input!: HTMLInputElement;
  @property() name!: string;

  /**
   * If true, ignore enter key input
   */
  @property({ type: Boolean }) manual = false;

  /**
   * A function return a string based on a item from the `value`. Useful when the items of value are objects.
   */
  formatter: ((value: any) => string) | undefined;

  /**
   * A string representing an HTML to be rendered inside as leading icon of each chip.
   *
   * _Note:_ Subject to signature change
   */
  leadingIconTemplate: ((value: any) => string) | undefined;

  #value: any[] = [];

  /**
   * An array containing the value representation of each chip.
   *
   * _Note:_ Add or remove items directly from value array won't trigger a render on Chip Field. Use the methods `add` or `removeAt`.
   */
  get value(): any[] {
    return this.#value;
  }

  set value(value: any[]) {
    this.#value = value;
    this.#valueUpdate();
  }

  private setFormValue() {
    const formData = new FormData();

    for (const item of this.value) {
      formData.append(this.name, this.getItemLabel(item));
    }

    this.elementInternals.setFormValue(formData);
  }

  override focus() {
    this.input.focus();
  }

  protected override renderControl(): HTMLTemplateResult {
    return html`
      <div class="input">
        ${this.#getChips()}
        <input
          part="input"
          id=${this.id || nothing}
          aria-labelledby="label"
          ?disabled=${this.disabled}
          placeholder=${this.placeholder || nothing}
          @blur=${this.#handleBlur}
          @keydown=${this.#handleKeyDown}
          @input=${this.#handleInput} />
      </div>
    `;
  }

  #getChips() {
    return this.value?.map((item, index) => {
      const leadingIcon = this.leadingIconTemplate
        ? html`
            <span slot="leading-icon">${unsafeHTML(this.leadingIconTemplate(item))}</span>
          `
        : nothing;

      return html`
        <u-chip removable ?disabled=${this.disabled} @remove=${this.#removeChip(index)}>
          ${leadingIcon} ${this.getItemLabel(item)}
        </u-chip>
      `;
    });
  }

  #handleBlur() {
    this.requestUpdate();
  }

  #handleInput() {
    this.#setEmpty();
  }

  #handleKeyDown(e: KeyboardEvent) {
    if (!this.manual && e.key === 'Enter') {
      this.add(this.input.value, true);
      this.input.value = '';
      return;
    }

    if (e.key === 'Backspace' && this.input.selectionStart === 0 && this.input.selectionEnd === 0) {
      this.#removeChip(this.value.length - 1)();
      return;
    }
  }

  add(value: any, triggerChange = false) {
    this.value.push(value);

    this.#changed(triggerChange);
  }

  removeAt(index: number, triggerChange = false) {
    this.value.splice(index, 1);
    this.#changed(triggerChange);
  }

  readonly #removeChip = (index: number) => (e?: Event) => {
    e?.preventDefault();

    this.input.focus();
    const defaultPrevented = this.#dispatchRemoveEvent(index);

    if (defaultPrevented) {
      return;
    }

    this.removeAt(index, true);
  };

  #changed(triggerChange: boolean) {
    this.#valueUpdate();

    if (triggerChange) {
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  #valueUpdate() {
    this.#setEmpty();
    this.setFormValue();
    this.requestUpdate();
  }

  #setEmpty() {
    this.empty = !this.value?.length && !this.input?.value;
  }

  #dispatchRemoveEvent(index: number): boolean {
    const item = this.value[index];

    const event = new CustomEvent('remove', {
      cancelable: true,
      detail: item,
    });

    this.dispatchEvent(event);

    return event.defaultPrevented;
  }

  private getItemLabel(item: any) {
    return this.formatter ? this.formatter(item) : item.toString();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-chip-field': UmChipField;
  }
}
