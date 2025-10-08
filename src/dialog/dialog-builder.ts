import DOMPurify from 'dompurify';

import { DialogButtonDef } from './dialog-button-def.js';
import { UmDialog } from './dialog.js';

import './dialog.js';

export abstract class DialogBuilder<TBuilder extends DialogBuilder<any, any>, TReturn> {
  #headline?: string;

  constructor(private readonly message: string) {

  }

  headline(headline: string): TBuilder {
    this.#headline = headline;
    return this as unknown as TBuilder;
  }

  show(): TReturn {
    const dialog = document.createElement('u-dialog');
    dialog.innerHTML = DOMPurify.sanitize(this.message);

    this._addHeadline(dialog);
    this._addButtons(dialog);

    return this.innerShow(dialog) as TReturn;
  }

  protected innerShow(dialog: UmDialog): TReturn | void {
    dialog.addEventListener('closed', () => dialog.remove());
    document.body.appendChild(dialog);
    dialog.show();

    return;
  }

  protected abstract _addButtons(dialog: UmDialog): void;

  private _addHeadline(dialog: HTMLElement) {
    if (!this.#headline) {
      return;
    }

    const headlineElement = document.createElement('span');
    headlineElement.slot = 'headline';
    headlineElement.innerHTML = DOMPurify.sanitize(this.#headline);
    dialog.appendChild(headlineElement);
  }

  protected _addButton(dialog: UmDialog, buttonDef: DialogButtonDef, click: () => void) {
    const button = document.createElement('u-button');
    button.variant = buttonDef.variant!;
    button.color = buttonDef.color!;
    button.textContent = buttonDef.label!;
    button.slot = 'actions';
    button.addEventListener('click', click);
    dialog.appendChild(button);
  }
}
