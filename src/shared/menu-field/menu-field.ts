import { UmMenuItem } from '../../menu/menu-item.js';
import { UmMenu } from '../../menu/menu.js';

export interface UmMenuField {
  menu: UmMenu;
  get menuItems(): UmMenuItem[];
}
