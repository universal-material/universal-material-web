import { PropertyValues } from '@lit/reactive-element';
import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js';

import { styles } from './top-app-bar.styles';

@customElement('u-top-app-bar')
export class UmTopAppBar extends LitElement {

  static override styles = styles;

  /**
   * Whether the app bar has leading icon or not
   *
   * _Note:_ Readonly
   */
  @property({type: Boolean, attribute: 'has-leading-icon', reflect: true}) hasLeadingIcon = false;

  /**
   * Whether the app bar has trailing icon or not
   *
   * _Note:_ Readonly
   */
  @property({type: Boolean, attribute: 'has-trailing-icon', reflect: true}) hasTrailingIcon = false;

  @property({reflect: true}) position: 'fixed' | 'absolute' | 'static' = 'fixed';

  @property({type: Boolean, attribute: 'container-scrolled', reflect: true})
  containerScrolled: boolean = false;

  @queryAssignedElements({slot: 'leading-icon', flatten: true})
  private readonly assignedLeadingIcons!: HTMLElement[];

  @queryAssignedElements({slot: 'trailing-icon', flatten: true})
  private readonly assignedTrailingIcons!: HTMLElement[];

  @query('.content', true) content!: HTMLElement

  private contentSizeObserver: ResizeObserver | null = null;

  private scrollingContainer: {
    addEventListener: typeof window.addEventListener;
    removeEventListener: typeof window.removeEventListener;
  } | null = null;

  private handleLeadingIconSlotChange() {
    this.hasLeadingIcon = this.assignedLeadingIcons.length > 0;
  }

  private handleTrailingIconSlotChange() {
    this.hasTrailingIcon = this.assignedTrailingIcons.length > 0;
  }

  override render(): HTMLTemplateResult {
    return html`
      <div class="content">
        <div class="icon leading-icon">
          <slot
            name="leading-icon"
            @slotchange="${this.handleLeadingIconSlotChange}"></slot>
        </div>
        <div class="headline">
          <slot></slot>
        </div>

        <div class="icon trailing-icon">
          <slot
            name="trailing-icon"
            @slotchange="${this.handleTrailingIconSlotChange}"></slot>
        </div>
      </div>
    `;
  }

  override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    this.contentSizeObserver = new ResizeObserver(() => this.setContentHeightProperty())
    this.contentSizeObserver.observe(this.content);
    this.setContentHeightProperty();
  }

  override connectedCallback() {
    super.connectedCallback();

    this.scrollingContainer = window;
    window.addEventListener('scroll', this.onContainerScroll);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    this.contentSizeObserver!.disconnect();
    this.contentSizeObserver = null;
    this.scrollingContainer!.removeEventListener('scroll', this.onContainerScroll);
  }

  onContainerScroll = (e: Event) => {
    const container = e.currentTarget as HTMLElement & Window;

    const scrollTop = UmTopAppBar.getScrollTop(container);

    this.containerScrolled = !!scrollTop;
  }

  private static getScrollTop(container: HTMLElement & Window): number | null {
    if (typeof container.scrollY === 'number') {
      return container.scrollY;
    }

    if (typeof container.scrollTop === 'number') {
      return container.scrollTop;
    }

    return document.body.scrollTop;
  }

  private setContentHeightProperty() {
    this.style.setProperty('--_content-height', `${this.content.clientHeight}px`);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'u-top-app-bar': UmTopAppBar;
  }
}
