import { PropertyValues } from '@lit/reactive-element';
import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './dialog.styles.js';

import { ConfirmDialogBuilder } from './confirm-dialog-builder.js';
import { MessageDialogBuilder } from './message-dialog-builder.js';

import '../elevation/elevation.js';

const topDividerClass = 'top-divider';
const bottomDividerClass = 'bottom-divider';

@customElement('u-dialog')
export class UmDialog extends LitElement {
  static override styles = [baseStyles, styles];

  #open = false;
  #contentResizeObserver!: ResizeObserver | null;

  @property({type: Boolean})
  get open(): boolean {
    return this.#open;
  }
  set open(open: boolean) {
    if (this.#open === open) {
      return;
    }

    if (!open) {
      this.close();
      return;
    }

    this.show();
  }

  get returnValue() {
    return this.dialog.returnValue;
  }

  /**
   * Whether dialog has headline or not
   *
   * _Note:_ Readonly
   */
  @property({type: Boolean, attribute: 'has-headline', reflect: true}) hasHeadline = false;

  /**
   * Whether dialog has icon
   *
   * _Note:_ Readonly
   */
  @property({type: Boolean, attribute: 'has-icon', reflect: true}) hasIcon = false;

  @query('dialog') dialog!: HTMLDialogElement;
  @query('.scrim') scrim!: HTMLElement;
  @query('.content') content!: HTMLElement;
  @query('.container') container!: HTMLElement;

  @queryAssignedElements({slot: 'headline', flatten: true})
  private readonly assignedHeadlines!: HTMLElement[];

  @queryAssignedElements({slot: 'icon', flatten: true})
  private readonly assignedIcons!: HTMLElement[];

  static message(message: string): MessageDialogBuilder {
    return MessageDialogBuilder.create(message);
  }

  static confirm(message: string): ConfirmDialogBuilder {
    return ConfirmDialogBuilder.create(message);
  }

  override render(): HTMLTemplateResult {
    return html`
      <dialog>
        <div class="scrim" @click=${this.#handleScrimClick}></div>
        <div class="container" part="container">
          <u-elevation></u-elevation>
          <div class="icon" part="icon">
            <slot
              name="icon"
              @slotchange=${this.#handleIconSlotChange}>
            </slot>
          </div>
          <div class="headline" part="headline">
            <slot
              name="headline"
              @slotchange=${this.#handleHeadlineSlotChange}>
            </slot>
          </div>
          <div
            class="content"
            part="content"
            @scroll=${this.#handleScroll}>
            <slot></slot>
          </div>
          <div class="actions" part="actions">
            <slot name="actions"></slot>
          </div>
        </div>
      </dialog>`;
  }

  override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);

    this.dialog.addEventListener('cancel', this.#handleCancel)
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('submit', this.#handleSubmit);

    setTimeout(() => {
      this.#contentResizeObserver = new ResizeObserver(() => this.#setScrollDividers())
      this.#contentResizeObserver.observe(this.content);
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('submit', this.#handleSubmit);

    this.#contentResizeObserver!.disconnect();
    this.#contentResizeObserver = null;
  }

  #handleSubmit(event: SubmitEvent) {
    const form = event.target as HTMLFormElement;
    const {submitter} = event;

    if (form.method !== 'dialog' || !submitter) {
      return;
    }

    this.close(submitter.getAttribute('value') ?? this.returnValue);
  }

  #handleCancel = (e: Event) => {
    e.preventDefault();

    const cancelPrevented = !this.dispatchEvent(new Event('cancel', {cancelable: true}));

    if (cancelPrevented) {
      return;
    }

    this.close();
  }

  #handleIconSlotChange() {
    this.hasIcon = this.assignedIcons.length > 0;
  }

  #handleHeadlineSlotChange() {
    this.hasHeadline = this.assignedHeadlines.length > 0;
  }

  #handleScroll() {
    this.#setScrollDividers();
  }

  #setScrollDividers() {
    this.#setTopScrollDivider();
    this.#setBottomScrollDivider();
  }

  #setBottomScrollDivider() {
    const scrollBottom = this.content.scrollTop + this.content.offsetHeight;

    if (scrollBottom >= this.content.scrollHeight) {
      this.content.classList.remove(bottomDividerClass);
      return;
    }
 
    this.content.classList.add(bottomDividerClass);
  }

  #setTopScrollDivider() {
    if (this.content.scrollTop) {
      this.content.classList.add(topDividerClass);
      return;
    }
 
    this.content.classList.remove(topDividerClass);
  }

  async show() {
    this.#open = true;
    this.setAttribute('open', '');

    await this.updateComplete;
    this.dialog.showModal();
    const autoFocusElement = this.querySelector<HTMLElement>('[autofocus]');
    autoFocusElement?.focus();
    this.content.scrollTop = 0;
  }

  async close(returnValue: string = this.returnValue) {
    this.#open = false;
    this.removeAttribute('open');

    await this.updateComplete;

    if (!this.dialog.open || this.open) {
      return;
    }

    const preventClose = !this.dispatchEvent(new Event('close', {cancelable: true}));

    if (preventClose) {
      this.#open = true;
      return;
    }

    this.open = false;

    const closed = new Promise<void>(resolve =>
      this.container.addEventListener(
        'animationend',
        () => {
          resolve();
          this.classList.remove('closing');
          this.dialog.close(returnValue);
          this.dispatchEvent(new Event('closed'));
        },
        {capture: true, once: true},
      )
    );

    this.classList.add('closing');
    await closed;
  }

  #handleScrimClick() {
    const cancelPrevented = !this.dispatchEvent(new Event('cancel', {cancelable: true}));

    if (cancelPrevented) {
      return;
    }

    this.close();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-dialog': UmDialog;
  }
}
