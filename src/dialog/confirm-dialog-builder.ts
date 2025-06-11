import { config } from '../config.js';
import { DialogBuilder } from './dialog-builder.js';
import { DialogButtonDef } from './dialog-button-def.js';
import { UmDialog } from './dialog.js';

export class ConfirmDialogBuilder extends DialogBuilder<ConfirmDialogBuilder, Promise<boolean>> {
  static create(message: string): ConfirmDialogBuilder {
    return new ConfirmDialogBuilder(message);
  }

  #confirmButtonDef?: DialogButtonDef;
  #cancelButtonDef?: DialogButtonDef;

  confirmButton(confirmButtonDef: DialogButtonDef): ConfirmDialogBuilder {
    this.#confirmButtonDef = confirmButtonDef;
    return this;
  }

  cancelButton(cancelButtonDef: DialogButtonDef): ConfirmDialogBuilder {
    this.#cancelButtonDef = cancelButtonDef;
    return this;
  }

  override addButtons(dialog: UmDialog): void {

    this.addButton(
      dialog,
      { ...config.dialog.confirmDefaults.confirmButton, ...this.#confirmButtonDef },
      () => dialog.close('ok'));

    this.addButton(
      dialog,
      { ...config.dialog.confirmDefaults.cancelButton, ...this.#cancelButtonDef },
      () => dialog.close('cancel'));
  }

  protected override innerShow(dialog: UmDialog): Promise<boolean> {
    super.innerShow(dialog);

    return new Promise<boolean>(resolve =>
      dialog.addEventListener('closed', () => resolve(dialog.returnValue === 'ok')));
  }
}
