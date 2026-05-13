import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'docs-dummy',
  imports: [
    DatePipe
  ],
  templateUrl: './dummy.component.html',
  styleUrl: './dummy.component.scss'
})
export class DummyComponent {
  date: Date | null = null;
}
