import { css, html, HTMLTemplateResult, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { MixinBase, MixinReturn } from '../mixin.js';
import { UmSelectionControl } from './selection-control.js';

// @ts-ignore
export const mixinSelectionControlListItem = <T extends MixinBase<UmSelectionControl>>(base: T): MixinReturn<T> => {
  // @ts-ignore
  abstract class SelectionControlListItem extends base {
    static styles = [
      (base as unknown as typeof LitElement).styles ?? [],
      css`
        :host {
          --u-list-item-block-padding: 0;
          display: block;
        }

        :host(:not([disabled])) {
          cursor: pointer;
        }
      `,
    ];

    @property({ type: Boolean }) leading = false;

    protected override inputDescribedById = 'description';
    protected override inputLabelledById = 'label';

    override render(): HTMLTemplateResult {
      return html`
        <label>
          <u-list-item ?selectable=${!this.disabled}>
            <div slot="${this.leading ? 'leading' : 'trailing'}">${super.render()}</div>
            <span id="label"><slot></slot></span>
            <span id="description" slot="supporting-text"><slot name="supporting-text"></slot></span>
          </u-list-item>
        </label>
      `;
    }
  }

  return SelectionControlListItem;
};
