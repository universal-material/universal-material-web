import { config } from '../config.js';
import { DialogBuilder } from './dialog-builder.js';
import { DialogButtonDef } from './dialog-button-def.js';
import { Dialog } from './dialog.js';

export class MessageDialogBuilder extends DialogBuilder<MessageDialogBuilder, void> {
  static create(message: string): MessageDialogBuilder {
    return new MessageDialogBuilder(message);
  }

  #acknowledgeButtonDef?: DialogButtonDef;

  acknowledgeButton(acknowledgeButtonDef: DialogButtonDef): MessageDialogBuilder {
    this.#acknowledgeButtonDef = acknowledgeButtonDef;
    return this;
  }

  override _addButtons(dialog: Dialog): void {

    this._addButton(
      dialog,
      { ...config.dialog.alertDefaults.acknowledgeButton, ...this.#acknowledgeButtonDef },
      () => dialog.close());
  }
}
