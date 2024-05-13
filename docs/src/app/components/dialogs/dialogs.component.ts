import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

// @ts-ignore
import simpleCardHtml from '!raw-loader!./examples/example.html';
import { UmDialog } from '@universal-material/web';

@Component({
  selector: 'docs-dialogs',
  templateUrl: './dialogs.component.pug',
  styleUrl: './dialogs.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class DialogsComponent {
  simpleCardHtml = simpleCardHtml;
  message = '';

  async showMessage() {
    if (await UmDialog
      .confirm(this.message)
      .headline('Headline')
      .show()) {
      alert('confirme');
    }
  }
}
