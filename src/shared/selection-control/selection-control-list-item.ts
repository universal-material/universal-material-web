import { css, html, HTMLTemplateResult, LitElement } from 'lit';

import { MixinBase, MixinReturn } from '../mixin.js';
import { UmSelectionControl } from './selection-control.js';

// @ts-ignore
export const mixinSelectionControlListItem = <T extends MixinBase<UmSelectionControl>>(base: T): MixinReturn<T> => {
  // @ts-ignore
  abstract class SelectionControlListItem extends base {
    static styles = [
      (base as unknown as typeof LitElement).styles ?? [],
      css`:host {
        --u-list-item-block-padding: 0;
        display: block;
      }`
    ];

    override render(): HTMLTemplateResult {
      return html`
          <u-list-item ?selectable=${!this.disabled}>
            <div slot="trailing">${super.render()}</div>
            <label for="input"><slot></slot></label>
            <slot name="supporting-text" slot="supporting-text"></slot>
          </u-list-item>`;
    }
  }

  return SelectionControlListItem;
}
