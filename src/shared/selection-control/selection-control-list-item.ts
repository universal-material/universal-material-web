import { css, html, HTMLTemplateResult, LitElement } from 'lit';

import { UmSelectionControl } from './selection-control.js';

export type MixinBase<ExpectedBase = object> = abstract new (
  // Mixins must have a constructor with `...args: any[]`
  // @ts-ignore
  ...args: any[]
) => ExpectedBase;

export type MixinReturn<MixinBase, MixinClass = object> =
// Mixins must have a constructor with `...args: any[]`
// tslint:disable-next-line:no-any
  (abstract new (...args: any[]) => MixinClass) & MixinBase;

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
            <label for="input"><slot></slot></label>
            <div slot="trailing">
              ${super.render()}
            </div>
          </u-list-item>`;
    }
  }

  return SelectionControlListItem;
}
