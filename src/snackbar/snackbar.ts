import { html, HTMLTemplateResult, LitElement, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './snackbar.styles.js';

export interface SnackbarConfig {
  label: string;
  duration?: SnackbarDuration;
  buttonLabel?: string;
  showClose?: boolean;
}

export enum SnackbarDuration {
  short = 2500,
  long = 5000,
  infinite = -1
}

@customElement('u-snackbar')
export class UmSnackbar extends LitElement {

  static override styles = [
    baseStyles,
    styles
  ];

  @property({reflect: true}) label: string = '';
  @property({reflect: true}) buttonLabel: string = '';
  @property({type: Boolean, attribute: 'show-close', reflect: true}) showClose = false;
  @property({type: Boolean, reflect: true}) dismissed = false;

  private duration!: SnackbarDuration;
  @query('.snackbar') private snackbar!: HTMLElement;

  override render(): HTMLTemplateResult {
    return html`
    <div class="snackbar ${this.dismissed ? 'dismiss' : ''}">
      <div class="label">${this.label}</div>
      ${this.renderButton()}
      ${this.renderCloseButton()}
    </div>`;
  }

  private renderButton() {
    return this.buttonLabel
      ? html`<u-button variant="text">${this.buttonLabel}</u-button>`
      : nothing;
  }

  private renderCloseButton() {
    return this.showClose
      ? html`<u-icon-button><i class="mdi mdi-close">X</i></u-icon-button>`
      : nothing;
  }

  dismiss(): void {
    if (this.dismissed) {
      return;
    }

    this.dismissed = true;

    const onAnimationEnd = () => {
      this.snackbar.removeEventListener('animationend', onAnimationEnd);
      this.remove();

      UmSnackbar.showNext();
    };

    this.snackbar.addEventListener('animationend', onAnimationEnd);
  }

  private static _queue: UmSnackbar[] = [];
  private static _consuming: boolean;

  static show(label: string): UmSnackbar;
  static show(config: SnackbarConfig): UmSnackbar;
  static show(configOrLabel: SnackbarConfig | string): UmSnackbar {

    if (typeof configOrLabel === 'string') {
      configOrLabel = {
        label: configOrLabel
      }
    }

    configOrLabel.duration ??= SnackbarDuration.short;

    const snackbar = this.createSnackbar(<SnackbarConfig>configOrLabel);
    UmSnackbar._queue.push(snackbar);

    if (!UmSnackbar._consuming) {
      UmSnackbar.consumeQueue();
    }

    return snackbar;
  }

  private static consumeQueue() {

    if (UmSnackbar._queue.length) {
      UmSnackbar._consuming = true;
      UmSnackbar.showNext();
    }
  }

  private static showNext() {
    if (!UmSnackbar._queue.length) {
      UmSnackbar._consuming = false;
      return;
    }
 
    const snackbar = UmSnackbar._queue[0];

    UmSnackbar._queue = UmSnackbar._queue.slice(1);

    document.body.appendChild(snackbar);

    if (snackbar.duration === -1) {
      return;
    }

    setTimeout(() => snackbar.dismiss(), snackbar.duration);
  }

  private static createSnackbar(config: SnackbarConfig): UmSnackbar {
    const snackbar = document.createElement("u-snackbar");
    snackbar.label = config.label;
    snackbar.buttonLabel = config.buttonLabel!;
    snackbar.showClose = config.showClose!;
    snackbar.duration = config.duration!;

    return snackbar;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-snackbar': UmSnackbar;
  }
}