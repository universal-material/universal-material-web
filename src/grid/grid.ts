import { PropertyValues } from '@lit/reactive-element';

import { html, HTMLTemplateResult, LitElement, nothing } from 'lit';
import { styleMap } from 'lit-html/directives/style-map.js';
import { customElement, property, query, queryAll, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';

import { DropEvent } from '@interactjs/actions/drop/DropEvent';
import type { InteractEvent } from '@interactjs/core/InteractEvent';
import interact from 'interactjs';

import { styles as baseStyles } from '../shared/base.styles';
import { UmDataGridColumn } from './grid-column';
import { styles } from './grid.styles.js';

import './grid-column.js';

interface GroupRow {
  isGroup: true;
  level: number;
  value: string;
  items: any[];
}

interface DataRow {
  isGroup: false;
  item: any;
}

type Row = GroupRow | DataRow;

@customElement('u-grid')
export class UmDataTable extends LitElement {
  static override styles = [baseStyles, styles];

  #items: any[] = [];

  @property({ type: Array })
  get items(): any[] {
    return this.#items;
  }

  set items(items: any[]) {
    this.#items = items;
    this.#setData();
  }

  readonly #rows: Row[] = [];
  #sortedItems: any[] = [];

  protected _columns: UmDataGridColumn[] = [];
  @state() protected _groupColumns: UmDataGridColumn[] = [];
  @state() protected _regularColumns: UmDataGridColumn[] = [];
  @state() protected _draggableColumns: HTMLElement[] = [];
  @query('#header-group-row', true) private readonly headerGroupRow!: HTMLElement;

  @queryAll('#header-columns-row .header-column') private readonly _headerColumns!: HTMLElement[];

  protected override updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);

    this.#setDragAndDrop();
  }

  override render() {

    return html`
      <div class="container">
        <table class="u-table">
          <thead>
            ${this.#renderHeader()}
            <tr id="header-columns-row">
              ${this._groupColumns.length > 0
                ? html`<th class="group-column-header" colspan="${this._groupColumns.length}"></th>`
                : nothing}
              ${map(this._regularColumns, column =>
                html`<th class="header-column">${column.textContent}</th>`)}
            </tr>
          </thead>
          <tbody>${this.#renderBody()}</tbody>
        </table>
      </div>
      <slot hidden @slotchange=${this.#setColumns}></slot>
    `;
  }

  #renderBody() {

    const columnCount = this._columns.length;

    if (!this.items?.length) {
      return html`
        <tr>
          <td part="cell no-data" colspan="${columnCount}">No data</td>
        </tr>
      `;
    }

    // const columnsSortedByGroupIndex = this._columns.sort((a, b) => (a.groupIndex ?? 999999) - (b.groupIndex ?? 999999));
    // const grouping = Object.entries(Object.groupBy(this._columns, ({ groupIndex }) => groupIndex)) as unknown as [string, UmDataGridColumn[]];

    const groupingCount = this._groupColumns.length;

    return html`
      ${map(this.#rows, row => this.#renderItem(row, groupingCount))}
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.#setColumns();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#releaseDragAndDrop();
    this._columns.length = 0;
    this._groupColumns.length = 0;
    this._regularColumns.length = 0;
  }

  #renderItem(row: Row, groupingCount: number) {
    console.log(row);
    return row.isGroup
      ? this.#renderGroupRow(row)
      : this.#renderDataRow(row, groupingCount);
  }

  #renderDataRow(row: DataRow, groupingCount: number) {
    return html`
      <tr>
        ${this.#renderGroupingSpanColumn(groupingCount)}
        ${map(this._regularColumns, column =>
          html`
            <td>${this.#getValueByPath(row.item, column.path)}</td>`)}
      </tr>
    `;
  }

  #renderGroupingSpanColumn(groupingCount: number) {
    return groupingCount
      ? html`<td colspan="${groupingCount}"></td>`
      : nothing;
  }

  #renderGroupRow(row: GroupRow): HTMLTemplateResult {
    return html`
      <tr>
        ${row.level
          ? html`<td colspan=${row.level}></td>`
          : nothing}
        <td class="group-column-toggle">
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
            <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/>
          </svg>
        </td>
        <td class="grouping-row" colspan="${this._columns.length - (row.level + 1)}">
          ${row.value}
        </td>
      </tr>
    `;
  }

  #getValueByPath(item: any, path: string) {
    return path.split('.').reduce((acc, key) => acc?.[key], item) ?? '';
  }

  #setColumns() {
    this._columns = Array.from(this.querySelectorAll('u-grid-column'));
    this._groupColumns = this._columns
      .filter(c => !!c.groupIndex || c.groupIndex === 0)
      .sort((a, b) => a.groupIndex! - b.groupIndex!);
    this._regularColumns = this._columns.filter(c => !this._groupColumns.includes(c));
    this.#setData();
  }

  #updateSorting(): void {
    if (!this.items?.length) {
      this.#sortedItems = [];
      return;
    }

    if (!this._groupColumns.length) {
      this.#sortedItems = this.items;
      return;
    }

    this.#sortedItems = this.items.sort((a, b) => {

      for (const groupColumn of this._groupColumns) {
        const aValue = this.#getValueByPath(a, groupColumn.path) ?? '';
        const bValue = this.#getValueByPath(b, groupColumn.path) ?? '';

        const textComparison = aValue.toString().localeCompare(bValue.toString());

        if (textComparison !== 0) {
          return textComparison;
        }
      }

      return 0;
    });
  }

  #renderHeader() {
    // if (!this._groupColumns.length) {
    //   return nothing;
    // }

    const headerStyles = {
      display: this._groupColumns.length
        ? ''
        : 'none',
    };

    return html`
      <tr style="${styleMap(headerStyles)}">
        <th colspan="${this._columns.length}">
          <div class="header">
            <u-chip-set id="header-group-row">
              ${map(this._groupColumns, column =>
                html`<u-chip>${column.textContent}</u-chip>`)}
            </u-chip-set>
          </div>
        </th>
      </tr>
    `;
  }

  // #setRegularColumnsOrder() {
  //   for (const i = 0; i < this._regularColumns.length; i++) {
  //     const column = this._regularColumns[i];
  //     column._index = i;
  //   }
  // }
  #releaseDragAndDrop() {
    for (const draggableColumn of this._draggableColumns) {
      interact(draggableColumn).unset();
    }

    this._draggableColumns.length = 0;
  }

  #setDragAndDrop() {
    const position = { x: 0, y: 0 };

    for (const column of this._headerColumns) {

      this._draggableColumns.push(column);
      interact(column).draggable({
        manualStart: true,
        listeners: {
          start: (event: InteractEvent) => {
            position.x = 0;
            position.y = 0;
            const source = event.interactable.target as HTMLElement;
            const target = event.target as HTMLElement;
            const rect = source.getBoundingClientRect();
            target.classList.add('moving-column-header');
            target.style.position = 'fixed';
            target.style.top = rect.top + 'px';
            target.style.left = rect.left + 'px';
            target.style.width = rect.width + 'px';
            target.style.zIndex = '2000';
          },
          move: (event: InteractEvent) => {
            position.x += event.dx;
            position.y += event.dy;

            event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
          },
          end: (event: InteractEvent) => {
            const target = event.target as HTMLElement;
            target.remove();
            console.log('drag end');
          },
        },
      })
        .on('move', (event: InteractEvent) => {
          const interaction = event.interaction;

          // if the pointer was moved while being held down
          // and an interaction hasn't started yet
          if (!(interaction.pointerIsDown && !interaction.interacting())) {
            return;
          }

          const original = event.currentTarget;
          const clone = event.currentTarget.cloneNode(true) as HTMLElement;
          original.parentElement!.appendChild(clone);
          interaction.start({ name: 'drag' }, event.interactable, clone);
        });

      interact(column).dropzone({
        accept: '.header-column',

        ondragenter: (event: DropEvent) => {
          // add active dropzone feedback
          event.target.classList.add('drop-target');
        },

        ondragleave: (event: DropEvent) => {
          // remove active dropzone feedback
          event.target.classList.remove('drop-target');
          event.target.classList.remove('drop-after');
          event.target.classList.remove('drop-before');
        },

        ondropdeactivate: (event: DropEvent) => {
          // remove active dropzone feedback
          event.target.classList.remove('drop-target');
          event.target.classList.remove('drop-after');
          event.target.classList.remove('drop-before');
        },
        ondropmove: (event: DropEvent) => {
          const clientX = event.dragEvent.clientX;

          // Get the drop target's bounding rectangle for its position
          const targetRect = event.target.getBoundingClientRect();

          // Calculate cursor position relative to the drop target's top-left corner
          const cursorXRelativeToTarget = clientX - targetRect.left;
          const relativePosition = cursorXRelativeToTarget / targetRect.width;

          if (relativePosition > 0.5) {
            event.target.classList.remove('drop-before');
            event.target.classList.add('drop-after');
            return;
          }

          event.target.classList.remove('drop-after');
          event.target.classList.add('drop-before');
        },
      });
    }
  }

  #setData() {
    this.#updateSorting();
    this.#setGroups();
  }

  #setGroups() {
    const currentGroups: { value: any; items: any[] }[] = [];

    this.#rows.length = 0;

    for (const item of this.#sortedItems) {
      for (let i = 0; i < this._groupColumns.length; i++) {
        const column = this._groupColumns[i];

        const value = this.#getValueByPath(item, column.path);

        let group = currentGroups[i];

        if (group?.value === value) {
          group.items.push(item);
          continue;
        }

        currentGroups.splice(i, Infinity);
        group = {
          value,
          items: [item],
        };

        const rowValue = `${column.textContent}: ${value}`;

        currentGroups[i] = group;
        this.#rows.push({
          isGroup: true,
          level: i,
          value: rowValue,
          items: group.items,
        });
      }

      this.#rows.push({
        isGroup: false,
        item,
      });
    }

    console.log(this.#rows);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-grid': UmDataTable;
  }
}
