import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ApisTableComponent } from '@docs/docs/apis-table/apis-table.component';
import { ExampleComponent } from '@docs/docs/example/example.component';
import { TitleComponent } from '@docs/docs/title/title.component';
import { FormsModule } from '@angular/forms';

function getOption(value: string) {
  return {
    label: `Option ${value}`,
    value: value,
    render: true,
    hide: false,
    selected: false,
    selectedAttr: false
  };
}

@Component({
  selector: 'docs-select',
  templateUrl: './select.component.pug',
  styleUrl: './select.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    ApisTableComponent,
    ExampleComponent,
    TitleComponent
  ],
  standalone: true
})
export class SelectComponent {
  options = [
    getOption('A'),
    getOption('B'),
    getOption('C'),
    getOption('D'),
    getOption('E'),
    getOption('F'),
    getOption('G'),
    getOption('H'),
    getOption('I'),
    getOption('J'),
    getOption('K'),
    getOption('L'),
    getOption('M'),
    getOption('N'),
    getOption('O'),
    getOption('P'),
    getOption('Q'),
    getOption('R'),
    getOption('S'),
    getOption('T'),
    getOption('U'),
    getOption('V'),
    getOption('W'),
    getOption('X'),
    getOption('Y'),
    getOption('Z'),
    getOption('A1'),
    getOption('B1'),
    getOption('C1'),
    getOption('D1'),
    getOption('E1'),
    getOption('F1'),
    getOption('G1'),
    getOption('H1'),
    getOption('I1'),
    getOption('J1'),
    getOption('K1'),
    getOption('L1'),
    getOption('M1'),
    getOption('N1'),
    getOption('O1'),
    getOption('P1'),
    getOption('Q1'),
    getOption('R1'),
    getOption('S1'),
    getOption('T1'),
    getOption('U1'),
    getOption('V1'),
    getOption('W1'),
    getOption('X1'),
    getOption('Y1'),
    getOption('Z1'),
  ];
}
