import { Component, Input, SecurityContext } from '@angular/core';
import { Highlight } from 'ngx-highlightjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'docs-example',
  standalone: true,
  imports: [
    Highlight
  ],
  templateUrl: './example.component.pug',
  styleUrl: './example.component.scss'
})
export class ExampleComponent {
  _htmlSafe!: SafeHtml;
  _html!: string;

  @Input() sectionTitle!: string;
  @Input()
  set html(html: string) {
    this._htmlSafe = this.sanitizer.bypassSecurityTrustHtml(html);
    this._html = html;
  };

  constructor(private readonly sanitizer: DomSanitizer) {
  }
}
