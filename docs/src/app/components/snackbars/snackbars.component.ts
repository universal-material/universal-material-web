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
    ApisTableComponent,
    ExampleComponent,
    TitleComponent,
    FormsModule
  ]
})
export class SnackbarsComponent {
  exampleHtml = exampleHtml;
  message = 'File saved';
  action = 'Undo';

  showSnackbar(): void {
    UmSnackbar.show({
      message: this.message,
      action: this.action,
      duration: SnackbarDuration.long,
      showClose: true
    });
  }
}
