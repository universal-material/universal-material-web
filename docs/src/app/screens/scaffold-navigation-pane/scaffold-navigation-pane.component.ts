import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'docs-scaffold-navigation-pane-screen',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './scaffold-navigation-pane.component.html',
  styleUrl: './scaffold-navigation-pane.component.scss',
})
export class ScaffoldNavigationPaneScreenComponent {
}
