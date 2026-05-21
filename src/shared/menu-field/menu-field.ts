import { MenuItem } from '../../menu/menu-item.js';
import { Menu } from '../../menu/menu.js';

export interface MenuField {
  _menu: Menu;
  get _menuItems(): MenuItem[];
}
