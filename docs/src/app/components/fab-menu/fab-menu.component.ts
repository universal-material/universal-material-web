import { Component } from '@angular/core';
import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'docs-fab-menu',
  templateUrl: './fab-menu.component.html',
  styleUrl: './fab-menu.component.scss',
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent,
    MarkdownComponent,
  ],
})
export class FabMenuComponent {
  example = `
<u-fab-menu size="large">
  <span
    class="material-symbols-outlined"
    slot="icon">
    reply
  </span>
  <u-fab-menu-item label="Reply">
    <span class="material-symbols-outlined">reply</span>
  </u-fab-menu-item>
  <u-fab-menu-item label="Reply all">
    <span class="material-symbols-outlined">reply_all</span>
  </u-fab-menu-item>
  <u-fab-menu-item label="Forward"></u-fab-menu-item>
</u-fab-menu>
`.trim();
}
