import { css, html, HTMLTemplateResult, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { MixinBase, MixinReturn } from '../mixin.js';
import { SelectionControl } from './selection-control.js';

// @ts-ignore
export const mixinSelectionControlListItem = <T extends MixinBase<SelectionControl>>(base: T): MixinReturn<T> => {
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

    /**
     * Whether to render the selection control before the label.
     * Defaults to a trailing position.
     */
    @property({ type: Boolean }) leading = false;

    /**
     * Pull the row flush with surrounding content (negative inline margin equal
     * to the inline padding) so it aligns with adjacent labels / section headings.
     * Forwarded to the inner `u-list-item`.
     */
    @property({ type: Boolean, attribute: 'no-inset' }) noInset = false;

    protected override inputDescribedById = 'description';
    protected override inputLabelledById = 'label';

    override render(): HTMLTemplateResult {
      return html`
        <label>
          <u-list-item ?selectable=${!this.disabled} ?no-inset=${this.noInset}>
            <div slot="${this.leading ? 'leading-icon' : 'trailing-icon'}">${super.render()}</div>
            <span id="label"><slot></slot></span>
            <span id="description" slot="supporting-text"><slot name="supporting-text"></slot></span>
          </u-list-item>
        </label>
      `;
    }
  }

  return SelectionControlListItem;
};
