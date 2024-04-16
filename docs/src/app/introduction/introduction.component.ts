import { Component } from '@angular/core';
import { Highlight } from 'ngx-highlightjs';

import { TitleComponent } from '../docs/title/title.component';

@Component({
  selector: 'docs-introduction',
  standalone: true,
  imports: [
    TitleComponent,
    Highlight
  ],
  templateUrl: './introduction.component.pug',
  styleUrl: './introduction.component.scss'
})
export class IntroductionComponent {

}
