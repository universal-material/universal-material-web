import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ThemeService } from '@docs/docs/shared/theme.service';

@Component({
  selector: 'docs-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {
  constructor(theme: ThemeService) {
    theme.initialize();
  }
}
