import { ButtonVariant } from './button/button.js';
import { DialogButtonDef } from './dialog/dialog-button-def.js';

const _config = {
  dialog: {
    alertDefaults: {
      acknowledgeButton: {
        label: 'Ok',
        variant: 'text' as ButtonVariant,
      } as DialogButtonDef,
    },
    confirmDefaults: {
      confirmButton: {
        label: 'Ok',
        variant: 'text' as ButtonVariant,
      } as DialogButtonDef,
      cancelButton: {
        label: 'Cancel',
        variant: 'text' as ButtonVariant,
      } as DialogButtonDef,
    },
  },
  navigationDrawer: {
    useSwiperJs: false,
  },
};

export const config = _config;
