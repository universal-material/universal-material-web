import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UmSnackbar, SnackbarDuration } from '@universal-material/web';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import exampleHtml from './examples/example.html';

@Component({
  selector: 'docs-snackbars',
  templateUrl: './snackbars.component.html',
  styleUrl: './snackbars.component.scss',
  standalone: true,
  imports: [
    ExampleComponent,
    TitleComponent,
    FormsModule
  ]
})
export class SnackbarsComponent {
  exampleHtml = exampleHtml;
  message = '';
  action = '';

  constructor() {
    const snackbar = UmSnackbar.show({
      message: 'Nam gravida sem sem, ac elementum nulla sagittis sed. Duis posuere enim vitae aliquet iaculis. Morbi vulputate egestas massa',
      action: 'Longer action',
      duration: SnackbarDuration.infinite
    });

    snackbar.addEventListener('actionClick', (event) => {
      snackbar.message += '1';
      snackbar.action += '1';
      // event.preventDefault();
    })
  }

  showSnackbar(): void {
    UmSnackbar.show({
      message: this.message,
      action: this.action,
      duration: SnackbarDuration.infinite,
      showClose: true
    })
  }
}
