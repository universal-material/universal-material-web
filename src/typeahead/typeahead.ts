import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

import { styles } from './typeahead.styles.js';

import { UmMenu } from '../menu/menu.js';
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

  #for: string | undefined;

  #connected = false;
  private target: HTMLElement & {value: string} | null = null;
  #documentMutationObserver: MutationObserver | null = null;
  #termNormalized: string = '';
  #debounceTimeout: number | null = null;
  #value: any;
  readonly #elementInternals: ElementInternals;

  // @ts-ignore
  @state() results: Data[];

  @property() source: (any[] | (() => Promise<any[]>)) | undefined;
  @property() formatter: ((value: any) => string) | undefined;

  @property({type: Number, reflect: true}) debounce = 300;
  @property({type: Number, reflect: true}) limit = 10;
  @property({type: Number, reflect: true}) minLength = 2;
  @property({type: Boolean, attribute: 'open-on-focus', reflect: true}) openOnFocus = false;
  @property({type: Boolean, reflect: true})
  editable = false;

  get form(): HTMLFormElement | null {
    return this.#elementInternals.form;
  }

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

  @property({reflect: true})
  get for(): string | undefined {
    return this.#for;
  }
  set for(value: string | undefined) {
    this.#for = value;

    if (this.#connected) {
      this.#attach();
    }
  }

  @query('u-menu') menu!: UmMenu;

  constructor() {
    super();
    this.#elementInternals = this.attachInternals();
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
    if (!this.for) {
      this.#detach();
      return;
    }

    const newTarget = document.getElementById(this.for) as HTMLInputElement;

    if (newTarget === this.target) {
      return;
    }

    this.#detach();

    if (!newTarget) {
      return;
    }

    // @ts-ignore
    this.target = newTarget;

    newTarget.addEventListener('input', this.#handleInput);
    newTarget.addEventListener('focus', this.#handleFocus);

    if (this.value) {
      this.#setValueOnTarget();
    }
  }

  #detach() {
    this.target?.removeEventListener('input', this.#handleInput);
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

    this.#setValueAndDispatchEvents(this.editable ? this.target!.value : null, true);

    this.#debounceTimeout = setTimeout(async () => await this.#updateResults(true), this.debounce);
  }

  #getItemClickHandler(data: Data) {
    return () => this.#setValueAndDispatchEvents(data.value)
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
    console.log('render');

    if (!this.results?.length) {
      return html``;
    }

    setTimeout(() => this.menu.open = true, 200);
    return html`
      <u-menu manualFocus>
        ${this.results
          .map(result => html`
            <u-menu-item @click=${this.#getItemClickHandler(result)}>
              <u-highlight .term=${this.#termNormalized} .result=${result.label}></u-highlight>
            </u-menu-item>`)}
      </u-menu>
    `;
  }

  async #updateResults(lazy = false) {

    const term = this.target!.value;

    const termNormalized = normalizeText(term).toLowerCase();

    if (lazy && termNormalized === this.#termNormalized) {
      return;
    }

    this.#termNormalized = termNormalized;

    if (termNormalized.length < this.minLength) {
      this.results = [];
      return;
    }

    const data = await this.#getData();
    this.results = data
      .filter(t => normalizeText(t.label)
        .toLowerCase()
        .includes(termNormalized));
    this.results = this.results.slice(0, this.limit || this.results.length);
  }

  async #getData(): Promise<Data[]> {
    if (!this.source) {
      return [];
    }

    let values: any[]

    if (this.source instanceof Array) {
      values = this.source;
    } else {
      const source = this.source as (() => Promise<any[]>);
      values = await source();
    }

    return values
      .map(source => ({
        label: this.formatter
          ? this.formatter(source)
          : source.toString(),
        value: source
      }));
  }

  #setValueOnTarget() {
    if (!this.target) {
      return;
    }

    const value = this.formatter
      ? this.formatter(this.value)
      : this.value;

    this.target.value = value;

    this.#termNormalized = normalizeText(value)?.toLowerCase();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-typeahead': UmTypeahead;
  }
}
