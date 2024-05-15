import { PropertyValues } from '@lit/reactive-element';
import { html, HTMLTemplateResult } from 'lit';
import { customElement, query, queryAll, state } from 'lit/decorators.js';

import { styles } from './select.styles.js';

import { UmMenu } from '../menu/menu.js';
import { UmTextFieldBase } from '../shared/text-field-base/text-field-base.js';
import { UmOption } from './option.js';

import './option.js';

@customElement('u-select')
export class UmSelect extends UmTextFieldBase {
  static override styles = [UmTextFieldBase.styles, styles];

  @state()
  get value(): string {
    return this.nativeSelect?.value ?? '';
  }
  set value(value: string) {
    this.nativeSelect.value = value;
    this.elementInternals.setFormValue(value);
  }

  @query('u-menu') menu!: UmMenu;
  @query('select') nativeSelect!: HTMLSelectElement;
  @queryAll('option') nativeOptions!: HTMLOptionElement[];

  @state()
  get selectedIndex(): number {
    return this.nativeSelect?.selectedIndex ?? -1;
  }
  set selectedIndex(index: number) {
    this.nativeSelect.selectedIndex = index;
  }

  get selectedOption(): UmOption | null {
    return this.options[this.selectedIndex] ?? null;
  }

  private _options: UmOption[] = [];
  get options(): UmOption[] {
    return this._options;
  }

  protected override renderControl(): HTMLTemplateResult {
    return html`
      <div class="input">
        <select>
          ${this.options.map(o => html`<option value="${o.value}" ?selected=${o._selectedAttribute}>${o.textContent}</option>`)}
        </select>
      </div>
    `;
  }

  protected override renderAfterContent(): HTMLTemplateResult {
    return html`
      <u-menu>
        <slot @slotchange=${this.#handleSlotChange}></slot>
      </u-menu>
    `;
  }

  protected override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    this.empty = this.nativeSelect && !this.nativeSelect.options[this.nativeSelect.selectedIndex]?.label?.trim();
    this.elementInternals.setFormValue(this.nativeSelect.value);
  }

  override connectedCallback() {
    super.connectedCallback();

    this.#attach();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.container.removeEventListener('click', this.#handleClick);
    this.menu.removeEventListener('click', this.#handleMenuClick);
  }

  #handleClick = () => {
    this.menu.toggle();
  };

  #handleMenuClick(e: Event) {
    e.stopPropagation();
  }

  #handleSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const elements = slot.assignedElements({
      flatten: true
    });

    this.options.length = 0;

    for (const element of elements) {
      if (element instanceof UmOption) {
        this.options.push(element)
      }
    }

    this.requestUpdate();
  }

  async #attach(): Promise<void> {
    await this.updateComplete;

    this.container.addEventListener('click', this.#handleClick);

    this.menu.anchorElement = this.container;
    this.menu.addEventListener('click', this.#handleMenuClick);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-select': UmSelect;
  }
}
