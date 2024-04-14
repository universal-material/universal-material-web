import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export type UmSpacingSizes = 'none' | 'small' | 'medium ' | 'large' | 'extra-large';

export abstract class GridBase extends LitElement {

  @property({reflect: true}) margin: UmSpacingSizes | undefined;
  @property({attribute: 'margin-sm', reflect: true}) marginSmall: UmSpacingSizes | undefined;
  @property({attribute: 'margin-md', reflect: true}) marginMedium: UmSpacingSizes | undefined;
  @property({attribute: 'margin-lg', reflect: true}) marginLarge: UmSpacingSizes | undefined;
  @property({attribute: 'margin-xl', reflect: true}) marginExtraLarge: UmSpacingSizes | undefined;
  @property({attribute: 'full-width', reflect: true, type: Boolean}) fullWidth = false;
}
