import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'docs-scaffold-with-top-bar-screen',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './scaffold-with-top-bar.component.html',
  styleUrl: './scaffold-with-top-bar.component.scss',
})
export class ScaffoldWithTopBarScreenComponent {
}
