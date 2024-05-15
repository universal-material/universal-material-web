import { MenuFieldNavigationController } from '../shared/menu-field/menu-field-navigation-controller.js';
import { UmSelect } from './select.js';

export class SelectNavigationController extends MenuFieldNavigationController<UmSelect> {
  protected override handleKeyDown(event: KeyboardEvent) {
    if (this.host.menu.open) {
      super.handleKeyDown(event);
      return;
    }

    const isDown = event.key === 'ArrowDown';
    const isUp = event.key === 'ArrowUp';

    if (!isDown && !isUp) {
      return;
    }

    event.preventDefault();
    this.host.menu.show();
  }
}
