import { Highlight } from 'ngx-highlightjs';
import { MarkdownModule } from 'ngx-markdown';
import { Component, TemplateRef, ViewChild } from '@angular/core';

import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

@Component({
  selector: 'docs-introduction',
  standalone: true,
  imports: [MarkdownModule, Highlight, ExampleComponent, TitleComponent],
  templateUrl: './introduction.component.pug',
  styleUrl: './introduction.component.scss',
})
export class IntroductionComponent {
  importText =
    'Import element definitions from `@universal-material/web/<component>/<component>.js`.';

  importCode = `
// index.js
import '@universal-material/web/button/button.js';
import '@universal-material/web/button/icon-button.js';
import '@universal-material/web/checkbox/checkbox.js';
`.trim();

  usageCode = `
<script type="module" src="./index.js"></script>

<label>
  <u-checkbox checked></u-checkbox>
  I agree
</label>

<u-button-set>
  <u-button variant="outlined">Back</u-button>
  <u-button>Next</u-button>
</u-button-set>
`.trim();
}
