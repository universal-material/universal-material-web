import { PropertyValues } from '@lit/reactive-element';
import { html, HTMLTemplateResult, LitElement, nothing } from 'lit';
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js';

import { styles } from './top-app-bar.styles.js';

import { styles as baseStyles } from '../shared/base.styles';

@customElement('u-top-app-bar')
export class UmTopAppBar extends LitElement {
  static override styles = [baseStyles, styles];

  /**
   * Whether the app bar has leading icon or not
   *
   * _Note:_ Readonly
   */
  @property({ type: Boolean, attribute: 'has-leading-icon', reflect: true })
  hasLeadingIcon = false;

  /**
   * Whether the app bar has trailing icon or not
   *
   * _Note:_ Readonly
   */
  @property({ type: Boolean, attribute: 'has-trailing-icon', reflect: true })
  hasTrailingIcon = false;

  @property({ reflect: true })
  position: 'fixed' | 'absolute' | 'static' = 'fixed';

  @property({ reflect: true })
  size: 'small' | 'medium' | 'large' = 'small';

  @property() headline: string = '';

  @property({ reflect: true })
  get scrollContainer(): 'none' | 'window' | string | undefined {
    return this.attributes.getNamedItem('scrollContainer')?.value;
  }
  set scrollContainer(idOrElement: string | HTMLElement | undefined) {
    this.scrollContainerElement?.removeEventListener('scroll', this.#updateScroll);

    if (idOrElement === 'none') {
      return;
    }

    this.scrollContainerElement = this.getScrollContainer(idOrElement)!;
    this.scrollContainerElement?.addEventListener('scroll', this.#updateScroll);
  }

  @property({ type: Boolean, attribute: 'container-scrolled', reflect: true })
  containerScrolled: boolean = false;

  @queryAssignedElements({ slot: 'leading-icon', flatten: true })
  private readonly assignedLeadingIcons!: HTMLElement[];

  @queryAssignedElements({ slot: 'trailing-icon', flatten: true })
  private readonly assignedTrailingIcons!: HTMLElement[];

  @query('.container', true) private _container!: HTMLElement;
  @query('.extended-content') private _extendedContent!: HTMLElement;
  @query('.headline') private _headlineElement!: HTMLElement;

  private containerSizeObserver: ResizeObserver | null = null;

  private scrollContainerElement: {
    addEventListener: typeof window.addEventListener;
    removeEventListener: typeof window.removeEventListener;
  } | null = null;

  private getScrollContainer(idOrElement: string | HTMLElement | undefined):
    | {
        addEventListener: typeof window.addEventListener;
        removeEventListener: typeof window.removeEventListener;
      }
    | undefined {
    if (idOrElement instanceof HTMLElement) {
      return idOrElement;
    }

    if (idOrElement === 'window') {
      return window;
    }

    return document.getElementById(idOrElement!)!;
  }

  private handleLeadingIconSlotChange() {
    this.hasLeadingIcon = this.assignedLeadingIcons.length > 0;
  }

  private handleTrailingIconSlotChange() {
    this.hasTrailingIcon = this.assignedTrailingIcons.length > 0;
  }

  override render(): HTMLTemplateResult {
    const extendedContent = html`
      <div class="extended-content" part="extended-content">
        <slot name="extended-content">${this.headline}</slot>
      </div>
    `;

    return html`
      <div class="container" part="container">
        <div class="content" part="content">
          <div class="icon leading-icon">
            <slot name="leading-icon" @slotchange="${this.handleLeadingIconSlotChange}"></slot>
          </div>
          <div class="headline">
            <slot>
              <span>${this.headline}</span>
            </slot>
          </div>

          <div class="icon trailing-icon">
            <slot name="trailing-icon" @slotchange="${this.handleTrailingIconSlotChange}"></slot>
          </div>
        </div>
        <slot name="additional-content"></slot>
      </div>
      ${this.size !== 'small' ? extendedContent : nothing}
    `;
  }

  protected override updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);
    this.#updateScroll();
  }

  override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    this.containerSizeObserver = new ResizeObserver(() => this.setContentHeightProperty());
    this.containerSizeObserver.observe(this._container);
    this.setContentHeightProperty();
  }

  override connectedCallback() {
    super.connectedCallback();

    this.scrollContainer = this.scrollContainer || 'window';
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    this.containerSizeObserver!.disconnect();
    this.containerSizeObserver = null;
  }

  #updateScroll = () => {
    const container = this.scrollContainerElement ?? window;

    const extendedContentHeight = Math.max(this._extendedContent?.offsetHeight ?? 0, 0);

    const scrollTop = UmTopAppBar.getScrollTop(container as any);

    this.containerScrolled = scrollTop > extendedContentHeight;

    this._headlineElement.style.opacity = scrollTop >= extendedContentHeight ? '1' : '0';

    if (extendedContentHeight === 0) {
      return;
    }

    const scrollOffset = this._extendedContent.offsetHeight * 0.7;

    if (scrollTop > scrollOffset) {
      this._extendedContent.style.opacity = '0';
      return;
    }

    this._extendedContent.style.opacity = 1 - scrollTop / scrollOffset + '';
  };

  private static getScrollTop(container: HTMLElement & Window): number {
    if (typeof container.scrollY === 'number') {
      return container.scrollY;
    }

    if (typeof container.scrollTop === 'number') {
      return container.scrollTop;
    }

    return document.body.scrollTop;
  }

  private setContentHeightProperty() {
    this.style.setProperty('--_content-height', `${this._container.clientHeight}px`);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-top-app-bar': UmTopAppBar;
  }
}
