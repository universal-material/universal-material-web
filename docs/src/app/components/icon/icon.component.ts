import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';

import usageHtml from './examples/usage.html';
import sizesHtml from './examples/sizes.html';
import svgHtml from './examples/svg.html';

@Component({
  selector: 'docs-icon',
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  standalone: true,
  imports: [
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ]
})
export class IconComponent {
  usageHtml = usageHtml;
  sizesHtml = sizesHtml;
  svgHtml = svgHtml;
}
