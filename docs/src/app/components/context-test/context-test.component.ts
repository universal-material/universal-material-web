import { Component, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UmField } from '@universal-material/web';

@Component({
  selector: 'docs-context-test',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './context-test.component.pug',
  styleUrl: './context-test.component.scss'
})
export class ContextTestComponent {
  value = 'fritas';

  constructor(elementRef: ElementRef<HTMLElement>) {
    const variant = elementRef.nativeElement.getAttribute('variant');
    if (!variant) {
      return;
    }

    console.log(UmField.setDefaults(elementRef.nativeElement, {
      variant: variant as any
    }));
  }
}
