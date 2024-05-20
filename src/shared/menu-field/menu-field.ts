import { UmMenuItem } from '../../menu/menu-item.js';
import { UmMenu } from '../../menu/menu.js';

export interface UmMenuField {
  _menu: UmMenu;
  get _menuItems(): UmMenuItem[];
}
