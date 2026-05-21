import { consume } from '@lit/context';
import { PropertyValues } from '@lit/reactive-element';

import { html, HTMLTemplateResult, LitElement, nothing } from 'lit';
import { customElement, property, query, queryAssignedElements, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { scrollContainerContext } from '../scaffold/scroll-container-context.js';
import { styles as baseStyles } from '../shared/base.styles.js';
import { styles } from './top-app-bar.styles.js';

type ScrollTarget = {
  addEventListener: typeof window.addEventListener;
  removeEventListener: typeof window.removeEventListener;
};

@customElement('u-top-app-bar')
export class UmTopAppBar extends LitElement {
  static override styles = [baseStyles, styles];

  @state() private _hasLeadingIcon = false;
  @state() private _hasTrailingIcon = false;

  /**
   * The positioning strategy of the app bar
   */
  @property({ reflect: true })
  position: 'fixed' | 'absolute' | 'static' = 'fixed';

  /**
   * The height variant of the app bar
   */
  @property({ reflect: true })
  size: 'small' | 'medium' | 'large' = 'small';

  /**
   * The headline text rendered inside the app bar
   */
  @property() headline = '';

  /**
   * The element to listen for scroll on to collapse the extended content.
   * Accepts an `HTMLElement`, the id of an element, `'window'` to use the
   * window scroll, or `'none'` to disable scroll handling. When unset, the
   * app bar consumes the scroll container provided by an ancestor
   * `u-scaffold`; if there's no scaffold, it falls back to `'window'`.
   */
  @property({ reflect: true })
  get scrollContainer(): 'none' | 'window' | string | undefined {
    return this.attributes.getNamedItem('scrollContainer')?.value;
  }

  set scrollContainer(idOrElement: string | HTMLElement | undefined) {
    this.#explicitScrollContainer = idOrElement;
    this.#resolveScrollContainer();
  }

  @consume({ context: scrollContainerContext, subscribe: true })
  @state()
  private readonly _scrollContainerFromContext!: HTMLElement | undefined;

  @state() containerScrolled = false;

  @queryAssignedElements({ slot: 'leading-icon', flatten: true })
  private readonly assignedLeadingIcons!: HTMLElement[];

  @queryAssignedElements({ slot: 'trailing-icon', flatten: true })
  private readonly assignedTrailingIcons!: HTMLElement[];

  @query('.container', true) private readonly _container!: HTMLElement;
  @query('.extended-content') private readonly _extendedContent!: HTMLElement;
  @query('.headline') private readonly _headlineElement!: HTMLElement;

  private containerSizeObserver: ResizeObserver | null = null;

  #explicitScrollContainer: string | HTMLElement | undefined = undefined;
  private scrollContainerElement: ScrollTarget | null = null;

  #resolveScrollContainer(): void {
    const next = this.#computeScrollTarget();

    if (next === this.scrollContainerElement) {
      return;
    }

    this.scrollContainerElement?.removeEventListener('scroll', this.#updateScroll);
    this.scrollContainerElement = next;
    this.scrollContainerElement?.addEventListener('scroll', this.#updateScroll);
    this.#updateScroll();
  }

  #computeScrollTarget(): ScrollTarget | null {
    const explicit = this.#explicitScrollContainer;

    if (explicit === 'none') {
      return null;
    }

    if (explicit instanceof HTMLElement) {
      return explicit;
    }

    if (typeof explicit === 'string' && explicit.length > 0) {
      if (explicit === 'window') {
        return window;
      }

      return document.getElementById(explicit);
    }

    if (this._scrollContainerFromContext) {
      return this._scrollContainerFromContext;
    }

    return window;
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

  protected override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('_scrollContainerFromContext' as keyof this)) {
      this.#resolveScrollContainer();
    }

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

    const attr = this.attributes.getNamedItem('scrollContainer')?.value;
    if (attr !== undefined && this.#explicitScrollContainer === undefined) {
      this.#explicitScrollContainer = attr;
    }

    this.#resolveScrollContainer();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    this.scrollContainerElement?.removeEventListener('scroll', this.#updateScroll);
    this.scrollContainerElement = null;

    this.containerSizeObserver?.disconnect();
    this.containerSizeObserver = null;
  }

  readonly #updateScroll = () => {
    const container = this.scrollContainerElement ?? window;

    const extendedContentHeight = Math.max(this._extendedContent?.offsetHeight ?? 0, 0);

    const scrollTop = UmTopAppBar._getScrollTop(container as any);

    this.containerScrolled = scrollTop > extendedContentHeight;

    if (this._headlineElement) {
      this._headlineElement.style.opacity = scrollTop >= extendedContentHeight ? '1' : '0';
    }

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
