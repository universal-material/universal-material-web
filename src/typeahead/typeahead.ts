import { html, HTMLTemplateResult, LitElement } from 'lit';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { customElement, property, query, queryAll, state } from 'lit/decorators.js';

import { styles } from './typeahead.styles.js';

import { UmMenuItem } from '../menu/menu-item.js';
import { UmMenu } from '../menu/menu.js';
import { MenuFieldNavigationController } from '../shared/menu-field/menu-field-navigation-controller.js';
import { normalizeText } from '../shared/normalize-text.js';

import './highlight.js';

export interface Data {
  label: string;
  value: any;
}

@customElement('u-typeahead')
export class UmTypeahead extends LitElement {
  static readonly formAssociated = true;

  static override styles = styles;

  #targetId: string | undefined;

  #connected = false;
  private target: HTMLElement & {autocomplete: 'on' | 'off' | string | null; input?: HTMLInputElement; container?: HTMLElement; value: string} | null = null;
  #documentMutationObserver: MutationObserver | null = null;
  #navigationController = new MenuFieldNavigationController(this);
  #termNormalized: string = '';
  #debounceTimeout: number | null = null;
  #value: any;
  readonly #elementInternals: ElementInternals;

  // @ts-ignore
  @state() private results: Data[];

  /**
   * The datasource of the typeahead. Accepts an `Array` or a `Promise<[]>`.
   */
  @state() source: (any[] | ((term: string) => Promise<any[]>)) | undefined;

  /**
   * A function return a string based on a result from the `source`. Useful when the source results are objects.
   */
  formatter: ((value: any) => string) | undefined;

  /**
   * A string representing an HTML to be rendered inside the menu item. If set, it will replace the `u-highlight`.
   *
   * _Note:_ Subject to signature change
   */
  template: ((term: string, value: any) => string) | undefined;

  /**
   * The time in milliseconds before triggering an update in the results.
   */
  @property({type: Number, reflect: true}) debounce = 300;

  /**
   * The number of suggestions to show
   */
  @property({type: Number, reflect: true}) limit = 10;

  /**
   * How many characters must be typed before show suggestions
   *
   * _Note:_ Not used when the source is a `Promise`
   */
  @property({type: Number, reflect: true}) minLength = 2;

  /**
   * Whether the menu will be show when the target get focus.
   *
   * _Note:_ The `minLength` will still be applied
   */
  @property({type: Boolean, attribute: 'open-on-focus', reflect: true}) openOnFocus = false;

  /**
   * If `true`, model values will not be restricted only to items selected from the menu.
   */
  @property({type: Boolean, reflect: true}) editable = false;

  /**
   * The value for the `autocomplete` attribute for the target element.
   */
  @property({reflect: true}) autocomplete: 'on' | 'off' | string = 'off';

  /**
   * The value for the `spellcheck` attribute for the target element.
   */
  @property({reflect: true}) override spellcheck = false;

  get form(): HTMLFormElement | null {
    return this.#elementInternals.form;
  }

  /**
   * Gets or sets the current value of the typeahead.
   */
  get value(): any {
    return this.#value;
  }
  set value(value: any) {
    this.#value = value;
    this.#elementInternals.setFormValue(value);

    if (this.#connected) {
      this.#setValueOnTarget();
    }
  }

  override focus() {
    this.target?.focus();
  }

  clear() {
    if (!this.target) {
      return;
    }

    this.#termNormalized = '';
    this.setTargetValue('');
  }

  /**
   * The id of the target element to attach the typeahead.
   */
  @property({reflect: true, attribute: "target-id"})
  get targetId(): string | undefined {
    return this.#targetId;
  }
  set targetId(value: string | undefined) {
    this.#targetId = value;

    if (this.#connected) {
      this.#attach();
    }
  }

  @query('u-menu') _menu!: UmMenu;
  @queryAll('u-menu-item') _menuItems!: UmMenuItem[];

  constructor() {
    super();
    this.#elementInternals = this.attachInternals();
  }

  override attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    super.attributeChangedCallback(name, _old, value);

    if (name === 'autocomplete') {
      this.target!.autocomplete = value;
    }

    if (name === 'spellcheck') {
      this.target!.spellcheck = value === 'true';
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.#connected = true;
    this.#attach();
    this.#documentMutationObserver = new MutationObserver(() => this.#attach())
    this.#documentMutationObserver.observe(document, {attributes: true, childList: true});
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#connected = false;
    this.#detach();
    this.#documentMutationObserver!.disconnect();
    this.#documentMutationObserver = null;
  }

  #attach() {
    if (!this.targetId) {
      this.#detach();
      return;
    }

    const newTarget = document.getElementById(this.targetId) as HTMLInputElement;

    if (newTarget === this.target) {
      return;
    }

    this.#detach();

    if (!newTarget) {
      return;
    }

    // @ts-ignore
    this.target = newTarget;
    newTarget.role = "combobox";
    newTarget.autocomplete = <any>this.autocomplete;
    newTarget.spellcheck = this.spellcheck;
    newTarget.autocapitalize = 'off';

    newTarget.addEventListener('click', this.#handleClick);
    newTarget.addEventListener('input', this.#handleInput);
    this.#navigationController.attach(newTarget);
    newTarget.addEventListener('focus', this.#handleFocus);

    if (this.value) {
      this.#setValueOnTarget();
    }
  }

  #detach() {
    this.target?.removeEventListener('click', this.#handleClick);
    this.target?.removeEventListener('input', this.#handleInput);
    this.#navigationController.detach();
    this.target?.removeEventListener('focus', this.#handleFocus);
  }

  #handleFocus = async () => {
    if (this.openOnFocus) {
      await this.#updateResults();
    }
  }

  #handleInput = () => {

    if (this.#debounceTimeout) {
      clearTimeout(this.#debounceTimeout);
    }

    this.#setValueAndDispatchEvents(this.editable ? this.getTargetValue() : null, true);

    this.#debounceTimeout = setTimeout(async () => await this.#updateResults(true), this.debounce);
  }

  #getItemClickHandler(data: Data) {
    return () => {
      const selectedEvent = new CustomEvent('selected', {
        cancelable: true,
        detail: data.value
      });

      this.dispatchEvent(selectedEvent);

      if (selectedEvent.defaultPrevented) {
        return;
      }

      this.#setValueAndDispatchEvents(data.value);
    }
  }

  #setValueAndDispatchEvents(value: any, direct = false) {

    if (!direct) {
      this.value = value;
    } else {
      this.#value = value;
      this.#elementInternals.setFormValue(value);
    }

    this.dispatchEvent(new InputEvent('input', {bubbles: true, composed: true}));
    this.dispatchEvent(new Event('change', {bubbles: true}));
  }

  protected override render(): HTMLTemplateResult {

    if (!this.results?.length) {
      return html``;
    }

    setTimeout(() => {
      this._menu.anchorElement = this.getMenuAnchor();
      this._menu.open = true;
    });

    return html`
      <u-menu manualFocus anchor-corner="auto-start">
        ${this.results
          .map(result => {
            const content = this.template
              ? unsafeHTML(this.template(this.#termNormalized, result.value))
              : html`<u-highlight .term=${this.#termNormalized} .result=${result.label}></u-highlight>`;
            
            return html`
              <u-menu-item @click=${this.#getItemClickHandler(result)} tabindex="-1">${content}</u-menu-item>`;
          })}
      </u-menu>
    `;
  }

  async #updateResults(lazy = false) {

    const term = this.getTargetValue();

    const termNormalized = normalizeText(term).toLowerCase();

    if (lazy && termNormalized === this.#termNormalized && this._menu?.open === true) {
      return;
    }

    this.#termNormalized = termNormalized;

    if (termNormalized.length < this.minLength) {
      this.results = [];
      return;
    }

    this.results = await this.#getData();
    this.results = this.results.slice(0, this.limit || this.results.length);
  }

  async #getData(): Promise<Data[]> {
    if (!this.source) {
      return [];
    }

    let values: any[]

    let filter = false;

    if (this.source instanceof Array) {
      values = this.source;
      filter = true;
    } else {
      const source = this.source as ((term: string) => Promise<any[]>);
      values = await source(this.#termNormalized);
    }

    const result = values
      .map(source => ({
        label: this.formatter
          ? this.formatter(source)
          : source.toString(),
        value: source
      }));

    if (!filter) {
      return result;
    }

    return result
      .filter(t => normalizeText(t.label)
      .toLowerCase()
      .includes(this.#termNormalized))
  }

  #setValueOnTarget() {
    if (!this.target) {
      return;
    }

    const textValue = this.getTextValue();
    this.#termNormalized = normalizeText(textValue)?.toLowerCase();

    if (this.target.tagName === 'U-TEXT-FIELD') {
      this.target.value = textValue;
      return;
    }

    if (this.target.input) {
      this.target.input.value = textValue;
      return;
    }
 
    this.target.value = textValue;
  }

  private getTargetValue(): string {
    return this.target!.input?.value ?? this.target!.value;
  }

  private setTargetValue(value: string): void {
    const targetInput = this.target?.input ?? this.target;

    if (targetInput) {
      targetInput.value = value;
    }
  }

  private getMenuAnchor() {
    if (!this.target) {
      return null;
    }

    if (this.target.tagName === 'U-CHIP-FIELD') {
      return this.target.input;
    }

    if (this.target.tagName === 'U-TEXT-FIELD') {
      return this.target.container;
    }

    return this.target;
  }

  private getTextValue(): string {
    if (!this.value) {
      return '';
    }

    return this.formatter
      ? this.formatter(this.value)
      : this.value
  }

  #handleClick(e: Event) {
    e.stopPropagation();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-typeahead': UmTypeahead;
  }
}
