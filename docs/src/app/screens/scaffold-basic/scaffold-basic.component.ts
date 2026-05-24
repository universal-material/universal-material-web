import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'docs-scaffold-basic-screen',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './scaffold-basic.component.html',
  styleUrl: './scaffold-basic.component.scss',
})
export class ScaffoldBasicScreenComponent {
}
