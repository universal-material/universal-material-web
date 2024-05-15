import { PropertyValues } from '@lit/reactive-element';
import { html } from 'lit';
import { TemplateResult } from 'lit-html';
import { customElement, query, state } from 'lit/decorators.js';
import { html as staticHtml } from 'lit/static-html.js';

import { styles } from './select.styles.js';

import { UmMenu } from '../menu/menu.js';
import { UmMenuField } from '../shared/menu-field/menu-field.js';
import { UmTextFieldBase } from '../shared/text-field-base/text-field-base.js';
import { UmOption } from './option.js';
import { SelectNavigationController } from './select-navigation-controller.js';

import './option.js';

@customElement('u-select')
export class UmSelect extends UmTextFieldBase implements UmMenuField {
  static override styles = [UmTextFieldBase.styles, styles];

  nativeSelect: HTMLSelectElement = document.createElement('select');
  #navigationController = new SelectNavigationController(this);
  #connected = false;

  @state()
  get value(): string {
    return this.nativeSelect.value;
  }
  set value(value: string) {
    this.nativeSelect.value = value;

    if (!this.#connected) {
      return;
    }

    this.elementInternals.setFormValue(value);
  }

  @query('u-menu') menu!: UmMenu;
  @query('.input') input!: HTMLElement;

  @state()
  get selectedIndex(): number {
    return this.nativeSelect.selectedIndex;
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

  protected override renderControl(): TemplateResult {
    return staticHtml`
      <button class="button"></button>
      <div class="input"></div>`;
  }

  protected override renderAfterContent(): TemplateResult {
    return html`
      <u-menu>
        <slot @slotchange=${this.#handleSlotChange}></slot>
      </u-menu>
    `;
  }

  protected override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    this.empty = !this.selectedOption?.textContent?.trim();
    this.elementInternals.setFormValue(this.nativeSelect.value || null);
  }

  override connectedCallback() {
    super.connectedCallback();

    this.#connected = true;
    this.#attach();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    this.#navigationController.detach();
    this.#connected = false;
    this.nativeSelect.remove();
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

    this.#navigationController.attach(this);
    this.nativeSelect.setAttribute('tabindex', '-1');
    this.input.appendChild(this.nativeSelect);
    this.container.addEventListener('click', this.#handleClick);

    this.menu.anchorElement = this.container;
    this.menu.addEventListener('click', this.#handleMenuClick);
  }

  get menuItems(): UmOption[] {
    return this.options;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'u-select': UmSelect;
  }
}
