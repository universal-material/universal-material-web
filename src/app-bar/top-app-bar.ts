import { PropertyValues } from '@lit/reactive-element';

import { html, HTMLTemplateResult, LitElement, nothing } from 'lit';
import { customElement, property, query, queryAssignedElements, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { styles as baseStyles } from '../shared/base.styles';
import { styles } from './top-app-bar.styles.js';

@customElement('u-top-app-bar')
export class UmTopAppBar extends LitElement {
  static override styles = [baseStyles, styles];

  @state() private _hasLeadingIcon = false;
  @state() private _hasTrailingIcon = false;

  @property({ reflect: true })
  position: 'fixed' | 'absolute' | 'static' = 'fixed';

  @property({ reflect: true })
  size: 'small' | 'medium' | 'large' = 'small';

  @property() headline = '';

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

  @state() containerScrolled = false;

  @queryAssignedElements({ slot: 'leading-icon', flatten: true })
  private readonly assignedLeadingIcons!: HTMLElement[];

  @queryAssignedElements({ slot: 'trailing-icon', flatten: true })
  private readonly assignedTrailingIcons!: HTMLElement[];

  @query('.container', true) private readonly _container!: HTMLElement;
  @query('.extended-content') private readonly _extendedContent!: HTMLElement;
  @query('.headline') private readonly _headlineElement!: HTMLElement;

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

  #handleLeadingIconSlotChange() {
    this._hasLeadingIcon = this.assignedLeadingIcons.length > 0;
  }

  #handleTrailingIconSlotChange() {
    this._hasTrailingIcon = this.assignedTrailingIcons.length > 0;
  }

  override render(): HTMLTemplateResult {
    const extendedContent = html`
      <div class="extended-content" part="extended-content">
        <slot name="extended-content">${this.headline}</slot>
      </div>
    `;

    const containerClasses = classMap({
      [this.position]: true,
      [this.size]: true,
      scrolled: this.containerScrolled,
      'has-leading-icon': this._hasLeadingIcon,
      'has-trailing-icon': this._hasTrailingIcon,
    });

    const appBarSpacing = this.position !== 'static'
      ? html`<div class="spacing"></div>`
      : nothing;

    return html`
      ${appBarSpacing}
      <div class="container ${containerClasses}" part="container">
        <div class="content" part="content">
          <div class="icon leading-icon" part="icon leading">
            <slot name="leading-icon" @slotchange="${this.#handleLeadingIconSlotChange}"></slot>
          </div>
          <div class="headline" part="headline">
            <slot>
              <span>${this.headline}</span>
            </slot>
          </div>

          <div class="icon trailing-icon" part="icon trailing">
            <slot name="trailing-icon" @slotchange="${this.#handleTrailingIconSlotChange}"></slot>
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
    this.containerSizeObserver = new ResizeObserver(() => this.#setContentHeightProperty());
    this.containerSizeObserver.observe(this._container);
    this.#setContentHeightProperty();
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

  readonly #updateScroll = () => {
    const container = this.scrollContainerElement ?? window;

    const extendedContentHeight = Math.max(this._extendedContent?.offsetHeight ?? 0, 0);

    const scrollTop = UmTopAppBar._getScrollTop(container as any);

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

  private static _getScrollTop(container: HTMLElement & Window): number {
    if (typeof container.scrollY === 'number') {
      return container.scrollY;
    }

    if (typeof container.scrollTop === 'number') {
      return container.scrollTop;
    }

    return document.body.scrollTop;
  }

  #setContentHeightProperty() {
    this.style.setProperty('--_content-height', `${this._container.clientHeight}px`);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-top-app-bar': UmTopAppBar;
  }
}
