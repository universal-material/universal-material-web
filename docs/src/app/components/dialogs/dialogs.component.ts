import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import { Dialog } from '@universal-material/web';

import basicHtml from './examples/basic.html';
import confirmHtml from './examples/confirm.html';
import formHtml from './examples/form.html';
import messageHtml from './examples/message.html';
import scrollableHtml from './examples/scrollable.html';

@Component({
  selector: 'docs-dialogs',
  templateUrl: './dialogs.component.html',
  styleUrl: './dialogs.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    ApisTableComponent,
    ExampleComponent,
    TitleComponent,
  ],
})
export class DialogsComponent {
  basicHtml = basicHtml;
  confirmHtml = confirmHtml;
  formHtml = formHtml;
  messageHtml = messageHtml;
  scrollableHtml = scrollableHtml;

  messageText = 'Your changes have been saved.';
  confirmText = 'This action cannot be undone. Continue?';
  confirmResult: boolean | null = null;

  // The confirm dialog's promise resolves from an animation-end callback that
  // runs outside Angular's zone, so the template binding wouldn't update.
  // We nudge change detection ourselves once the result is in.
  readonly #cdr = inject(ChangeDetectorRef);

  showMessage(): void {
    Dialog
      .message(this.messageText)
      .headline('Saved')
      .acknowledgeButton({ label: 'Got it', variant: 'filled' })
      .show();
  }

  async askConfirm(): Promise<void> {
    this.confirmResult = await Dialog
      .confirm(this.confirmText)
      .headline('Delete item')
      .confirmButton({ label: 'Delete', variant: 'filled', color: 'error' })
      .cancelButton({ label: 'Keep it' })
      .show();

    this.#cdr.detectChanges();
  }
}
