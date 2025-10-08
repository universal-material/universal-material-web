import { PropertyValues } from '@lit/reactive-element';

import { html, HTMLTemplateResult, LitElement, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './snackbar.styles.js';

import '../button/button.js';
import '../button/icon-button.js';

export interface SnackbarConfig {
  message: string;
  duration?: SnackbarDuration;
  action?: string;
  showClose?: boolean;
}

export enum SnackbarDuration {
  short = 2500,
  long = 5000,
  infinite = -1,
}

@customElement('u-snackbar')
export class UmSnackbar extends LitElement {
  static override styles = [baseStyles, styles];
  static minDisplayTime = 1500;

  @property({ reflect: true }) message = '';
  @property({ reflect: true }) action = '';
  @property({ type: Boolean, attribute: 'show-close', reflect: true })
  showClose = false;
  @state() _dismissed = false;
  @state() _canDismiss = false;

  duration!: SnackbarDuration | number;
  @query('.container', true) private readonly container!: HTMLElement;

  override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);

    const onAnimationEnd = () => {
      this.container.removeEventListener('animationend', onAnimationEnd);

      if (UmSnackbar.minDisplayTime > 0) {
        setTimeout(() => this._canDismiss = true, UmSnackbar.minDisplayTime);
      } else {
        this._canDismiss = true;
      }
    };

    this.container.addEventListener('animationend', onAnimationEnd);
  }

  override render(): HTMLTemplateResult {
    const classes = { dismiss: this._dismissed && this._canDismiss };

    if (classes.dismiss) {
      const onAnimationEnd = () => {
        this.container.removeEventListener('animationend', onAnimationEnd);
        this.remove();

        UmSnackbar._showNext();
      };

      this.container.addEventListener('animationend', onAnimationEnd);
    }

    return html`
      <div class="container ${classMap(classes)}" part="container">
        <u-elevation></u-elevation>
        <div class="message-container" part="message-container">
          <div class="message" part="message">${this.message}</div>
        </div>
        ${this.renderButton()} ${this.renderCloseButton()}
      </div>
    `;
  }

  private renderButton() {
    return this.action
      ? html`
          <u-button
            variant="text"
            @click=${this.actionClick.bind(this)}
            part="action"
          >${this.action}
          </u-button>
        `
      : nothing;
  }

  private renderCloseButton() {
    return this.showClose
      ? html`
          <u-icon-button
            @click=${this.dismiss.bind(this)}
            part="close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 -960 960 960"
              width="1em"
              fill="currentColor">
              <path
                d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </u-icon-button>
        `
      : nothing;
  }

  actionClick(e: Event): void {
    e.stopPropagation();

    const actionClickEvent = new CustomEvent('actionClick', { cancelable: true });

    this.dispatchEvent(actionClickEvent);

    if (actionClickEvent.defaultPrevented) {
      return;
    }

    this.dismiss();
  }

  dismiss(): void {
    if (this._dismissed) {
      return;
    }

    this._dismissed = true;
  }

  private static _queue: UmSnackbar[] = [];
  private static _lastEnqueued: UmSnackbar | null = null;
  private static _consuming: boolean;

  static show(message: string): UmSnackbar;
  static show(config: SnackbarConfig): UmSnackbar;
  static show(configOrMessage: SnackbarConfig | string): UmSnackbar {
    if (typeof configOrMessage === 'string') {
      configOrMessage = {
        message: configOrMessage,
      };
    }

    configOrMessage.duration ??= SnackbarDuration.long;

    const snackbar = this.createSnackbar(configOrMessage);
    UmSnackbar._queue.push(snackbar);

    UmSnackbar._lastEnqueued?.dismiss();
    UmSnackbar._lastEnqueued = snackbar;

    if (!UmSnackbar._consuming) {
      UmSnackbar._consumeQueue();
    }

    return snackbar;
  }

  private static _consumeQueue() {
    if (UmSnackbar._queue.length) {
      UmSnackbar._consuming = true;
      UmSnackbar._showNext();
    }
  }

  private static _showNext() {
    if (!UmSnackbar._queue.length) {
      UmSnackbar._consuming = false;
      UmSnackbar._lastEnqueued = null;
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
    const snackbar = document.createElement('u-snackbar');
    snackbar.message = config.message;
    snackbar.action = config.action || '';
    snackbar.showClose = config.showClose!;
    snackbar.duration = config.duration!;

    return snackbar as unknown as UmSnackbar;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-snackbar': UmSnackbar;
  }
}
